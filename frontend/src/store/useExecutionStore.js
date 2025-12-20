
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"; 
import { toast } from "react-hot-toast";

const useExecutionStore = create((set) => ({
  submission: null, // Holds the result of the last execution (submissionWithTestCases object)
  isLoading: false, // Flag to indicate if execution is in progress
  error: null, // Holds any error message from the execution attempt

  // Action to execute code
  executeCode: async (
    source_code,
    language_id,
    stdin,
    expected_outputs,
    problemId
  ) => {
    // Optimistically set loading state
    set({ isLoading: true, error: null });

    try {
      if (
        !source_code ||
        !language_id ||
        !Array.isArray(stdin) ||
        !Array.isArray(expected_outputs) ||
        !problemId
      ) {
        throw new Error("Missing required parameters for execution.");
      }

      if (stdin.length !== expected_outputs.length) {
        throw new Error(
          "Number of inputs must match number of expected outputs."
        );
      }

      // Make the API call
      const response = await axiosInstance.post("/execute-code", {
        source_code,
        language_id,
        stdin,
        expected_outputs,
        problemId,
      });
      console.log("ExecutionResult : ",response.data.executionResult);
      if (response.data.success) {
        set({
          submission: response.data.submissionWithTestCases,
          isLoading: false,
          error: null,
        });
        // Optional: Show a success toast based on status
        if (response.data.submissionWithTestCases.status === "ACCEPTED") {
          toast.success("Code executed successfully and accepted!");
        } else {
          toast.success("Code executed, but did not pass all test cases.");
        }
      } else {
        // Backend indicated failure with a message
        const errorMessage =
          response.data.error || "Execution failed on the server.";
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage);
      }
    } catch (error) {
      // Handle network errors, 400/500 responses, etc.
      console.error("Execution error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred during execution.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  changeSubmission : (latestSubmission)=>{
    set({ submission: latestSubmission, isLoading: false, error:null });
  },
  resetSubmission: () => set({ submission: null, error: null }),

  clearError: () => set({ error: null }),
}));

export default useExecutionStore;
