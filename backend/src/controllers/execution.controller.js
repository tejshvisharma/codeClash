import {
  getLanguageName,
  pollBatchResult,
  submitBatch,
} from "../libs/judge0.lib.js";

import logger from "../utils/logger.js";

import { db } from "../libs/db.js";

export const executeCode = async (req, res) => {
  const requestId = req.requestId; 
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userId = req.user?.id;

    logger.info(
      { requestId, userId, problemId },
      "Received code execution request"
    );

    // validations
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

    if (
      !Array.isArray(stdin) ||
      !Array.isArray(expected_outputs) ||
      stdin.length !== expected_outputs.length
    ) {
      logger.warn({ requestId }, "Validation failed: Invalid test cases");
      return res.status(400).json({
        success: false,
        error: "Invalid or missing test cases",
        requestId,
      });
    }

    // prepare submissions
    const submissions = stdin.map((input, idx) => ({
      source_code,
      language_id,
      stdin: input,
      expected_output: expected_outputs[idx],
    }));

    logger.debug(
      { requestId, submissionsCount: submissions.length },
      "Submitting batch to Judge0"
    );

    // submit batch
    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((submission) => submission.token);

    // poll results
    const results = await pollBatchResult(tokens);

    logger.info({ requestId, tokens }, "Execution completed");

    let allPassed = true;

    const detailedResult = results.map((result, idx) => {
      const passed = result.status.id === 3;

      if (!passed) allPassed = false;

      return {
        testCase: idx + 1,
        testCaseInput: submissions[idx].stdin,
        passed,
        stdout: result.stdout?.trim(),
        expected: submissions[idx].expected_output,
        stderr: result.stderr ?? null,
        compileOutput: result.compile_output ?? null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });
   const submissionWithTestCases = await db.$transaction(async (tx) => {
     // 1. Store submission summary
     const submissionDb = await tx.submission.create({
       data: {
         userId,
         problemId,
         sourceCode: source_code,
         language: getLanguageName(language_id),
         stdin: stdin.join("\n"),
         stdout: JSON.stringify(detailedResult.map((r) => r.stdout)),
         stderr: detailedResult.some((r) => r.stderr)
           ? JSON.stringify(detailedResult.map((r) => r.stderr))
           : null,
         compileOutput: detailedResult.some((r) => r.compileOutput)
           ? JSON.stringify(detailedResult.map((r) => r.compileOutput))
           : null,
         status: allPassed ? "ACCEPTED" : "WRONG ANSWER",
         memory: detailedResult.some((r) => r.memory)
           ? JSON.stringify(detailedResult.map((r) => r.memory))
           : null,
         time: detailedResult.some((r) => r.time)
           ? JSON.stringify(detailedResult.map((r) => r.time))
           : null,
       },
     });

     // 2. If all test cases passed, mark problem as solved for user
     if (allPassed) {
       await tx.problemSolved.upsert({
         where: {
           userId_problemId: {
             userId,
             problemId,
           },
         },
         update: {},
         create: {
           userId,
           problemId,
         },
       });
     }

     // 3. Store all test case details
     const testCaseResults = detailedResult.map((result) => ({
       submissionId: submissionDb.id,
       ...result,
     }));

     await tx.testCaseResult.createMany({
       data: testCaseResults,
     });

     // 4. Return submission with test cases
     return await tx.submission.findUnique({
       where: { id: submissionDb.id },
       include: { testCaseResults: true },
     });
   });

    // send response
    return res.status(200).json({
      success: true,
      message: "Code executed successfully",
      submissionWithTestCases,
      requestId,
    });
  } catch (err) {
    logger.error(
      { requestId, err: err.message, stack: err.stack },
      "Error executing code"
    );

    return res.status(500).json({
      success: false,
      message: "Something went wrong while executing your code",
      requestId,
    });
  }
};
