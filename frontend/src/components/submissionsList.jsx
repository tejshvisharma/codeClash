import React, { useState, useRef, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
  Calendar,
  Eye,
  Code,
  Copy,
  CopyCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { submissionCardLang } from "../lib/languages";
import useExecutionStore from "../store/useExecutionStore";

const safeParse = (data) => {
  if (data == null) return [];
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch (err) {
      return [data];
    }
  }
  // If it's already an array/object, return it as-is
  return Array.isArray(data) ? data : [data];
};

// calculateAverage now handles numbers, strings, arrays and trims unit safely
const calculateAverage = (dataInput, unit = "") => {
  const dataArray = safeParse(dataInput);
  if (!Array.isArray(dataArray) || dataArray.length === 0) return 0;

  const values = dataArray
    .map((item) => {
      if (item == null) return NaN;
      // If item is object with time prop, try that
      if (typeof item === "object" && "time" in item)
        return parseFloat(String(item.time).replace(unit, ""));
      return parseFloat(String(item).replace(unit, "").trim());
    })
    .filter((v) => !isNaN(v));

  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
};

const SubmissionsList = ({
  submissions = [],
  isLoading = false,
  onLoadSubmission,
}) => {
  const { changeSubmission } = useExecutionStore();
  const [copiedCodeId, setCopiedCodeId] = useState(null);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup timers on unmount
      if (copyTimerRef.current) {
        clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  const handleCopyCode = async (code, id) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code ?? "");
      } else {
        // fallback: older browsers
        const ta = document.createElement("textarea");
        ta.value = code ?? "";
        ta.setAttribute("readonly", "");
        ta.style.position = "absolute";
        ta.style.left = "-9999px";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }

      setCopiedCodeId(id);

      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => {
        setCopiedCodeId(null);
        copyTimerRef.current = null;
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  // Handler for clicking on a submission card
  const handleSubmissionClick = (submission) => {
    console.log("submission from handleSubmissionClick : ", submission);
    // Update the submission store with the clicked submission
    changeSubmission(submission);
    // Use the new prop to handle loading the submission, which will set the language and code
    onLoadSubmission(submission.language.toLowerCase(), submission.sourceCode);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span
          className="loading loading-spinner loading-lg text-primary"
          aria-hidden
        />
        <span className="sr-only">Loading submissions</span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-8 bg-base-100 rounded-box shadow">
        <div className="text-base-content/70 text-lg">No Submissions Yet</div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-[600px] pr-0.5 scrollbar-hide">
      {" "}
      {submissions.map((submission) => {
        const testCaseResults = Array.isArray(submission?.testCaseResults)
          ? submission.testCaseResults
          : safeParse(submission?.testCaseResults);

        const passedTests = testCaseResults.filter((tc) => tc?.passed).length;
        const totalTests = testCaseResults.length;
        const successRate =
          totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

        const overallStatusRaw = submission?.status ?? "Unknown";
        const overallStatus = String(overallStatusRaw);
        const statusNormalized = overallStatus.toLowerCase();

        const avgTime = calculateAverage(submission?.time ?? [], "s");
        const avgMemory = calculateAverage(submission?.memory ?? [], "KB");

        const statusClass =
          statusNormalized === "accepted"
            ? "text-success"
            : statusNormalized.includes("wrong")
            ? "text-error"
            : statusNormalized.includes("time")
            ? "text-warning"
            : "text-neutral";

        // createdAt formatting with fallback
        let createdAtStr = "-";
        let createdAtTime = "-";
        if (submission?.createdAt) {
          const d = new Date(submission.createdAt);
          if (!isNaN(d.getTime())) {
            createdAtStr = d.toLocaleDateString();
            createdAtTime = d.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }); // e.g., "14:30"
          }
        }

        return (
          <div
            key={submission.id ?? Math.random()}
            onClick={() => handleSubmissionClick(submission)}
            className={`card bg-base-100 shadow-lg rounded-box mb-3 cursor-pointer transition-all duration-200 hover:shadow-xl border border-base-200 hover:border-primary/50 backdrop-blur-sm bg-opacity-70 bg-gradient-to-br from-base-100/80 to-base-200/60`}
            role="button" // Accessibility for click handlers
            tabIndex="0" // Accessibility for keyboard navigation
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleSubmissionClick(submission);
              }
            }}
          >
            <div className="card-body p-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center">
                {/* Left side: Status, Language, Success Rate */}
                <div className="flex flex-wrap items-center gap-3">
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusClass} bg-base-200/50 backdrop-blur-sm`}
                    aria-hidden
                  >
                    {statusNormalized === "accepted" ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    {overallStatus}
                  </div>

                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary backdrop-blur-sm">
                    {submissionCardLang(submission.language) ?? "—"}
                  </div>

                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent backdrop-blur-sm">
                    {successRate.toFixed(1)}% ({passedTests}/{totalTests})
                  </div>
                </div>

                {/* Right side: Time, Memory, Date, Time, Actions */}
                <div className="flex flex-wrap items-center justify-end gap-4">
                  <div className="flex items-center gap-1 text-sm text-base-content/80">
                    <Clock className="w-4 h-4" />
                    <span>
                      {Number.isFinite(avgTime)
                        ? avgTime.toFixed(3) + "s"
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-base-content/80">
                    <Memory className="w-4 h-4" />
                    <span>
                      {Number.isFinite(avgMemory)
                        ? avgMemory.toFixed(0) + "KB"
                        : "-"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-base-content/80">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {createdAtStr} {createdAtTime}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click event
                        handleCopyCode(
                          submission.sourceCode ?? "",
                          submission.id
                        );
                      }}
                      className="btn btn-xs btn-ghost btn-circle tooltip tooltip-top"
                      data-tip={
                        copiedCodeId === submission.id ? "Copied!" : "Copy Code"
                      }
                      aria-label="Copy submission code"
                    >
                      {copiedCodeId === submission.id ? (
                        <CopyCheck className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
