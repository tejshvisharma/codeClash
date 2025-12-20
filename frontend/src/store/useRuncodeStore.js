import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import { toast } from "react-hot-toast";
import { getStarterCode } from "../lib/starterCodeTemplates.js";

const STORAGE_KEY = "codeclash_runcode";

// Load saved code from localStorage
const loadSavedCode = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Failed to load saved code:", error);
    return {};
  }
};

// Save code to localStorage
const saveCodeToStorage = (codeByLanguage) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codeByLanguage));
  } catch (error) {
    console.error("Failed to save code:", error);
  }
};

export const useRuncodeStore = create((set, get) => ({
  executionResult: null,
  isLoading: false,
  error: null,
  codeByLanguage: loadSavedCode(), // Store code separately per language
  customInput: "", // Store custom stdin input

  // Update code for a specific language
  setCode: (language, code) => {
    const updated = { ...get().codeByLanguage, [language]: code };
    set({ codeByLanguage: updated });
    saveCodeToStorage(updated);
  },

  // Get code for a specific language (returns starter code if not set)
  getCode: (language) => {
    const code = get().codeByLanguage[language];
    return code !== undefined ? code : getStarterCode(language);
  },

  // Load starter code for a language
  loadStarterCode: (language) => {
    const starterCode = getStarterCode(language);
    const updated = { ...get().codeByLanguage, [language]: starterCode };
    set({ codeByLanguage: updated });
    saveCodeToStorage(updated);
    return starterCode;
  },

  // Set custom input
  setCustomInput: (input) => {
    set({ customInput: input });
  },

  // Clear execution result
  clearResult: () => {
    set({ executionResult: null, error: null });
  },

  // Run code with custom input support
  runCode: async (code, language_id, stdin) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post("/runcode", {
        source_code: code,
        language_id: language_id,
        stdin: stdin || "",
      });

      console.log("response data : ", response.data);
      const data = response.data;
      const result = data.executionResult;

      // Always set the execution result so user can see the error details
      set({
        executionResult: result,
        isLoading: false,
      });

      // Handle different execution outcomes based on errorType first

      // Check for compilation errors
      if (result?.errorType === "compilation") {
        toast.error("Compilation Error! Check the Errors tab for details.", {
          duration: 5000,
          icon: "🔴",
        });
        return;
      }

      // Check for runtime errors
      if (result?.errorType === "runtime") {
        toast.error(`Runtime Error: ${result.status}`, {
          duration: 5000,
          icon: "⚠️",
        });
        return;
      }

      // Check for timeout
      if (result?.errorType === "timeout") {
        toast.error("Time Limit Exceeded!", {
          duration: 4000,
          icon: "⏱️",
        });
        return;
      }

      // Success case
      if (data.success) {
        toast.success("Code executed successfully!", {
          duration: 3000,
          icon: "✅",
        });
      } else {
        // Other unknown errors (should rarely happen now)
        toast.error(data.message || "Execution failed", {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error running code:", error);
      set({ isLoading: false });

      // Check if it's a network error or server error
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        if (errorData?.executionResult?.errorType) {
          // Still set the result even if axios threw error
          set({ executionResult: errorData.executionResult });

          if (errorData.executionResult.errorType === "compilation") {
            toast.error("Compilation Error! Check the Errors tab.", {
              duration: 5000,
              icon: "🔴",
            });
          } else {
            toast.error(errorData.message || "Execution error", {
              duration: 4000,
            });
          }
        } else {
          toast.error(errorData?.message || "Server error", {
            duration: 4000,
          });
        }
      } else if (error.request) {
        // Request made but no response
        toast.error("No response from server. Check your connection.", {
          duration: 4000,
        });
      } else {
        // Something else went wrong
        toast.error("Failed to execute code", {
          duration: 4000,
        });
      }
    }
  },
}));
