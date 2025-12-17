import { db } from "../libs/db.js";
import logger from "../utils/logger.js";

// Helper function to calculate streaks
const calculateStreaks = (solvedProblems) => {
  if (!solvedProblems.length) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  // Sort by date
  const dates = solvedProblems
    .map((p) => new Date(p.createdAt).toDateString())
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => new Date(b) - new Date(a));

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Check current streak
  if (dates[0] === today || dates[0] === yesterday) {
    currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const diffDays = Math.floor(
        (prevDate - currDate) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        currentStreak++;
        tempStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate max streak
  tempStreak = 1;
  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i - 1]);
    const currDate = new Date(dates[i]);
    const diffDays = Math.floor((prevDate - currDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  maxStreak = Math.max(maxStreak, currentStreak, tempStreak);

  return { currentStreak, maxStreak };
};

// Get user profile overview
export const getUserProfile = async (req, res) => {
  const userId = req.user?.id;
  const requestId = req.requestId;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get solved problems count
    const solvedProblems = await db.problemSolved.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            difficulty: true,
          },
        },
      },
    });

    const totalSolved = solvedProblems.length;
    const easySolved = solvedProblems.filter(
      (p) => p.problem.difficulty === "EASY"
    ).length;
    const mediumSolved = solvedProblems.filter(
      (p) => p.problem.difficulty === "MEDIUM"
    ).length;
    const hardSolved = solvedProblems.filter(
      (p) => p.problem.difficulty === "HARD"
    ).length;

    // Get total problems count
    const totalProblems = await db.problem.count();
    const easyProblems = await db.problem.count({
      where: { difficulty: "EASY" },
    });
    const mediumProblems = await db.problem.count({
      where: { difficulty: "MEDIUM" },
    });
    const hardProblems = await db.problem.count({
      where: { difficulty: "HARD" },
    });

    // Get submissions stats
    const submissions = await db.submission.findMany({
      where: { userId },
      select: {
        status: true,
        language: true,
        createdAt: true,
      },
    });

    const totalSubmissions = submissions.length;
    const acceptedSubmissions = submissions.filter((s) =>
      s.status.toLowerCase().includes("accepted")
    ).length;
    const acceptanceRate =
      totalSubmissions > 0
        ? ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1)
        : 0;

    // Get playlists
    const playlists = await db.playlist.findMany({
      where: { userId },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    // Calculate streaks
    const streaks = calculateStreaks(solvedProblems);

    // Calculate rank percentile (mock for now, you can implement real ranking logic)
    const totalUsers = await db.user.count();
    const usersWithMoreSolutions = await db.problemSolved.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
      having: {
        id: {
          _count: {
            gt: totalSolved,
          },
        },
      },
    });

    const rank = usersWithMoreSolutions.length + 1;
    const percentile =
      totalUsers > 0
        ? (((totalUsers - rank + 1) / totalUsers) * 100).toFixed(1)
        : 100;

    return res.status(200).json({
      success: true,
      profile: {
        user,
        stats: {
          totalSolved,
          easySolved,
          mediumSolved,
          hardSolved,
          totalProblems,
          easyProblems,
          mediumProblems,
          hardProblems,
          totalSubmissions,
          acceptedSubmissions,
          acceptanceRate,
          currentStreak: streaks.currentStreak,
          maxStreak: streaks.maxStreak,
          rank,
          percentile,
          totalUsers,
        },
        playlists: playlists.map((playlist) => ({
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          totalProblems: playlist.problems.length,
          solvedProblems: playlist.problems.filter((p) =>
            solvedProblems.some((sp) => sp.problemId === p.problemId)
          ).length,
          createdAt: playlist.createdAt,
        })),
      },
    });
  } catch (err) {
    logger.error(
      { requestId, userId, err: err.message, stack: err.stack },
      "Error fetching user profile"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching user profile",
    });
  }
};

// Get activity calendar data
export const getActivityCalendar = async (req, res) => {
  const userId = req.user?.id;
  const requestId = req.requestId;

  try {
    const solvedProblems = await db.problemSolved.findMany({
      where: { userId },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by date
    const activityMap = {};
    solvedProblems.forEach((problem) => {
      const date = new Date(problem.createdAt).toISOString().split("T")[0];
      activityMap[date] = (activityMap[date] || 0) + 1;
    });

    // Convert to array format
    const activity = Object.entries(activityMap).map(([date, count]) => ({
      date,
      count,
    }));

    return res.status(200).json({
      success: true,
      activity,
    });
  } catch (err) {
    logger.error(
      { requestId, userId, err: err.message, stack: err.stack },
      "Error fetching activity calendar"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching activity calendar",
    });
  }
};

// Get language usage statistics
export const getLanguageStats = async (req, res) => {
  const userId = req.user?.id;
  const requestId = req.requestId;

  try {
    const submissions = await db.submission.findMany({
      where: { userId },
      select: {
        language: true,
      },
    });

    // Count by language
    const languageMap = {};
    submissions.forEach((sub) => {
      const lang = sub.language;
      languageMap[lang] = (languageMap[lang] || 0) + 1;
    });

    // Convert to array and calculate percentages
    const totalSubmissions = submissions.length;
    const languages = Object.entries(languageMap)
      .map(([language, count]) => ({
        language,
        count,
        percentage:
          totalSubmissions > 0
            ? ((count / totalSubmissions) * 100).toFixed(1)
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    return res.status(200).json({
      success: true,
      languages,
    });
  } catch (err) {
    logger.error(
      { requestId, userId, err: err.message, stack: err.stack },
      "Error fetching language stats"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching language stats",
    });
  }
};

// Get recent activity
export const getRecentActivity = async (req, res) => {
  const userId = req.user?.id;
  const requestId = req.requestId;
  const limit = parseInt(req.query.limit) || 10;

  try {
    const recentSolved = await db.problemSolved.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            id: true,
            title: true,
            difficulty: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return res.status(200).json({
      success: true,
      recentActivity: recentSolved.map((item) => ({
        id: item.id,
        problemId: item.problem.id,
        problemTitle: item.problem.title,
        difficulty: item.problem.difficulty,
        solvedAt: item.createdAt,
      })),
    });
  } catch (err) {
    logger.error(
      { requestId, userId, err: err.message, stack: err.stack },
      "Error fetching recent activity"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching recent activity",
    });
  }
};

// Get submission trends over time
export const getSubmissionTrends = async (req, res) => {
  const userId = req.user?.id;
  const requestId = req.requestId;
  const days = parseInt(req.query.days) || 30;

  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const submissions = await db.submission.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    // Group by date
    const trendsMap = {};
    submissions.forEach((sub) => {
      const date = new Date(sub.createdAt).toISOString().split("T")[0];
      if (!trendsMap[date]) {
        trendsMap[date] = { total: 0, accepted: 0 };
      }
      trendsMap[date].total++;
      if (sub.status.toLowerCase().includes("accepted")) {
        trendsMap[date].accepted++;
      }
    });

    // Convert to array format
    const trends = Object.entries(trendsMap).map(([date, data]) => ({
      date,
      totalSubmissions: data.total,
      acceptedSubmissions: data.accepted,
      successRate:
        data.total > 0 ? ((data.accepted / data.total) * 100).toFixed(1) : 0,
    }));

    return res.status(200).json({
      success: true,
      trends,
    });
  } catch (err) {
    logger.error(
      { requestId, userId, err: err.message, stack: err.stack },
      "Error fetching submission trends"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching submission trends",
    });
  }
};

// Get problem difficulty breakdown with acceptance rates
export const getProblemStats = async (req, res) => {
  const userId = req.user?.id;
  const requestId = req.requestId;

  try {
    // Get solved problems by difficulty
    const solvedProblems = await db.problemSolved.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            difficulty: true,
          },
        },
      },
    });

    // Get submissions by difficulty
    const submissions = await db.submission.findMany({
      where: { userId },
      include: {
        problem: {
          select: {
            difficulty: true,
          },
        },
      },
    });

    // Calculate stats by difficulty
    const difficulties = ["EASY", "MEDIUM", "HARD"];
    const stats = difficulties.map((difficulty) => {
      const solved = solvedProblems.filter(
        (p) => p.problem.difficulty === difficulty
      ).length;
      const totalAttempts = submissions.filter(
        (s) => s.problem.difficulty === difficulty
      ).length;
      const accepted = submissions.filter(
        (s) =>
          s.problem.difficulty === difficulty &&
          s.status.toLowerCase().includes("accepted")
      ).length;

      return {
        difficulty,
        solved,
        totalAttempts,
        accepted,
        acceptanceRate:
          totalAttempts > 0 ? ((accepted / totalAttempts) * 100).toFixed(1) : 0,
      };
    });

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (err) {
    logger.error(
      { requestId, userId, err: err.message, stack: err.stack },
      "Error fetching problem stats"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching problem stats",
    });
  }
};
