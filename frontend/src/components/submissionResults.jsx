import React from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const SubmissionResults = ({ latestSubmission }) => {
  // submissionWithTestCases is the nested object according to your shape
  console.log("latestSubmission : ", latestSubmission);
  
  const submissionData = latestSubmission || {};
  console.log("submissionData : ",submissionData);
  // Parse memory/time arrays if present (they may be stringified JSON)
  let memoryArr = [];
  let timeArr = [];
  try {
    if (submissionData?.memory) {
      memoryArr = JSON.parse(submissionData.memory);
    }
  } catch (e) {
    console.error("Error parsing memory array:", e);
    memoryArr = [];
  }
  try {
    if (submissionData?.time) {
      timeArr = JSON.parse(submissionData.time);
    }
  } catch (e) {
    console.error("Error parsing time array:", e);
    timeArr = [];
  }

  // Compute averages safely (memory entries may be strings like "6960 KB")
  const parseMemoryValue = (m) => {
    if (!m) return 0;
    // strip non-digits and parse; handle "6960 KB" or numeric strings
    const digits = String(m).match(/-?[\d.]+/);
    return digits ? parseFloat(digits[0]) : 0;
  };

  const avgMemory =
    memoryArr.length > 0
      ? memoryArr.map(parseMemoryValue).reduce((a, b) => a + b, 0) /
        memoryArr.length
      : 0;

  // timeArr elements might be strings like "0.049 s" or numeric strings
  const parseTimeValue = (t) => {
    if (!t) return 0;
    const digits = String(t).match(/-?[\d.]+/);
    return digits ? parseFloat(digits[0]) : 0;
  };

  const avgTime =
    timeArr.length > 0
      ? timeArr.map(parseTimeValue).reduce((a, b) => a + b, 0) / timeArr.length
      : 0;

  // Use testCaseResults from submissionWithTestCases
  const testCaseResults = submissionData?.testCaseResults || [];
  const passedTests = testCaseResults.filter((tc) => tc?.passed).length;
  const totalTests = testCaseResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  // Top-level status (use latestSubmission.status if available)
  const overallStatus = latestSubmission?.status || "Unknown";

  return (
    <div className="space-y-6">
      {/* Overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Status</h3>
            <div
              className={`text-lg font-bold ${
                overallStatus === "ACCEPTED" ? "text-success" : "text-error"
              }`}
            >
              {overallStatus}
            </div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Success Rate</h3>
            <div className="text-lg font-bold">{successRate.toFixed(1)}%</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Avg. Runtime
            </h3>
            <div className="text-lg font-bold">{avgTime.toFixed(3)} s</div>
          </div>
        </div>

        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Memory className="w-4 h-4" />
              Avg. Memory
            </h3>
            <div className="text-lg font-bold">{avgMemory.toFixed(0)} KB</div>
          </div>
        </div>
      </div>

      {/* Test cases table */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Test Cases Results</h2>

          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Input</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {testCaseResults.map((testCase) => {
                  // use stable key (id from backend). fallback to index only if id missing.
                  const key = testCase?.id ?? `${testCase?.testCase ?? "idx"}`;

                  // values from your provided object
                  const input = testCase?.testCaseInput ?? "N/A";
                  const expected = testCase?.expected ?? "N/A";
                  const output = testCase?.stdout ?? "N/A";
                  const memory = testCase?.memory ?? "N/A";
                  const time = testCase?.time ?? "N/A";

                  return (
                    <tr key={key}>
                      <td>
                        {testCase?.passed ? (
                          <div className="flex items-center gap-2 text-success">
                            <CheckCircle2 className="w-5 h-5" />
                            Passed
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-error">
                            <XCircle className="w-5 h-5" />
                            Failed
                          </div>
                        )}
                      </td>

                      {/* Input */}
                      <td className="font-mono break-words max-w-xs">
                        {input}
                      </td>

                      {/* Expected */}
                      <td className="font-mono break-words max-w-xs">
                        {expected}
                      </td>

                      {/* Your Output */}
                      <td className="font-mono break-words max-w-xs">
                        {output}
                      </td>

                      {/* Memory */}
                      <td>{memory}</td>

                      {/* Time */}
                      <td>{time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* In case there are no test cases */}
            {testCaseResults.length === 0 && (
              <div className="p-4 text-sm text-muted">
                No test case results yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
