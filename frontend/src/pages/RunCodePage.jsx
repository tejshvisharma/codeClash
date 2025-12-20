import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  RotateCcw,
  Code2,
  Maximize,
  Minimize,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Trash2,
  FileCode,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { getJudge0LanguageId, languageDisplayNames } from "../lib/languages";
import { useRuncodeStore } from "../store/useRuncodeStore";
import { getSamplesForLanguage } from "../lib/sampleInputs";
import { validateInput } from "../utils/inputValidator";
import InputFormatHelp from "../components/InputFormatHelp";
import { toast } from "react-hot-toast";

const RunCodePage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isEditorFullscreen, setIsEditorFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState("output"); // output, errors, details
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const editorCardRef = React.useRef(null);

  const {
    runCode,
    executionResult,
    isLoading,
    getCode,
    setCode,
    loadStarterCode,
    customInput,
    setCustomInput,
    clearResult,
  } = useRuncodeStore();

  // Local code state synced with store
  const [code, setLocalCode] = useState("");

  // Load code for selected language on mount and language change
  useEffect(() => {
    const savedCode = getCode(selectedLanguage);
    setLocalCode(savedCode);
  }, [selectedLanguage, getCode]);

  const handleRunCode = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please write some code first!");
      return;
    }

    // Validate input before running
    const warnings = validateInput(selectedLanguage, code, customInput);
    if (warnings.length > 0) {
      warnings.forEach((warning) => {
        if (warning.severity === "warning") {
          toast(warning.message, {
            icon: "⚠️",
            duration: 6000,
            style: {
              background: "#FEF3C7",
              color: "#92400E",
            },
          });
        } else if (warning.severity === "info") {
          toast(warning.message, {
            icon: "💡",
            duration: 4000,
            style: {
              background: "#DBEAFE",
              color: "#1E40AF",
            },
          });
        }
      });
    }

    try {
      const language_id = getJudge0LanguageId(selectedLanguage);
      if (!language_id) {
        toast.error(`Unsupported language: ${selectedLanguage}`);
        return;
      }

      // Save current code before running
      setCode(selectedLanguage, code);

      // Execute code with custom input
      await runCode(code, language_id, customInput);
    } catch (err) {
      console.error("Error executing custom code", err);
    }
  };

  const handleLanguageChange = (lang) => {
    // Save current code before switching
    setCode(selectedLanguage, code);
    setSelectedLanguage(lang);
  };

  const handleCodeChange = (value) => {
    const newCode = value || "";
    setLocalCode(newCode);
    // Auto-save to store on change
    setCode(selectedLanguage, newCode);
  };

  const handleLoadStarterCode = () => {
    const starter = loadStarterCode(selectedLanguage);
    setLocalCode(starter);
    toast.success("Starter code loaded!");
  };

  const loadSampleInput = (sampleKey, sample) => {
    setCustomInput(sample.input);
    setLocalCode(sample.code);
    setCode(selectedLanguage, sample.code);
    setShowSampleDropdown(false);
    toast.success(`Loaded: ${sample.name}`);
  };

  const handleClearInput = () => {
    setCustomInput("");
  };

  const handleClearOutput = () => {
    clearResult();
  };

  const toggleEditorFullscreen = () => {
    if (!editorCardRef.current) return;

    if (!isEditorFullscreen) {
      if (editorCardRef.current.requestFullscreen) {
        editorCardRef.current.requestFullscreen();
      } else if (editorCardRef.current.mozRequestFullScreen) {
        editorCardRef.current.mozRequestFullScreen();
      } else if (editorCardRef.current.webkitRequestFullscreen) {
        editorCardRef.current.webkitRequestFullscreen();
      } else if (editorCardRef.current.msRequestFullscreen) {
        editorCardRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsEditorFullscreen(
        !!document.fullscreenElement &&
          document.fullscreenElement === editorCardRef.current
      );
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

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

  // Helper to determine status color
  const getStatusColor = (status) => {
    if (!status) return "text-gray-400";
    const lowerStatus = status.toLowerCase();

    if (lowerStatus.includes("accepted")) {
      return "text-green-400";
    }
    if (
      lowerStatus.includes("compilation error") ||
      lowerStatus.includes("compile")
    ) {
      return "text-red-400";
    }
    if (
      lowerStatus.includes("runtime error") ||
      lowerStatus.includes("sigsegv") ||
      lowerStatus.includes("sigfpe") ||
      lowerStatus.includes("sigabrt") ||
      lowerStatus.includes("nzec")
    ) {
      return "text-orange-400";
    }
    if (lowerStatus.includes("time limit")) {
      return "text-yellow-400";
    }
    if (lowerStatus.includes("error") || lowerStatus.includes("failed")) {
      return "text-red-400";
    }

    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-200 p-4 w-full">
      {/* Main Container */}
      <div className="w-full mx-auto">
        {/* Top Navigation Bar */}
        <div className="bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-t-2xl p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">script.{selectedLanguage}</h2>
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
            {/* Run Button */}
            <button
              className={`btn btn-sm btn-primary gap-2 ${
                isLoading ? "loading" : ""
              }`}
              onClick={handleRunCode}
              disabled={isLoading || !code.trim()}
            >
              <Play className="w-4 h-4" />
              {isLoading ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Left Column: Code Editor & Custom Input */}
          <div className="flex flex-col gap-2">
            {/* Code Editor */}
            <div
              ref={editorCardRef}
              className={`card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 overflow-hidden ${
                isEditorFullscreen ? "fixed inset-0 z-50" : ""
              }`}
            >
              <div className="card-body p-0 flex-1 flex flex-col">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Code2 className="w-5 h-5" /> Code Editor
                  </h3>
                  {/* Load Starter Code Button */}
                  <button
                    className="btn btn-sm btn-ghost gap-2 tooltip tooltip-bottom"
                    data-tip="Load starter code"
                    onClick={handleLoadStarterCode}
                  >
                    <FileCode className="w-4 h-4" />
                    Starter
                  </button>
                  <button
                    className="btn btn-sm btn-ghost btn-circle tooltip tooltip-left"
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
                    )}
                  </button>
                </div>
                <div className="flex-1 p-2 mt-2">
                  <Editor
                    height={isEditorFullscreen ? "100vh" : "50vh"}
                    language={selectedLanguage}
                    theme="vs-dark"
                    value={code}
                    onChange={handleCodeChange}
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
              </div>
            </div>

            {/* Custom Input Section */}
            <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl overflow-hidden">
              <div className="card-body p-0">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-base-300/50">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <Terminal className="w-5 h-5" />
                      Custom Input (stdin)
                    </h3>
                    <button
                      onClick={() => setShowHelp(true)}
                      className="btn btn-xs btn-ghost btn-circle tooltip tooltip-right"
                      data-tip="How to provide input?"
                    >
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Sample Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowSampleDropdown(!showSampleDropdown)
                        }
                        className="btn btn-xs btn-ghost gap-1"
                      >
                        📚 Samples
                      </button>

                      {showSampleDropdown && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setShowSampleDropdown(false)}
                          />
                          <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 max-h-80 overflow-y-auto">
                            {Object.entries(
                              getSamplesForLanguage(selectedLanguage)
                            ).length > 0 ? (
                              Object.entries(
                                getSamplesForLanguage(selectedLanguage)
                              ).map(([key, sample]) => (
                                <button
                                  key={key}
                                  onClick={() => loadSampleInput(key, sample)}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
                                >
                                  <div className="font-medium text-sm">
                                    {sample.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {sample.description}
                                  </div>
                                </button>
                              ))
                            ) : (
                              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                No samples available for{" "}
                                {
                                  languageDisplayNames[
                                    selectedLanguage.toUpperCase()
                                  ]
                                }
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    <button
                      className="btn btn-xs btn-ghost gap-1 tooltip tooltip-left"
                      data-tip="Clear input"
                      onClick={handleClearInput}
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  </div>
                </div>

                {/* Input Format Guide */}
                <div className="mx-4 mt-3 mb-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1 flex items-center gap-1">
                    💡 Input Format Tip
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    Provide all inputs at once (line by line or
                    space-separated). Remove prompts like "Enter value:" from
                    your code.
                  </p>
                  <div className="mt-2 text-xs font-mono bg-white dark:bg-gray-900 p-2 rounded border border-blue-200 dark:border-blue-700">
                    <div className="text-green-600 dark:text-green-400">
                      Example:
                    </div>
                    <div className="text-gray-700 dark:text-gray-300">5</div>
                    <div className="text-gray-700 dark:text-gray-300">
                      10 20 30 40 50
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-2">
                  <textarea
                    className="textarea textarea-bordered w-full font-mono text-sm bg-[#1e1e1e] text-gray-200 min-h-[120px]"
                    placeholder="Enter input here (e.g., 5\n10 20 30 40 50)..."
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Output */}
          <div className="card bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl overflow-hidden flex flex-col">
            <div className="card-body p-0 flex-1 flex flex-col">
              <div className="p-4 border-b border-white/10 flex justify-between items-center bg-base-300/50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Terminal className="w-5 h-5" />
                  Execution Results
                </h3>
                <button
                  className="btn btn-xs btn-ghost gap-1 tooltip tooltip-left"
                  data-tip="Clear output"
                  onClick={handleClearOutput}
                  disabled={!executionResult}
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>

              {/* Tabs */}
              {executionResult && (
                <div className="tabs tabs-boxed bg-base-300/30 p-2 border-b border-white/10">
                  <button
                    className={`tab ${
                      activeTab === "output" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("output")}
                  >
                    Output
                  </button>
                  <button
                    className={`tab ${
                      activeTab === "errors" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("errors")}
                  >
                    Errors
                  </button>
                  <button
                    className={`tab ${
                      activeTab === "details" ? "tab-active" : ""
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Details
                  </button>
                </div>
              )}

              <div className="flex-1 p-4 overflow-y-auto font-mono text-sm bg-[#1e1e1e]">
                {isLoading ? (
                  <div className="flex flex-col justify-center items-center h-full gap-4 text-gray-400">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p>Executing your code...</p>
                  </div>
                ) : executionResult ? (
                  <div className="space-y-4">
                    {activeTab === "output" && (
                      <>
                        {/* Error Banner if compilation/runtime error */}
                        {executionResult.errorType && (
                          <div
                            className={`p-4 rounded-lg border-l-4 ${
                              executionResult.errorType === "compilation"
                                ? "bg-red-50 dark:bg-red-900/20 border-red-500"
                                : executionResult.errorType === "runtime"
                                ? "bg-orange-50 dark:bg-orange-900/20 border-orange-500"
                                : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">
                                {executionResult.errorType === "compilation"
                                  ? "🔴"
                                  : executionResult.errorType === "runtime"
                                  ? "⚠️"
                                  : "⏱️"}
                              </span>
                              <div className="flex-1">
                                <span
                                  className={`font-semibold ${
                                    executionResult.errorType === "compilation"
                                      ? "text-red-700 dark:text-red-300"
                                      : executionResult.errorType === "runtime"
                                      ? "text-orange-700 dark:text-orange-300"
                                      : "text-yellow-700 dark:text-yellow-300"
                                  }`}
                                >
                                  {executionResult.errorType === "compilation"
                                    ? "Compilation Error"
                                    : executionResult.errorType === "runtime"
                                    ? "Runtime Error"
                                    : "Time Limit Exceeded"}
                                </span>
                                <p className="text-xs mt-1 opacity-80">
                                  Check the <strong>Errors</strong> tab for
                                  detailed information
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Status Header */}
                        <div className="flex flex-wrap items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/10">
                          <div
                            className={`flex items-center gap-2 font-bold ${getStatusColor(
                              executionResult.status
                            )}`}
                          >
                            {executionResult.status &&
                            executionResult.status
                              .toLowerCase()
                              .includes("accepted") ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5" />
                            )}
                            {executionResult.status}
                          </div>

                          {executionResult.time && (
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                              <Clock className="w-3.5 h-3.5" />
                              {executionResult.time}
                            </div>
                          )}

                          {executionResult.memory && (
                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                              <Zap className="w-3.5 h-3.5" />
                              {executionResult.memory}
                            </div>
                          )}
                        </div>

                        {/* Standard Output */}
                        {executionResult.stdout ? (
                          <div>
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">
                              Standard Output
                            </div>
                            <pre className="p-3 bg-black/40 rounded-lg border border-white/5 whitespace-pre-wrap text-gray-200">
                              {executionResult.stdout}
                            </pre>
                          </div>
                        ) : (
                          !executionResult.errorType && (
                            <div className="text-gray-500 italic p-2">
                              No output generated.
                            </div>
                          )
                        )}
                      </>
                    )}

                    {activeTab === "errors" && (
                      <>
                        {/* Compilation Error - Show First and Prominently */}
                        {executionResult.compileOutput && (
                          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-lg">
                            <div className="flex items-start gap-3 mb-3">
                              <span className="text-3xl">🔴</span>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg text-red-800 dark:text-red-200 mb-1">
                                  Compilation Error
                                </h4>
                                <p className="text-sm text-red-600 dark:text-red-400">
                                  Your code has syntax errors that prevent it
                                  from compiling. Fix these errors and try
                                  again.
                                </p>
                              </div>
                            </div>
                            <pre className="text-sm bg-white dark:bg-gray-900 p-3 rounded overflow-x-auto border border-red-200 dark:border-red-800 whitespace-pre-wrap break-words font-mono">
                              {executionResult.compileOutput}
                            </pre>
                          </div>
                        )}

                        {/* Runtime Errors (stderr) */}
                        {executionResult.stderr &&
                          !executionResult.compileOutput && (
                            <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-4 rounded-lg">
                              <div className="flex items-start gap-3 mb-3">
                                <span className="text-3xl">⚠️</span>
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg text-orange-800 dark:text-orange-200 mb-1">
                                    Runtime Error
                                  </h4>
                                  <p className="text-sm text-orange-600 dark:text-orange-400">
                                    Your code compiled successfully but
                                    encountered an error during execution.
                                  </p>
                                </div>
                              </div>
                              <pre className="text-sm bg-white dark:bg-gray-900 p-3 rounded overflow-x-auto border border-orange-200 dark:border-orange-800 whitespace-pre-wrap break-words font-mono">
                                {executionResult.stderr}
                              </pre>
                            </div>
                          )}

                        {/* No Errors */}
                        {!executionResult.stderr &&
                          !executionResult.compileOutput && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                              <span className="text-5xl mb-3 block">✅</span>
                              <p className="text-lg font-medium">
                                No errors detected
                              </p>
                              <p className="text-sm mt-1">
                                Your code compiled and ran successfully
                              </p>
                            </div>
                          )}
                      </>
                    )}

                    {activeTab === "details" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Status
                          </div>
                          <div
                            className={`font-semibold ${getStatusColor(
                              executionResult.status
                            )}`}
                          >
                            {executionResult.status}
                          </div>
                        </div>

                        {executionResult.time && (
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                              Execution Time
                            </div>
                            <div className="font-semibold text-gray-200">
                              {executionResult.time}
                            </div>
                          </div>
                        )}

                        {executionResult.memory && (
                          <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                              Memory Used
                            </div>
                            <div className="font-semibold text-gray-200">
                              {executionResult.memory}
                            </div>
                          </div>
                        )}

                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                            Language
                          </div>
                          <div className="font-semibold text-gray-200">
                            {
                              languageDisplayNames[
                                selectedLanguage.toUpperCase()
                              ]
                            }
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col justify-center items-center h-full text-gray-500 gap-2">
                    <Code2 className="w-12 h-12 opacity-20" />
                    <p>Run your code to see results here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <InputFormatHelp isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default RunCodePage;
