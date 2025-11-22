// frontend/src/components/AddToPlaylistModal.jsx
import React, { useState, useEffect } from "react";
import { X, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form"; // Import react-hook-form
import usePlaylistStore from "../store/usePlaylistStore"; // Import the store
import { toast } from "react-hot-toast"; // Import toast

const AddToPlaylistModal = ({
  isOpen,
  onClose,
  problemIdToAdd,
  problemTitle,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm(); // Use react-hook-form
  const {
    allPlaylists,
    isPlaylistLoading,
    fetchPlaylists,
    createPlaylist,
    addProblemToPlaylist,
  } = usePlaylistStore();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [isCreatingNewPlaylist, setIsCreatingNewPlaylist] = useState(false);
  const [error, setError] = useState(null);

  // Watch the name field for the confirmation step if creating new
  const newPlaylistName = watch("name", "");

  // State for confirmation step when creating new playlist
  const [showCreateConfirmation, setShowCreateConfirmation] = useState(false);

  // Fetch playlists when modal opens
  useEffect(() => {
    if (isOpen) {
      setError(null); // Clear previous errors
      fetchPlaylists().catch((err) => {
        console.error("Failed to fetch playlists:", err);
        setError("Failed to load your playlists.");
      });
      // Reset selections and form
      setSelectedPlaylistId("");
      reset(); // Reset react-hook-form state
      setIsCreatingNewPlaylist(false);
      setShowCreateConfirmation(false);
    }
  }, [isOpen, fetchPlaylists, reset]);

  const handleAddToExistingPlaylist = async () => {
    if (!selectedPlaylistId) {
      toast.error("Please select a playlist.");
      return;
    }

    try {
      await addProblemToPlaylist(selectedPlaylistId, problemIdToAdd);
      toast.success(`Problem added to playlist!`);
      onClose(); // Close the modal after successful addition
    } catch (err) {
      console.error("Error adding problem to playlist:", err);
      // Error is handled by the store's action, but you can show a more specific message here if needed
      // setError(err.message); // Store action already shows toast
    }
  };

  const handleCreateNewPlaylist = () => {
    setIsCreatingNewPlaylist(true);
    setShowCreateConfirmation(false); // Reset confirmation when starting new creation
  };

  const handleFormSubmit = async (data) => {
    if (!isCreatingNewPlaylist) return; // Only handle if we are in the create flow

    setShowCreateConfirmation(true);
  };

  const handleConfirmCreateAndAdd = async (data) => {
    try {
      // Call the store action to create the playlist and add the problem
      const newPlaylist = await createPlaylist(data, problemIdToAdd);

      toast.success("Playlist created and problem added successfully!");
      onClose(); // Close the modal after successful creation and addition
    } catch (err) {
      console.error(
        "Error in AddToPlaylistModal handleConfirmCreateAndAdd:",
        err
      );
      // The store action already shows a toast, but you could show an additional one here if needed
      // setError is less common now as the store handles errors, but kept for potential local UI updates
      // setError(err.message); // Store action already handles toast via the action itself
    } finally {
      // Reset confirmation state
      setShowCreateConfirmation(false);
    }
  };

  const handleBackToForm = () => {
    setShowCreateConfirmation(false);
  };

  const handleBackToMain = () => {
    setIsCreatingNewPlaylist(false);
    setShowCreateConfirmation(false);
    reset(); // Reset form when going back
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
        {/* Main Add to Playlist View */}
        {!isCreatingNewPlaylist && (
          <div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add to Playlist</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error/20 border border-error/30 text-error rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  Add <strong>"{problemTitle}"</strong> to an existing playlist
                  or create a new one.
                </p>

                {/* Loading State */}
                {isPlaylistLoading && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}

                {/* Playlist Selection */}
                {!isPlaylistLoading && (
                  <>
                    <div>
                      <label
                        htmlFor="playlist-select"
                        className="block text-sm font-medium mb-1"
                      >
                        Select Playlist
                      </label>
                      <select
                        id="playlist-select"
                        className="select select-bordered w-full"
                        value={selectedPlaylistId}
                        onChange={(e) => setSelectedPlaylistId(e.target.value)}
                        disabled={isPlaylistLoading}
                      >
                        <option value="">-- Choose a playlist --</option>
                        {allPlaylists.map((playlist) => (
                          <option key={playlist.id} value={playlist.id}>
                            {playlist.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddToExistingPlaylist}
                      className="btn btn-primary w-full"
                      disabled={isPlaylistLoading || !selectedPlaylistId}
                    >
                      {isPlaylistLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Add to Selected Playlist"
                      )}
                    </button>
                  </>
                )}

                <div className="divider text-xs text-gray-500">OR</div>

                <button
                  type="button"
                  onClick={handleCreateNewPlaylist}
                  className="btn btn-ghost w-full flex items-center justify-center gap-2"
                  disabled={isPlaylistLoading}
                >
                  <Plus className="w-4 h-4" />
                  Create New Playlist
                </button>
              </div>
            </div>

            <div className="p-4 bg-black/10 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                disabled={isPlaylistLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Create New Playlist View (Inside the same modal) */}
        {isCreatingNewPlaylist && !showCreateConfirmation && (
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create New Playlist</h3>
                <button
                  type="button"
                  onClick={handleBackToMain} // Go back to main view
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Go back"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-error/20 border border-error/30 text-error rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                  >
                    Name *
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`input input-bordered w-full ${
                      errors.name ? "input-error" : "input-primary"
                    }`}
                    placeholder="Enter playlist name"
                    {...register("name", {
                      required: "Name is required",
                      maxLength: {
                        value: 100,
                        message: "Name cannot exceed 100 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="text-error text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    className={`textarea textarea-bordered w-full ${
                      errors.description ? "textarea-error" : "textarea-primary"
                    }`}
                    placeholder="Enter playlist description (optional)"
                    rows="3"
                    {...register("description", {
                      maxLength: {
                        value: 500,
                        message: "Description cannot exceed 500 characters",
                      },
                    })}
                  ></textarea>
                  {errors.description && (
                    <p className="text-error text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
                  <p className="flex items-start gap-2">
                    <Plus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      The problem "<strong>{problemTitle}</strong>" will be
                      added to this new playlist after creation.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-black/10 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBackToMain}
                className="btn btn-ghost"
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary">
                Next
              </button>
            </div>
          </form>
        )}

        {/* Confirmation View for Creating New Playlist */}
        {isCreatingNewPlaylist && showCreateConfirmation && (
          <div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Confirm Creation</h3>
                <button
                  type="button"
                  onClick={handleBackToForm} // Go back to form
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Go back"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-base-200/30 rounded-xl border border-white/10">
                  <h4 className="font-semibold text-lg mb-1">
                    {newPlaylistName}
                  </h4>
                  {watch("description") && (
                    <p className="text-sm text-gray-400">
                      {watch("description")}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
                  <p className="flex items-start gap-2">
                    <Plus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      The problem "<strong>{problemTitle}</strong>" will be
                      added.
                    </span>
                  </p>
                </div>

                <p className="text-sm text-gray-400">
                  Are you sure you want to create this playlist and add the
                  problem?
                </p>
              </div>
            </div>

            <div className="p-4 bg-black/10 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBackToForm}
                className="btn btn-ghost"
              >
                Back
              </button>
              <button
                type="button" // Use button type to prevent form submission
                onClick={handleSubmit((data) =>
                  handleConfirmCreateAndAdd(data)
                )} // Call the final action
                className="btn btn-primary"
              >
                Confirm & Create
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToPlaylistModal;
