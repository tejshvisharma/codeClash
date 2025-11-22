// frontend/src/pages/ProblemPage.jsx
import React, { useState, useEffect, useRef } from "react";
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
  Maximize,
  Minimize,
  Plus,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import useProblemStore from "../store/useProblemStore";
import { getJudge0LanguageId, languageDisplayNames } from "../lib/languages.js";
import useExecutionStore from "../store/useExecutionStore";
import useSubmissionStore from "../store/useSubmissionStore";
import SubmissionResults from "../components/submissionResults.jsx";
import SubmissionsList from "../components/submissionsList.jsx";
import CreatePlaylistModel from "../components/CreatePlaylistModel.jsx";
import AddToPlaylistModal from "../components/AddToPlaylist.jsx";

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
    getSuccessRateForProblem,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript"); // Or your default
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testCases, setTestCases] = useState([]);
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);

  const editorCardRef = useRef(null);

  // addToPlaylist states and hooks :
   const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
     useState(false);

  const openAddToPlaylistModal = () => {
    if (problem) {
      setIsAddToPlaylistModalOpen(true);
    }
  };

  // Function to close the modal
  const closeAddToPlaylistModal = () => {
    setIsAddToPlaylistModalOpen(false);
  };
  const toggleEditorFullscreen = () => {
    if (!editorCardRef.current) {
      console.error("Editor card ref is not attached.");
      return;
    }

    if (!isEditorFullscreen) {
      // Enter fullscreen
      if (editorCardRef.current.requestFullscreen) {
        editorCardRef.current.requestFullscreen();
      } else if (editorCardRef.current.mozRequestFullScreen) {
        // Firefox
        editorCardRef.current.mozRequestFullScreen();
      } else if (editorCardRef.current.webkitRequestFullscreen) {
        // Chrome, Safari & Opera
        editorCardRef.current.webkitRequestFullscreen();
      } else if (editorCardRef.current.msRequestFullscreen) {
        // IE/Edge
        editorCardRef.current.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari & Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen change events to update state
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Check if the current fullscreen element is our editor card
      setIsEditorFullscreen(
        !!document.fullscreenElement &&
          document.fullscreenElement === editorCardRef.current
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // Safari
    document.addEventListener("mozfullscreenchange", handleFullscreenChange); // Firefox
    document.addEventListener("MSFullscreenChange", handleFullscreenChange); // IE/Edge

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []); // Run once on mount

  useEffect(() => {
    if (id) {
      getProblemById(id);
      getSubmissionCountForProblem(id);
      getSuccessRateForProblem(id);
    }
  }, [
    id,
    getProblemById,
    getSubmissionCountForProblem,
    getSuccessRateForProblem,
  ]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionsForProblem(id);
    }
  }, [activeTab, id, getSubmissionsForProblem]);

  // The useEffect for problem and testCases initialization now only runs once when the problem is loaded
  useEffect(() => {
    if (problem && problem.codeSnippets && problem.testCases) {
      // Initialize code with default language snippet only when problem loads
      const defaultSnippet =
        problem.codeSnippets[selectedLanguage.toUpperCase()]; // Use the current state value
      if (defaultSnippet) {
        setCode(defaultSnippet);
      }
      // Initialize test cases
      setTestCases(
        problem.testCases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem]); // Only run when the problem object itself changes

  // Create the function to handle loading a submission
  const onLoadSubmission = (language, code) => {
    // Update the language and code directly
    // This will NOT trigger the useEffect that loads default snippets
    setSelectedLanguage(language);
    setCode(code);
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    // Load the default snippet for the new language
    // This is the *only* place where default snippets are loaded
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-300 to-base-200 w-full">
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
          <div className="mt-8">
            <SubmissionsList
              submissions={submissions}
              isLoading={isSubmissionsLoading}
              setCode={setCode}
              onLoadSubmission={onLoadSubmission}
            />
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
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 w-full">
      {" "}
      {/* Added p-4 here for consistent page padding */}
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl mb-6 overflow-hidden">
        {" "}
        {/* Added mb-6 for spacing below header */}
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
              {/* Add to Playlist Button */}
              <button
                onClick={openAddToPlaylistModal}
                className="btn btn-sm btn-ghost btn-circle tooltip tooltip-top"
                data-tip="Add to Playlist"
                aria-label={`Add ${
                  problem?.title || "this problem"
                } to playlist`}
              >
                <Plus className="w-4 h-4" /> 
              </button>
              <button className="btn btn-sm btn-ghost btn-circle">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {" "}
        {/* Moved p-4 to parent div, removed from here */}
        {/* Left Column: Problem Statement & Tabs */}
        <div className="flex flex-col gap-6">
          {/* Problem Tabs Card */}
          <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl overflow-hidden flex-1">
            {" "}
            {/* Added flex-1 to make card grow */}
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
            <div className="card-body p-0 flex-1">
              {" "}
              {/* Added flex-1 to make body grow */}
              {renderTabContent()}
            </div>
          </div>
        </div>
        {/* Right Column: Editor */}
        <div className="flex flex-col gap-6">
          {" "}
          <div
            ref={editorCardRef} // Attach the ref here
            className={`card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl overflow-hidden flex-1 flex flex-col ${
              isEditorFullscreen ? "fixed inset-0 z-50" : ""
            }`}
          >
            <div className="card-body p-0 flex-1 flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5" /> Code Editor
                </h3>
                <div className="flex items-center gap-2">
                  {" "}
                  {/* Group language selector and buttons */}
                  <select
                    className="select select-sm select-bordered select-primary rounded-lg"
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    {Object.keys(problem.codeSnippets || {}).map((lang) => (
                      <option
                        key={lang.toLowerCase()}
                        value={lang.toLowerCase()}
                      >
                        {languageDisplayNames[lang]}
                      </option>
                    ))}
                  </select>
                  {/* Fullscreen Toggle Button */}
                  <button
                    className="btn btn-sm btn-ghost btn-circle tooltip tooltip-top"
                    data-tip={
                      isEditorFullscreen
                        ? "Exit Fullscreen"
                        : "Enter Fullscreen"
                    }
                    onClick={toggleEditorFullscreen}
                    aria-label={
                      isEditorFullscreen
                        ? "Exit editor fullscreen"
                        : "Enter editor fullscreen"
                    }
                  >
                    {isEditorFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}{" "}
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%" // Height is now controlled by the flex parent
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
                    disabled={isExecutionLoading || isEditorFullscreen} // Optionally disable during fullscreen
                  >
                    <Play className="w-4 h-4" />
                    {isExecutionLoading ? "Running..." : "Run Code"}
                  </button>
                  <button
                    className="btn btn-sm btn-primary gap-2"
                    onClick={handleSubmitSolution}
                    disabled={isExecutionLoading || isEditorFullscreen} // Optionally disable during fullscreen
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
      {/* Results/Test Cases Card - Now uses glassmorphism style */}
      <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl mt-6 overflow-hidden">
        {" "}
        {/* Updated styling */}
        <div className="card-body p-6">
          {" "}
          {/* Added consistent padding */}
          {latestSubmission ? (
            <SubmissionResults latestSubmission={latestSubmission} />
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Test Cases</h3>
              </div>
              {testCases.length > 0 ? (
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
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {" "}
                  {/* Added empty state message */}
                  <p>No test cases available for this problem.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {/* Render the AddToPlaylistModal for the Problem Page */}
      {problem && (
        <AddToPlaylistModal
          isOpen={isAddToPlaylistModalOpen}
          onClose={closeAddToPlaylistModal}
          problemIdToAdd={problem.id} // Pass the current problem's ID
          problemTitle={problem.title} // Pass the current problem's title
        />
      )}
    </div>
  );
};

export default ProblemPage;
