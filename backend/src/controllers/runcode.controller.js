import {
  getLanguageName,
  submitSingle,
  pollBatchResult2,
} from "../libs/judge0.lib.js";
import logger from "../utils/logger.js";
import { db } from "../libs/db.js";

export const executeCustomCode = async (req, res) => {
  const requestId = req.requestId;
  try {
    const { source_code, language_id, stdin } = req.body;

    // Validate inputs
    if (!source_code || !language_id) {
      logger.warn(
        { requestId },
        "Validation failed: Missing source_code or language_id"
      );
      return res.status(400).json({
        success: false,
        error: "source_code and language_id are required",
        requestId,
      });
    }

    // Submit job to Judge0
    logger.info(
      { requestId, language_id },
      "Submitting code execution job to Judge0"
    );
    console.log("going to submit the batch to judge0\n");
    console.log("with source_code : ", source_code);
    console.log("and language_id", language_id);
    const submitResponse = await submitSingle({
      source_code,
      language_id,
      stdin: stdin || "",
    });

    if (!submitResponse.token) {
      logger.error(
        { requestId },
        "Failed to submit job to Judge0",
        submitResponse
      );
      return res.status(500).json({
        success: false,
        message: "Failed to submit job to Judge0",
        requestId,
      });
    }

    const jobId = submitResponse.token;

    // Poll for job results
    logger.info({ requestId, jobId }, "Polling for job result from Judge0");
    const results = await pollBatchResult2([jobId]);
    const result = results[0];

    console.log("Judge0 result received:", JSON.stringify(result, null, 2));

    if (!result || !result.status) {
      logger.error({ requestId, result }, "Invalid result from Judge0");
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve execution results from Judge0",
        requestId,
      });
    }

    // Get status details
    const statusId = result.status.id;
    const statusDescription = result.status.description;

    // Determine execution outcome based on Judge0 status codes
    const isSuccess = statusId === 3; // Accepted
    const isCompilationError = statusId === 6;
    const isRuntimeError = statusId >= 7 && statusId <= 12;
    const isTimeLimit = statusId === 5;

    // Prepare detailed result
    const detailedResult = {
      testCase: 1,
      testCaseInput: stdin || "",
      passed: isSuccess,
      stdout: result.stdout?.trim() || "",
      expected: "",
      stderr: result.stderr?.trim() || null,
      compileOutput: result.compile_output?.trim() || null,
      status: statusDescription,
      statusId: statusId,
      memory: result.memory ? `${result.memory} KB` : undefined,
      time: result.time ? `${result.time} s` : undefined,
      // Add error categorization
      errorType: isCompilationError
        ? "compilation"
        : isRuntimeError
        ? "runtime"
        : isTimeLimit
        ? "timeout"
        : isSuccess
        ? null
        : "unknown",
    };

    // Log different error types
    if (isCompilationError) {
      logger.warn({ requestId, jobId }, "Compilation error occurred");
    } else if (isRuntimeError) {
      logger.warn({ requestId, jobId }, "Runtime error occurred");
    } else if (isTimeLimit) {
      logger.warn({ requestId, jobId }, "Time limit exceeded");
    }

    // Build response message
    let message = "Code executed successfully";
    if (isCompilationError) {
      message = "Compilation error";
    } else if (isRuntimeError) {
      message = "Runtime error";
    } else if (isTimeLimit) {
      message = "Time limit exceeded";
    } else if (!isSuccess) {
      message = statusDescription;
    }

    // Send response (always 200 for valid API call, success field indicates execution result)
    return res.status(200).json({
      success: isSuccess,
      message: message,
      executionResult: {
        sourceCode: source_code,
        language: language_id,
        stdout: detailedResult.stdout,
        stderr: detailedResult.stderr,
        compileOutput: detailedResult.compileOutput,
        status: detailedResult.status,
        statusId: detailedResult.statusId,
        errorType: detailedResult.errorType,
        memory: detailedResult.memory,
        time: detailedResult.time,
      },
      requestId,
    });
  } catch (err) {
    logger.error(
      { requestId, err: err.message, stack: err.stack },
      "Error executing custom code"
    );
    console.log("error in runcode: ", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong, Error executing custom code",
      requestId,
    });
  }
};
