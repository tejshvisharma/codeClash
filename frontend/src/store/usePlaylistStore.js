// frontend/src/store/usePlaylistStore.js
import { axiosInstance } from "../lib/axios"; // Adjust path if necessary
import { toast } from "react-hot-toast";
import { create } from "zustand";

const usePlaylistStore = create((set, get) => ({
  // State
  allPlaylists: [], // Store user's playlists
  isPlaylistLoading: false, // General loading state for playlist operations
  isCreatingPlaylist: false, // Specific loading state for creation
  isFetchingPlaylists: false, // Specific loading state for fetching
  error: null, // Store error messages

  // Action: Fetch all playlists for the current user
  fetchPlaylists: async () => {
    set({ isFetchingPlaylists: true, error: null });
    try {
      const res = await axiosInstance.get("/playlist");
      if (res.data.success) {
        set({ allPlaylists: res.data.playlists, error: null });
      } else {
        throw new Error(res.data.message || "Failed to fetch playlists");
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while fetching playlists";
      set({ error: errorMessage });
      toast.error(errorMessage);
    } finally {
      set({ isFetchingPlaylists: false });
    }
  },

  // Action: Create a new playlist and optionally add a problem to it
  createPlaylist: async (playlistData, problemIdToAdd = null) => {
    set({ isCreatingPlaylist: true, error: null });
    try {
      // 1. Create the playlist
      const createResponse = await axiosInstance.post("/playlist/create", {
        name: playlistData.name,
        description: playlistData.description,
      });

      if (!createResponse.data.success) {
        throw new Error(createResponse.data.message || "Failed to create playlist");
      }

      const newPlaylist = createResponse.data.playlist;

      // 2. Optionally add a problem to the newly created playlist
      if (problemIdToAdd) {
        const addProblemResponse = await axiosInstance.post(`/playlist/${newPlaylist.id}/add-problem`, {
          problemIds: [problemIdToAdd], // Send as array
        });

        if (!addProblemResponse.data.success) {
          // Log the issue but don't necessarily fail the creation
          console.warn("Problem was added to playlist, but adding problem failed:", addProblemResponse.data.message);
          // Optionally, show a warning toast instead of an error
          // toast.warn(addProblemResponse.data.message || "Problem might not have been added to the new playlist.");
        } else {
          // If adding the problem was successful, we might want to update the local playlist state
          // to reflect the new problem. This is optional depending on how you manage the list.
          // For now, we'll just refetch the playlists to ensure consistency.
        }
      }

      // 3. Refetch the full list to ensure state is up-to-date
      // This handles adding the new playlist and potentially the problem in one go.
      await get().fetchPlaylists(); // Use 'get()' to call other actions within the store

      toast.success("Playlist created successfully!");
      return newPlaylist; // Return the new playlist object for potential further use by the caller

    } catch (error) {
      console.error("Error creating playlist:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while creating the playlist";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error; // Re-throw to allow the calling component to handle it if needed
    } finally {
      set({ isCreatingPlaylist: false });
    }
  },

  // Action: Add a problem to an existing playlist
  addProblemToPlaylist: async (playlistId, problemId) => {
    set({ isPlaylistLoading: true, error: null });
    try {
      const res = await axiosInstance.post(`/playlist/${playlistId}/add-problem`, {
        problemIds: [problemId], // Send as array
      });

      if (res.data.success) {
        // Refetch playlists to update the local state
        await get().fetchPlaylists();
        toast.success("Problem added to playlist successfully!");
      } else {
        throw new Error(res.data.message || "Failed to add problem to playlist");
      }
    } catch (error) {
      console.error("Error adding problem to playlist:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while adding the problem to the playlist";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error; // Re-throw to allow the calling component to handle it if needed
    } finally {
      set({ isPlaylistLoading: false });
    }
  },

 // Action: Remove a problem from a playlist
  removeProblemFromPlaylist: async (playlistId, problemId) => {
    set({ isPlaylistLoading: true, error: null });
    try {
      // CORRECT: Send problemIds in the request body using the 'data' property within the config object
      const res = await axiosInstance.delete(`/playlist/${playlistId}/remove-problem`, {
        data : { 
          problemIds: [problemId]
        }
      });

      if (res.data.success) {
        // Refetch playlists to update the local state
        await get().fetchPlaylists();
        toast.success("Problem removed from playlist successfully!");
      } else {
        throw new Error(res.data.message || "Failed to remove problem from playlist");
      }
    } catch (error) {
      console.error("Error removing problem from playlist:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while removing the problem from the playlist";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error; // Re-throw to allow the calling component to handle it if needed
    } finally {
      set({ isPlaylistLoading: false });
    }
  },

  // Action: Delete an entire playlist
  deletePlaylist: async (playlistId) => {
    set({ isPlaylistLoading: true, error: null });
    try {
      const res = await axiosInstance.delete(`/playlist/delete/${playlistId}`);

      if (res.data.success) {
        // Update the local state by filtering out the deleted playlist
        set((state) => ({
          allPlaylists: state.allPlaylists.filter(playlist => playlist.id !== playlistId)
        }));
        toast.success("Playlist deleted successfully!");
      } else {
        throw new Error(res.data.message || "Failed to delete playlist");
      }
    } catch (error) {
      console.error("Error deleting playlist:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while deleting the playlist";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error; // Re-throw to allow the calling component to handle it if needed
    } finally {
      set({ isPlaylistLoading: false });
    }
  },

  // Action: Update an existing playlist's name or description
  updatePlaylist: async (playlistId, updateData) => {
    set({ isPlaylistLoading: true, error: null });
    try {
      const res = await axiosInstance.put(`/playlist/update/${playlistId}`, updateData);

      if (res.data.success) {
        // Refetch playlists to update the local state with the modified playlist
        await get().fetchPlaylists();
        toast.success("Playlist updated successfully!");
      } else {
        throw new Error(res.data.message || "Failed to update playlist");
      }
    } catch (error) {
      console.error("Error updating playlist:", error);
      const errorMessage = error.response?.data?.message || error.message || "An error occurred while updating the playlist";
      set({ error: errorMessage });
      toast.error(errorMessage);
      throw error; // Re-throw to allow the calling component to handle it if needed
    } finally {
      set({ isPlaylistLoading: false });
    }
  },

  // Action: Get a specific playlist by ID (optional, might be handled by component fetching)
  // getPlaylistById: async (playlistId) => {
  //   // This might be less common if the full list is usually fetched.
  //   // Components might filter the 'allPlaylists' state instead.
  //   // Or, if needed, implement a specific fetch for a single playlist.
  //   try {
  //     const res = await axiosInstance.get(`/playlists/get/${playlistId}`);
  //     if (res.data.success) {
  //       return res.data.playlist;
  //     } else {
  //       throw new Error(res.data.message || "Failed to fetch playlist");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching specific playlist:", error);
  //     toast.error(error.message);
  //     throw error;
  //   }
  // },

  // Utility: Clear error state
  clearError: () => set({ error: null }),
}));

export default usePlaylistStore;