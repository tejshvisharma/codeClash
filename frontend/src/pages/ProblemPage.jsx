import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Code2,
  Users,
  ThumbsUp,
  Home,
  CheckCircle2,
  XCircle,
  Eye,
  Send,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore"; 
import useProblemStore from "../store/useProblemStore";
import { getJudge0LanguageId, languageDisplayNames } from "../lib/languages.js"; 
import  useExecutionStore  from "../store/useExecutionStore";
import  useSubmissionStore  from "../store/useSubmissionStore";
import SubmissionResults from "../components/submissionResults.jsx";


const ProblemPage = () => {
  const { id } = useParams();
  const { authUser } = useAuthStore();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submission: latestSubmission, 
    isLoading: isExecutionLoading,
    executeCode, 
  } = useExecutionStore();

  const {
    submissions, 
    isLoading: isSubmissionsLoading,
    getSubmissionsForProblem, 
    getSubmissionCountForProblem,
    submissionCount,
    successRate,
    getSuccessRateForProblem
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);

  useEffect(() => {
    if (id) {
      getProblemById(id);
      getSubmissionCountForProblem(id);
      getSuccessRateForProblem(id);
    }
  }, [id, getProblemById, getSubmissionCountForProblem, getSuccessRateForProblem]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionsForProblem(id);
    }
  }, [activeTab, id, getSubmissionsForProblem]);

  useEffect(() => {
    if (problem && problem.codeSnippets && selectedLanguage) {
      const snippet = problem.codeSnippets[selectedLanguage.toUpperCase()];
      if (snippet) {
        setCode(snippet);
      }
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    if (problem?.codeSnippets?.[lang.toUpperCase()]) {
      setCode(problem.codeSnippets[lang.toUpperCase()]);
    }
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    if (!problem || !code.trim()) return;

    try {
      const language_id = getJudge0LanguageId(selectedLanguage);
      if (!language_id) {
        console.error("Unsupported language:", selectedLanguage);
        return;
      }
      const stdin = problem.testCases?.map((tc) => tc.input) || [];
      const expected_outputs = problem.testCases?.map((tc) => tc.output) || [];

      // Execute code - this should update the execution store
      executeCode(code, language_id, stdin, expected_outputs, id);
    } catch (error) {
      console.error("Error executing code", error);
    }
  };

  const handleSubmitSolution = (e) => {
    e.preventDefault();
    // Submit is often just a "Run" with all test cases, same as Run
    // For now, let's call it the same as run
    handleRunCode(e);
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-200">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const isSolved = authUser?.solvedProblems?.includes(id);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose prose-invert max-w-none p-6">
            <p className="text-lg mb-6">{problem.description}</p>

            {problem.examples && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Examples
                </h3>
                {Object.entries(problem.examples).map(
                  ([lang, example], idx) => (
                    <div key={lang} className="mb-4">
                      <div className="text-sm text-gray-400 mb-2">
                        Example {idx + 1}
                      </div>
                      <div className="bg-base-200/50 border border-white/10 rounded-xl p-4 space-y-3">
                        <div>
                          <div className="text-xs text-gray-400 mb-1">
                            Input:
                          </div>
                          <pre className="bg-black/30 p-3 rounded-md text-sm overflow-x-auto font-mono">
                            {example.input}
                          </pre>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-1">
                            Output:
                          </div>
                          <pre className="bg-black/30 p-3 rounded-md text-sm overflow-x-auto font-mono">
                            {example.output}
                          </pre>
                        </div>
                        {example.explanation && (
                          <div>
                            <div className="text-xs text-gray-400 mb-1">
                              Explanation:
                            </div>
                            <div className="text-sm text-gray-300">
                              {example.explanation}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {problem.constraints && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" /> Constraints
                </h3>
                <div className="bg-base-200/50 border border-white/10 rounded-xl p-4">
                  <pre className="whitespace-pre-wrap text-sm">
                    {problem.constraints}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );

      case "editorial":
        return (
          <div className="p-6">
            {problem.editorial ? (
              <div className="bg-base-200/50 border border-white/10 rounded-xl p-4">
                <pre className="whitespace-pre-wrap text-sm">
                  {problem.editorial}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No editorial available for this problem.
              </div>
            )}
          </div>
        );

      case "submissions":
        return (
          <div className="p-6">
            {isSubmissionsLoading ? (
              <div className="text-center py-8">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : submissions && submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="card bg-base-200/50 border border-white/10 rounded-xl p-4 hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => {
                      // Navigate to detailed submission page if you have one
                      // navigate(`/submission/${sub.id}`);
                      // Or set it as the latest submission to display results
                      // setLatestSubmission(sub);
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {sub.status === "ACCEPTED" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-error" />
                        )}
                        <span className="font-medium">{sub.language}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(sub.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <span
                          className={`badge text-xs ${
                            sub.status === "ACCEPTED"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {sub.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {sub.memory ? `${sub.memory} MB` : ""} |{" "}
                          {sub.time ? `${sub.time}s` : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No submissions yet for this problem.
              </div>
            )}
          </div>
        );

      case "discussion":
        return (
          <div className="p-6 text-center text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-600 mb-3" />
            <p>Discussion forum coming soon!</p>
            <p className="text-sm mt-2">
              Check back later for community discussions.
            </p>
          </div>
        );

      case "hints":
        return (
          <div className="p-6">
            {problem.hints ? (
              <div className="bg-base-200/50 border border-white/10 rounded-xl p-4">
                <pre className="whitespace-pre-wrap text-sm">
                  {problem.hints}
                </pre>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hints available for this problem.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 max-w-7xl w-full mx-auto">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl m-4 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Link
                to={"/"}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="text-xs">Home</span>
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-xs">{problem.title}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              {problem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <span
                className={`badge ${
                  problem.difficulty === "EASY"
                    ? "badge-success"
                    : problem.difficulty === "MEDIUM"
                    ? "badge-warning"
                    : "badge-error"
                }`}
              >
                {problem.difficulty}
              </span>
              {isSolved && (
                <div className="flex items-center gap-1 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Solved</span>
                </div>
              )}
              <div className="flex gap-1">
                {problem.tags?.map((tag, i) => (
                  <span key={i} className="badge badge-ghost text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{submissionCount || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                <span>{successRate || 0}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(
                    problem.updatedAt || problem.createdAt
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className={`btn btn-sm btn-ghost btn-circle ${
                  isBookmarked ? "text-primary" : ""
                }`}
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button className="btn btn-sm btn-ghost btn-circle">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
        {/* Left Column: Problem Statement & Tabs */}
        <div className="flex flex-col gap-6">
          {/* Problem Tabs Card */}
          <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl overflow-hidden">
            <div className="tabs tabs-lifted tabs-lg">
              {[
                { id: "description", label: "Description", icon: FileText },
                { id: "editorial", label: "Editorial", icon: BookOpen },
                { id: "submissions", label: "Submissions", icon: Code2 },
                { id: "discussion", label: "Discussion", icon: MessageSquare },
                { id: "hints", label: "Hints", icon: Lightbulb },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`tab tab-lg ${
                      activeTab === tab.id
                        ? "tab-active bg-base-100/80 text-primary"
                        : "hover:bg-base-100/20"
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="card-body p-0">{renderTabContent()}</div>
          </div>

          {/* Test Cases Card (Conditional) */}
          {latestSubmission && activeTab !== "submissions" && (
            <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl">
              <div className="card-body p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Eye className="w-5 h-5" /> Execution Result
                  </h3>
                  <button
                    onClick={() =>
                      executeCode(
                        code,
                        getJudge0LanguageId(selectedLanguage),
                        problem.testCases?.map((tc) => tc.input) || [],
                        problem.testCases?.map((tc) => tc.output) || [],
                        id
                      )
                    }
                    className="btn btn-sm btn-ghost gap-1"
                    disabled={isExecutionLoading}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Rerun
                  </button>
                </div>
                {/* Render submission details here using your Submission component or logic */}
                {/* Example placeholder for submission result */}
                <div
                  className={`p-4 rounded-lg ${
                    latestSubmission.status === "ACCEPTED"
                      ? "bg-emerald-500/10 border border-emerald-500/20"
                      : "bg-error/10 border border-error/20"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    {latestSubmission.status === "ACCEPTED" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-error" />
                    )}
                    <span className="font-semibold">
                      {latestSubmission.status}
                    </span>
                  </div>
                  {/* You can map over testCaseResults here if available */}
                  {latestSubmission.stdout && (
                    <div className="mb-2">
                      <div className="text-xs text-gray-400">Output:</div>
                      <pre className="text-sm bg-black/30 p-2 rounded mt-1 overflow-x-auto">
                        {latestSubmission.stdout}
                      </pre>
                    </div>
                  )}
                  {latestSubmission.stderr && (
                    <div>
                      <div className="text-xs text-error">Error:</div>
                      <pre className="text-sm bg-black/30 p-2 rounded mt-1 overflow-x-auto text-error">
                        {latestSubmission.stderr}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Editor */}
        <div className="flex flex-col gap-6">
          {/* Editor Card */}
          <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl overflow-hidden flex-1 flex flex-col">
            <div className="card-body p-0 flex-1 flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5" /> Code Editor
                </h3>
                <select
                  className="select select-sm select-bordered select-primary rounded-lg"
                  value={selectedLanguage}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {Object.keys(problem.codeSnippets || {}).map((lang) => (
                    <option key={lang.toLowerCase()} value={lang.toLowerCase()}>
                      {languageDisplayNames[lang]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={selectedLanguage}
                  theme="vs-dark"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: "on",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    readOnly: false,
                    automaticLayout: true,
                    fontFamily: "'Fira Code', monospace",
                  }}
                />
              </div>
              <div className="p-4 border-t border-white/10 bg-black/10">
                <div className="flex justify-end gap-3">
                  <button
                    className="btn btn-sm btn-ghost gap-2"
                    onClick={handleRunCode}
                    disabled={isExecutionLoading}
                  >
                    <Play className="w-4 h-4" />
                    {isExecutionLoading ? "Running..." : "Run Code"}
                  </button>
                  <button
                    className="btn btn-sm btn-primary gap-2"
                    onClick={handleSubmitSolution}
                    disabled={isExecutionLoading}
                  >
                    <Send className="w-4 h-4" />
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card bg-base-100 shadow-xl mt-6">
        <div className="card-body">
          {latestSubmission ? (
            <SubmissionResults latestSubmission={latestSubmission} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Test Cases</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Input</th>
                      <th>Expected Output</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testCases.map((testCase, index) => (
                      <tr key={index}>
                        <td className="font-mono">{testCase.input}</td>
                        <td className="font-mono">{testCase.output}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
