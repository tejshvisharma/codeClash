import { create } from 'zustand'
import { axiosInstance } from '../lib/axios.js'
import toast from 'react-hot-toast'
export const useAuthStore = create((set) => ({
  authUser: null,
  problemsSolved: [],
  problemsSolvedCount: 0,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,
  error: null,

  checkAuth: async function () {
    set({ isCheckingAuth: true });
    try {
      const res = await axiosInstance.get("/auth/me");
      console.log("checkAuth Response", res.data);
      set({ authUser: res.data.user });
    } catch (err) {
      console.log("Error checkingAuth: ", err.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", data);
      set({ authUser: res.data.user });
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Error signing up", error);
      let errorMessage = "Failed to create account";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      if (res.data.success) {
        set({ authUser: res.data.user });
        toast.success("Login successful!");
      } else {
        // Fallback if success: false but no error in response
        toast.error(res.data.message || "Login failed");
      }
    } catch (error) {
      console.log("Error logging in", error);

      // ✅ Extract meaningful error message
      let errorMessage = "Invalid email or password";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });

      toast.success("Logout successfully");
    } catch (error) {
      console.log("Error logging out", error);
      toast.error("Error logging out");
    }
  },
  fetchProblemSolvedCount: async () => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosInstance.get("/problems/get-solved-count");

      set({
        problemsSolvedCount: res.data.solvedProblemsCount || 0,
        isLoading: false,
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch solved problem count";

      console.error("Error fetching problem solved count:", errorMessage);

      set({ error: errorMessage, isLoading: false });

    }
  },
}));