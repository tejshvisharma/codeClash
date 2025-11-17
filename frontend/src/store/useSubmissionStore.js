
import { create } from "zustand";
import { axiosInstance } from "../lib/axios"; 
import { toast } from "react-hot-toast";

const useSubmissionStore = create((set, get) => ({
  // State
  submissions: [], // Array to hold submissions for a specific problem
  submissionCount: 0, // Total count of submissions for a specific problem
  isLoading: false, // Flag for loading states
  error: null, // Flag for error states

  // Action 
  getSubmissionCountForProblem: async (problemId) => {
    if (!problemId) {
      console.error("getSubmissionCountForProblem: problemId is required");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get(
        `/submissions/get-submissions-count/${problemId}`
      ); // Use your actual route

      if (response.data.success) {
        set({ submissionCount: response.data.count, isLoading: false });
      } else {
        const errorMessage =
          response.data.error || "Failed to fetch submission count.";
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage); // Optional: Show error toast
      }
    } catch (error) {
      console.error("getSubmissionCountForProblem error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "error occurred fetching submission count.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  // Action to get submissions for a specific problem
  getSubmissionsForProblem: async (problemId) => {
    if (!problemId) {
      console.error("getSubmissionsForProblem: problemId is required");
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await axiosInstance.get(
        `/submissions/problem/${problemId}`
      ); // Use your actual route

      if (response.data.success) {
        set({ submissions: response.data.submissions, isLoading: false });
      } else {
        const errorMessage =
          response.data.error || "Failed to fetch submissions.";
        set({ error: errorMessage, isLoading: false });
        toast.error(errorMessage); // Optional: Show error toast
      }
    } catch (error) {
      console.error("getSubmissionsForProblem error:", error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "An unexpected error occurred while fetching submissions.";
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  // Optional: Action to reset submission list (e.g., when navigating away)
  resetSubmissions: () =>
    set({ submissions: [], isLoading: false, error: null }),
  // Optional: Action to reset submission count (e.g., when navigating away)
  resetSubmissionCount: () =>
    set({ submissionCount: 0, isLoading: false, error: null }),
  // Optional: Action to clear any error
  clearError: () => set({ error: null }),
}));

export default useSubmissionStore;
