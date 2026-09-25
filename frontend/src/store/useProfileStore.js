import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useProfileStore = create((set) => ({
  profile: null,
  activityCalendar: [],
  languageStats: [],
  recentActivity: [],
  submissionTrends: [],
  problemStats: [],
  isLoading: false,
  error: null,

  // Fetch complete user profile
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/profile");
      if (res.data.success) {
        set({ profile: res.data.profile, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      set({
        error: error.response?.data?.error || "Failed to fetch profile",
        isLoading: false,
      });
      toast.error("Failed to load profile data");
    }
  },

  // Fetch activity calendar
  fetchActivityCalendar: async () => {
    try {
      const res = await axiosInstance.get("/profile/activity");
      if (res.data.success) {
        set({ activityCalendar: res.data.activity });
      }
    } catch (error) {
      console.error("Error fetching activity calendar:", error);
    }
  },

  // Fetch language statistics
  fetchLanguageStats: async () => {
    try {
      const res = await axiosInstance.get("/profile/languages");
      if (res.data.success) {
        set({ languageStats: res.data.languages });
      }
    } catch (error) {
      console.error("Error fetching language stats:", error);
    }
  },

  // Fetch recent activity
  fetchRecentActivity: async (limit = 10) => {
    try {
      const res = await axiosInstance.get(`/profile/recent?limit=${limit}`);
      if (res.data.success) {
        set({ recentActivity: res.data.recentActivity });
      }
    } catch (error) {
      console.error("Error fetching recent activity:", error);
    }
  },

  // Fetch submission trends
  fetchSubmissionTrends: async (days = 30) => {
    try {
      const res = await axiosInstance.get(`/profile/trends?days=${days}`);
      if (res.data.success) {
        set({ submissionTrends: res.data.trends });
      }
    } catch (error) {
      console.error("Error fetching submission trends:", error);
    }
  },

  // Fetch problem statistics
  fetchProblemStats: async () => {
    try {
      const res = await axiosInstance.get("/profile/problem-stats");
      if (res.data.success) {
        set({ problemStats: res.data.stats });
      }
    } catch (error) {
      console.error("Error fetching problem stats:", error);
    }
  },

  // Fetch all profile data
  fetchAllProfileData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        useProfileStore.getState().fetchProfile(),
        useProfileStore.getState().fetchActivityCalendar(),
        useProfileStore.getState().fetchLanguageStats(),
        useProfileStore.getState().fetchRecentActivity(),
        useProfileStore.getState().fetchSubmissionTrends(),
        useProfileStore.getState().fetchProblemStats(),
      ]);
      set({ isLoading: false });
    } catch (error) {
      console.error("Error fetching all profile data:", error);
      set({ error: "Failed to fetch profile data", isLoading: false });
    }
  },
}));


export default useProfileStore;
