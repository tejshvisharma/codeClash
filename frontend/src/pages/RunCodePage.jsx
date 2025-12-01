// frontend/src/pages/RunCodePage.jsx
import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  RotateCcw,
  Code2,
  Plus,
  Maximize,
  Minimize,
} from "lucide-react";
import  useExecutionStore  from "../store/useExecutionStore"; // Import the store
import SubmissionResults from "../components/submissionResults"; // Reuse the results component
import { getJudge0LanguageId, languageDisplayNames } from "../lib/languages"; // Import language helpers

const RunCodePage = () => {
  const [code, setCode] = useState("");
  const [customInput, setCustomInput] = useState(""); // State for user's custom stdin
  const [selectedLanguage, setSelectedLanguage] = useState("javascript"); // State for language
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [output, setOutput] = useState(""); // State for custom output if not using SubmissionResults
  const [isLoading, setIsLoading] = useState(false); // Local loading state for run button
  const [error, setError] = useState(null); // Local error state for output area

  // Access store state and actions
  const {
    submission: latestSubmission,
    isLoading: isExecutionLoading,
    executeCode,
    error: storeError,
  } = useExecutionStore();

  // Ref for fullscreen
  const editorCardRef = React.useRef(null);

  const handleRunCode = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null); // Clear any previous local error

    if (!code.trim()) {
      setError("Code is empty");
      setIsLoading(false);
      return;
    }

    try {
      const language_id = getJudge0LanguageId(selectedLanguage);
      if (!language_id) {
        setError(`Unsupported language: ${selectedLanguage}`);
        setIsLoading(false);
        return;
      }

      // Execute code using the existing store action
      // Pass the user's custom input as 'stdin'
      // Pass an empty array for 'expected_outputs' since it's custom code
      await executeCode(code, language_id, customInput, []);

      // Optionally, clear the custom input after running
      // setCustomInput("");
    } catch (err) {
      console.error("Error executing custom code", err);
      setError(err.message || "An error occurred while executing the code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    // Optionally, reset code to a default snippet for the new language if desired
    // setCode(problem.codeSnippets[lang.toUpperCase()] || "");
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
  React.useEffect(() => {
    const handleFullscreenChange = () => {
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
  }, []); 

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 p-4 w-full">
      {/* Main Container */}
      <div className="max-w-7xl w-full mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Run Your Code</h1>

        {/* Top Navigation Bar */}
        <div className="bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-t-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">main.{selectedLanguage}</h2>
            {/* Language Selector */}
            <select
              className="select select-sm select-bordered select-primary rounded-lg"
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {Object.keys(languageDisplayNames).map((langKey) => (
                <option
                  key={langKey.toLowerCase()}
                  value={langKey.toLowerCase()}
                >
                  {languageDisplayNames[langKey]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            {/* Fullscreen Toggle Button */}
            <button
              className="btn btn-sm btn-ghost btn-circle tooltip tooltip-top"
              data-tip={
                isEditorFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"
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
              )}
            </button>
            {/* Share Button (Placeholder) */}
            <button
              className="btn btn-sm btn-ghost btn-circle tooltip tooltip-top"
              data-tip="Share Code"
              aria-label="Share this code"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 13.582 9.13 13.78 9.4 13.933L12 15.333c2.692 1.568 6.01 1.568 8.702 0L21 13.933c1.354-.76 2.708-1.518 4.062-2.276a1.5 1.5 0 001.068-1.408V8.684c0-.354-.106-.68-.308-.966A1.5 1.5 0 0023.38 6.068L21 4.568c-2.692-1.568-6.01-1.568-8.702 0L9.4 6.068a1.5 1.5 0 00-1.068 1.408v1.568c0 .354.106.68.308.966a1.5 1.5 0 001.068 1.408z"
                />
              </svg>
            </button>
            {/* Run Button */}
            <button
              className={`btn btn-sm btn-primary gap-2 ${
                isLoading || isExecutionLoading ? "loading" : ""
              }`}
              onClick={handleRunCode}
              disabled={isLoading || isExecutionLoading}
            >
              <Play className="w-4 h-4" />
              {isLoading || isExecutionLoading ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column: Code Editor */}
          <div
            ref={editorCardRef}
            className={`card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-b-2xl overflow-hidden ${
              isEditorFullscreen ? "fixed inset-0 z-50" : ""
            }`}
          >
            <div className="card-body p-0 flex-1 flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Code2 className="w-5 h-5" /> Code Editor
                </h3>
              </div>
              <div className="flex-1 p-2">
                {" "}
                {/* Added padding around editor */}
                <Editor
                  height="40vh" // Set a fixed height or use flex-grow if inside a flex container
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
                <div className="flex justify-between items-center gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor="customInput"
                      className="block text-sm font-medium mb-1"
                    >
                      Custom Input (stdin)
                    </label>
                    <textarea
                      id="customInput"
                      className="textarea textarea-bordered w-full h-20"
                      placeholder="Enter input for your code here..."
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl overflow-hidden">
            <div className="card-body p-0 flex-1 flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-bold text-lg">Output</h3>
                {/* Clear Button */}
                <button
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setOutput("");
                    setError(null);
                    // Optionally, clear the store's latestSubmission
                    // This would require an action in the store to clear it
                  }}
                >
                  Clear
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {isExecutionLoading ? (
                  <div className="flex justify-center items-center p-8">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <span className="sr-only">Executing code</span>
                  </div>
                ) : error ? (
                  <div className="text-error p-4">
                    <p>Error: {error}</p>
                  </div>
                ) : latestSubmission ? (
                  <SubmissionResults latestSubmission={latestSubmission} />
                ) : (
                  <div className="text-center p-8 text-gray-500">
                    <p>Run your code to see the output here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunCodePage;
