import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export const getJudge0LanguageId = (language) => {
  const langMap = {
    PYTHON: 71,
    JAVA: 62,
    CPP: 54,
    JAVASCRIPT: 63,
  };
  return langMap[language.toUpperCase()] || null;
};

export const getLanguageName = (language_id) => {
  const langMap = {
    71: "PYTHON",
    62: "JAVA",
    54: "CPP",
    63: "JAVASCRIPT",
  };
  return langMap[language_id] || null;
};

export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_BASE_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );
  if (process.env.NODE_ENV === "development")
    console.log("Submissions response: ", data);
  return data; // Returns an array of submission IDs : [{token1}, {token2}, ...]
};

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResult = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_BASE_URL}/submissions/batch`,
      {
        params: {
          tokens: tokens.join(","),
          base64_encoded: false,
        },
      }
    );

    const results = data.submissions;

    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2
    );

    if (isAllDone) {
      return results;
    }

    await sleep(1000);
  }
};

export const pollBatchResult2 = async (tokens) => {
  try {
    while (true) {
      const { data } = await axios.get(
        `${process.env.JUDGE0_API_BASE_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(","),
            base64_encoded: true,
          },
        }
      );

      const results = data.submissions;

      const isAllDone = results.every((result) => {
        // Check if result or result.status is missing
        if (!result || !result.status) return true;
        return result.status.id !== 1 && result.status.id !== 2;
      });

      if (isAllDone) {
        // Decode base64 fields in results
        const decodedResults = results.map((result) => ({
          ...result,
          stdout: result.stdout
            ? Buffer.from(result.stdout, "base64").toString("utf-8")
            : null,
          stderr: result.stderr
            ? Buffer.from(result.stderr, "base64").toString("utf-8")
            : null,
          compile_output: result.compile_output
            ? Buffer.from(result.compile_output, "base64").toString("utf-8")
            : null,
          message: result.message
            ? Buffer.from(result.message, "base64").toString("utf-8")
            : null,
        }));
        return decodedResults;
      }

      await sleep(1000);
    }
  } catch (error) {
    console.error("Error polling Judge0 results:", error.message);
    if (error.response) {
      console.error("Judge0 error response:", error.response.data);
    }
    // Re-throw to let controller handle it
    throw error;
  }
};

export const submitSingle = async (submission) => {
  try {
    // Encode source_code and stdin to base64
    const encodedSubmission = {
      source_code: Buffer.from(submission.source_code).toString("base64"),
      language_id: submission.language_id,
      stdin: Buffer.from(submission.stdin || "").toString("base64"),
    };

    const { data } = await axios.post(
      `${process.env.JUDGE0_API_BASE_URL}/submissions?base64_encoded=true`,
      encodedSubmission
    );
    if (process.env.NODE_ENV === "development")
      console.log("Submissions response: ", data);
    return data;
  } catch (error) {
    console.error("Error submitting to Judge0:", error.message);
    if (error.response) {
      console.error("Judge0 error response:", error.response.data);
    }
    // Re-throw original error to let controller handle it
    throw error;
  }
};
