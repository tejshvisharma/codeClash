
import { db } from "../libs/db.js";
import {
  getJudge0LanguageId,
  submitBatch,
  pollBatchResult,
} from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
  const userId = req.user?.id;

  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized - Admin access required",
    });
  }
  try {
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        return res.status(400).json({
          success: false,
          error: `language ${language} is not supported`,
        });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResult = await submitBatch(submissions);

      const tokens = submissionResult.map((res) => res.token);

      const results = await pollBatchResult(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (process.env.NODE_ENV === "development") {
          console.log(`RESULT ${i + 1} for ${language}:`, {
            status: result.status,
            stdout: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            message: result.message,
          });
        }
        if (result.status.id !== 3) {
          return res.status(400).json({
            success: false,
            error: `Testcase ${i + 1} failed for language ${language}`,
          });
        }
      }
    }

    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolutions,
        userId: userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development")
      console.log("Error creating problem: ", err);
    res.status(500).json({
      success: false,
      message: "Error creating problem",
      err: err.message,
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const allExistingProblems = await db.problem.findMany();

    if (allExistingProblems.length === 0) {
      return res
        .status(404)
        .json({ success: false, error: "No problems found" });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      Problems: allExistingProblems,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development")
      console.log("Error fetching problems: ", err);
    res.status(500).json({
      success: false,
      message: "Error fetching problems",
      err: err.message,
    });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProblem = await db.problem.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingProblem) {
      return res.status(404).json({
        success: false,
        error: "Didn't found the problem with given id",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem fetched successfully",
      problem: existingProblem,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development")
      console.log("Error fetching problem by id: ", err);
    res.status(500).json({
      success: false,
      message: "Error fetching problem by id",
      err: err.message,
    });
  }
};

export const updateProblemById = async (req, res) => {
  const userId = req.user?.id;

  // 1. Authorization check
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      error: "Unauthorized - Admin access required",
    });
  }

  try {
    const { id } = req.params;

    // 2. Check if problem exists
    const existingProblem = await db.problem.findUnique({
      where: { id },
    });

    if (!existingProblem) {
      return res.status(404).json({
        success: false,
        error: "Problem not found with given id",
      });
    }

    // 3. Extract fields from body
    const {
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
      referenceSolutions,
    } = req.body;

    // 4. If referenceSolutions are provided → validate with Judge0
    if (referenceSolutions && Object.keys(referenceSolutions).length > 0) {
      if (!testCases || testCases.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Test cases are required when updating reference solutions",
        });
      }

      for (const [language, solutionCode] of Object.entries(
        referenceSolutions
      )) {
        const languageId = getJudge0LanguageId(language);
        if (!languageId) {
          return res.status(400).json({
            success: false,
            error: `language ${language} is not supported`,
          });
        }

        const submissions = testCases.map(({ input, output }) => ({
          source_code: solutionCode,
          language_id: languageId,
          stdin: input,
          expected_output: output,
        }));

        const submissionResult = await submitBatch(submissions);
        const tokens = submissionResult.map((res) => res.token);

        const results = await pollBatchResult(tokens);

        for (let i = 0; i < results.length; i++) {
          const result = results[i];
          if (process.env.NODE_ENV === "development") {
            console.log(`RESULT ${i + 1} for ${language}:`, {
              status: result.status,
              stdout: result.stdout,
              stderr: result.stderr,
              compile_output: result.compile_output,
              message: result.message,
            });
          }
          if (result.status.id !== 3) {
            return res.status(400).json({
              success: false,
              error: `Testcase ${i + 1} failed for language ${language}`,
            });
          }
        }
      }
    }

    // 5. Build updateData dynamically (only provided fields are updated)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (tags !== undefined) updateData.tags = tags;
    if (examples !== undefined) updateData.examples = examples;
    if (constraints !== undefined) updateData.constraints = constraints;
    if (hints !== undefined) updateData.hints = hints;
    if (editorial !== undefined) updateData.editorial = editorial;
    if (testCases !== undefined) updateData.testCases = testCases;
    if (codeSnippets !== undefined) updateData.codeSnippets = codeSnippets;
    if (referenceSolutions !== undefined)
      updateData.referenceSolutions = referenceSolutions;

    // Track who updated it
    updateData.userId = userId;

    // 6. Update problem in DB
    const updatedProblem = await db.problem.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Problem updated successfully",
      problem: updatedProblem,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development")
      console.log("Error updating problem: ", err);

    return res.status(500).json({
      success: false,
      message: "Error updating problem",
      err: err.message,
    });
  }
};

export const deleteProblemById = async (req, res) => {
  try {
    const { id } = req.params;

    const existingProblem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (existingProblem.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Didn't found the problem to delete with given id",
      });
    }

    const deletedProblem = await db.problem.delete({
      where: {
        id,
      },
    });

    if (!deletedProblem) {
      return res.status(500).json({
        success: false,
        message: "Error deleting problem",
        err: err.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Problem deleted successfully",
      problem: deletedProblem,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development")
      console.log("Error deleting problem by id: ", err);
    res.status(500).json({
      success: false,
      message: "Error deleting problem by id",
      err: err.message,
    });
  }
};

export const getProblemsByUserId = async (req, res) => {
  try {
    const { id } = req.params || req.user?.id;

    const existingProblems = await db.problem.findMany({
      where: {
        userId: id,
      },
    });

    if (existingProblems.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Didn't found any problem with given user id",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems: existingProblems,
    });
  } catch (err) {
    if (process.env.NODE_ENV === "development")
      console.log("Error fetching problems by user id: ", err);
    res.status(500).json({
      success: false,
      message: "Error fetching problems by user id",
      err: err.message,
    });
  }
};

export const getProblemsSolvedByUser = async (req, res) => {
  const { userId } = req.user;
  const requestId = req.requestId;
  try {
    const problems = await db.problem.findMany({
      where: {
        solvedBy: {
          some: {
            userId: userId,
          }
        }
      },
      include: {
        solvedBy: {
          where: {
            userId: userId,
          }
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully",
      problems,
    });

  } catch (err) {
    logger.error({ requestId, userId, err: err.message, stack: err.stack }, "Error fetching problemsSolvedByUser");
    return res.status(500).json({
      success: false,
      error: "Error fetching Problems Solved By User",
    });
  }
};