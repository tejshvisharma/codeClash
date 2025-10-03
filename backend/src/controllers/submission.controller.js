import { db } from "../libs/db.js";
import logger from "../utils/logger.js";

export const getAllSubmissions = async (req, res) => {
  const { userId } = req.user;
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
  const { userId } = req.user;
  const { problemId } = req.params;
  const requestId = req.requestId; 

  try {
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
