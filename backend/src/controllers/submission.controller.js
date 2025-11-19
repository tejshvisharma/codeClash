import { db } from "../libs/db.js";
import logger from "../utils/logger.js";

export const getAllSubmissions = async (req, res) => {
  const userId = req.user?.id;
  const requestId = req.requestId; 

  try {
    const submissions = await db.submission.findMany({
      where: {
        userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (err) {
    logger.error(
      { requestId, userId, err: err.message, stack: err.stack },
      "Error fetching submissions"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching submissions",
    });
  }
};
export const getSubmissionsByProblemId = async (req, res) => {
  const  userId  = req.user?.id;
  const { problemId } = req.params;
  const requestId = req.requestId; 

  try {

    const problem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId: problemId,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      message: "Submission fetched successfully",
      submissions,
    });
  } catch (err) {
    logger.error(
      { requestId, userId, problemId, err: err.message, stack: err.stack },
      "Error fetching submission"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching submission",
    });
  }
};
export const getSubmissionsCountForProblem = async (req, res) => { 
    const { problemId } = req.params;
    const requestId = req.requestId; 
    try {
        const submissionsCount = await db.submission.count({
            where: {
                problemId: problemId,
            },
        });

        return res.status(200).json({
            success: true,
            message: "Submissions count fetched successfully",
            count: submissionsCount,
        });
    } catch (err) {
        logger.error(
            { requestId, problemId, err: err.message, stack: err.stack },
            "Error fetching submissions count"
        );
        return res.status(500).json({
            success: false,
            error: "Error fetching submissions count",
        });
    }
};
export const getSubmissionsForProblem = async (req, res) => {
  const userId = req.user?.id;
  const { problemId } = req.params;
  const requestId = req.requestId;

  try {
    // Verify problem exists
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    // Get user's submissions for this problem
    const submissions = await db.submission.findMany({
      where: {
        userId,
        problemId,
      },
      orderBy: { createdAt: "desc" },
      take: 20, // Limit to last 20 submissions
      include: {
        testCaseResults: {
          select: {
            testCase: true,
            passed: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: "Submissions fetched successfully",
      submissions,
    });
  } catch (err) {
    logger.error(
      { requestId, userId, problemId, err: err.message, stack: err.stack },
      "Error fetching submissions for problem"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching submissions",
    });
  }
};

export const getSuccessRateForProblem = async (req, res) => {
  const { problemId } = req.params;
  const requestId = req.requestId;

  try {
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found",
      });
    }

    const submissions = await db.submission.findMany({
      where: { problemId },
    });

    const totalSubmissions = submissions.length;

    if (totalSubmissions === 0) {
      return res.status(200).json({
        success: true,
        message: "No submissions yet",
        successRate: 0,
      });
    }

    const successfulSubmissions = submissions.filter(
      (s) => s.status === "ACCEPTED"
    ).length;

    const successRate = Math.round((successfulSubmissions / totalSubmissions) * 100);

    return res.status(200).json({
      success: true,
      message: "Success rate fetched successfully",
      successRate,
    });
  } catch (error) {
    logger.error(
      { requestId, problemId, err: error.message, stack: error.stack },
      "Error fetching success rate"
    );
    return res.status(500).json({
      success: false,
      error: "Error fetching success rate",
    });
  }
};

