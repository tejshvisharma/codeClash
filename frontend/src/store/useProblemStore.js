import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

const useProblemStore = create((set) => ({
  // ===== STATE =====
  problems: [],
  problem: null,
  solvedProblems: [],
  userProblems: [],
  isProblemsLoading: false,
  isProblemLoading: false,
  isSolvedProblemsLoading: false,
  isUserProblemsLoading: false,

  // ===== ACTIONS =====

  // GET /problems/get-all-problems
  getAllProblems: async () => {
    set({ isProblemsLoading: true });
    try {
      const res = await axiosInstance.get("/problems/get-all-problems");
      if (res.data.success) {
        set({ problems: res.data.Problems }); // Note: controller sends "Problems" (capital P)
      } else {
        toast.error(res.data.error || "Failed to fetch problems");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
      console.error("getAllProblems error:", error);
    } finally {
      set({ isProblemsLoading: false });
    }
  },

  // GET /problems/get-problem/:id
  getProblemById: async (id) => {
    set({ isProblemLoading: true, problem: null });
    try {
      const res = await axiosInstance.get(`/problems/get-problem/${id}`);
      if (res.data.success) {
        set({ problem: res.data.problem });
      } else {
        toast.error(res.data.error || "Problem not found");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to load problem");
      console.error("getProblemById error:", error);
    } finally {
      set({ isProblemLoading: false });
    }
  },

  // GET /problems/get-solved-problems
  getProblemsSolvedByUser: async () => {
    set({ isSolvedProblemsLoading: true });
    try {
      const res = await axiosInstance.get("/problems/get-solved-problems");
      if (res.data.success) {
        set({ solvedProblems: res.data.problems });
      } else {
        toast.error(res.data.error || "Failed to fetch solved problems");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
      console.error("getProblemsSolvedByUser error:", error);
    } finally {
      set({ isSolvedProblemsLoading: false });
    }
  },

  // GET /problems/get-problems-by-user/:id
  getProblemsByUserId: async (userId) => {
    set({ isUserProblemsLoading: true });
    try {
      const res = await axiosInstance.get(
        `/problems/get-problems-by-user/${userId}`
      );
      if (res.data.success) {
        set({ userProblems: res.data.problems });
      } else {
        toast.error(res.data.error || "Failed to fetch user problems");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
      console.error("getProblemsByUserId error:", error);
    } finally {
      set({ isUserProblemsLoading: false });
    }
  },

  // POST /problems/create-problem
  createProblem: async (problemData) => {
    try {
      const res = await axiosInstance.post(
        "/problems/create-problem",
        problemData
      );
      if (res.data.success) {
        toast.success(res.data.message || "Problem created successfully!");
        return res.data.problem;
      } else {
        toast.error(res.data.error || "Failed to create problem");
        throw new Error(res.data.error);
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || "Creation failed";
      toast.error(errMsg);
      console.error("createProblem error:", error);
      throw error; // Re-throw for form validation
    }
  },

  // PATCH /problems/update-problem/:id
  updateProblem: async (id, problemData) => {
    try {
      const res = await axiosInstance.patch(
        `/problems/update-problem/${id}`,
        problemData
      );
      if (res.data.success) {
        toast.success(res.data.message || "Problem updated!");
        // Optimistically update local state
        set((state) => ({
          problem: res.data.problem,
          problems: state.problems.map((p) =>
            p.id === id ? res.data.problem : p
          ),
        }));
        return res.data.problem;
      } else {
        toast.error(res.data.error || "Failed to update problem");
        throw new Error(res.data.error);
      }
    } catch (error) {
      const errMsg = error.response?.data?.error || "Update failed";
      toast.error(errMsg);
      console.error("updateProblem error:", error);
      throw error;
    }
  },

  // DELETE /problems/delete-problem/:id
  deleteProblem: async (id) => {
    try {
      const res = await axiosInstance.delete(`/problems/delete-problem/${id}`);
      if (res.data.success) {
        toast.success(res.data.message || "Problem deleted!");
        // Update local state
        set((state) => ({
          problems: state.problems.filter((p) => p.id !== id),
          problem: state.problem?.id === id ? null : state.problem,
          userProblems: state.userProblems.filter((p) => p.id !== id),
        }));
      } else {
        toast.error(res.data.error || "Failed to delete problem");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Deletion failed");
      console.error("deleteProblem error:", error);
    }
  },

  getSubmissionsForProblem: async (problemId) => {
    set({ isSubmissionsLoading: true });
    try {
      const res = await axiosInstance.get(`/submissions/problem/${problemId}`);
      if (res.data.success) {
        set({ submissionsForProblem: res.data.submissions });
      } else {
        toast.error(res.data.error || "Failed to fetch submissions");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Something went wrong");
      console.error("getSubmissionsForProblem error:", error);
    } finally {
      set({ isSubmissionsLoading: false });
    }
  },

  // Reset single problem state
  resetProblem: () => set({ problem: null }),
}));

export default useProblemStore;
