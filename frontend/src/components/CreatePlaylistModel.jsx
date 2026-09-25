// frontend/src/components/CreatePlaylistModel.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { X, Plus, Minus, Loader2 } from "lucide-react";
import usePlaylistStore from "../store/usePlaylistStore";
import { toast } from "react-hot-toast";

const CreatePlaylistModel = ({
  isOpen,
  onClose,
  onSubmit,
  currentProblemId = null,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Local error state for modal UI

  // Access the store action
  const { createPlaylist } = usePlaylistStore();

  // Watch the name field to show it in the confirmation step
  const playlistName = watch("name", "");

  // State for confirmation step
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleFormSubmit = async (data) => {
    // Note: react-hook-form validation should prevent this function from running
    // if required fields like 'name' are empty, based on the rules in register().
    // However, we set loading state here just before the async call.
    setLoading(true);
    setError(null); // Clear any previous local error before attempting submit

    try {
      // Call the store action which handles API, loading state (internally), and error handling internally
      const newPlaylist = await createPlaylist(data, currentProblemId);

      // Optionally call the parent's onSubmit callback (e.g., to close modal, refetch other data if needed)
      // The store will show its own toast via the action
      if (onSubmit) {
        await onSubmit(newPlaylist);
      }

      // Reset form and close modal after successful creation
      reset();
      setShowConfirmation(false);
      onClose(); // Close the modal
    } catch (err) {
      // The store action *should* already show a toast via its internal logic.
      // However, if you want to display the error message *inside* this modal's UI as well,
      // you can capture it here.
      // The error message should ideally come from the backend response via the store action.
      // Let's assume the store action sets its own error state or shows a toast,
      // but we might want a local indicator here too if the store doesn't provide one instantly.
      // For now, rely on the store's toast and potentially its error state if we access it.
      // setError is less common now as the store handles errors, but kept for potential local UI updates
      // const errorMessage = err.response?.data?.message || err.message || "An error occurred.";
      // setError(errorMessage); // The store action handles toast/error reporting
      console.error("Error in CreatePlaylistModel handleSubmit:", err);
      // The store action already shows a toast, so a local setError might be redundant
      // unless you want a different UI feedback here.
      // If the store action fails, setLoading should still be handled by the finally block *within* the store action.
      // However, our local setLoading should also be reset here.
    } finally {
      // Always stop the local loading indicator after the async operation completes (success or failure)
      setLoading(false);
    }
  };

  const handleConfirmAndSubmit = () => {
    // This function is called by the "Create" button in the first view.
    // It should trigger the confirmation view *only if* the form is valid up to this point.
    // react-hook-form's handleSubmit will only call the provided function if validation passes.
    // So, calling handleSubmit(handleFormSubmit) effectively runs validation first.
    // We can use handleSubmit here to ensure validation passes before showing confirmation.
    // However, showing confirmation *before* the async API call means we can't confirm the backend result.
    // The previous implementation showed confirmation, then made the API call on the "Confirm & Create" button.
    // Let's stick to that: Validate on "Next" -> Show Confirmation -> Submit on "Confirm & Create".
    // This requires a slight adjustment: use handleSubmit here to trigger validation,
    // but the actual logic to show confirmation happens inside a function that handleSubmit calls *if* valid.
    // Or, simpler: Just show confirmation here, and let the final submit (handleFormSubmit) do the validation AND API call.
    // The react-hook-form validation happens on the *final* submit (handleFormSubmit).
    // So, clicking "Next" just shows the confirmation screen. Clicking "Confirm & Create" triggers the full flow.
    // This means the "required" validation for 'name' will happen when "Confirm & Create" is clicked.
    // This is perfectly fine and common for multi-step modals.
    // The user sees the confirmation with the entered name, then clicks "Confirm".
    // If name was empty, validation in handleFormSubmit will catch it (because handleSubmit wraps it).
    // Let's keep the current structure but ensure handleFormSubmit is the one wrapped by handleSubmit for final validation.
    setShowConfirmation(true); // Move to confirmation view
  };

  const handleBack = () => {
    setShowConfirmation(false); // Go back to form view
  };

  const handleCancel = () => {
    reset(); // Reset form fields
    setError(null); // Clear any local error state
    setShowConfirmation(false); // Ensure we are in the form view
    onClose(); // Close the modal
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-black/20 backdrop-blur-xl shadow-lg shadow-neutral-800/20 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
        {!showConfirmation ? (
          // --- Main Form View ---
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {" "}
            {/* handleSubmit wraps the final submit logic */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Create New Playlist</h3>
                <button
                  type="button"
                  onClick={handleCancel} // Use handleCancel to reset state on close
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && ( // Display local error if set
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
                      errors.name ? "input-error" : "input-primary" // Apply error styling if validation fails
                    }`}
                    placeholder="Enter playlist name"
                    {...register("name", {
                      // Register with validation rules
                      required: "Name is required", // Rule 1: Required
                      maxLength: {
                        // Rule 2: Max Length
                        value: 100,
                        message: "Name cannot exceed 100 characters",
                      },
                      // Optional: Add a rule to prevent leading/trailing whitespace if desired
                      // validate: (value) => value.trim().length > 0 || "Name cannot be empty or just spaces"
                    })}
                  />
                  {errors.name && ( // Display error message if validation fails
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
                      errors.description ? "textarea-error" : "textarea-primary" // Apply error styling if validation fails
                    }`}
                    placeholder="Enter playlist description (optional)"
                    rows="3"
                    {...register("description", {
                      // Register with validation rules
                      maxLength: {
                        // Rule: Max Length
                        value: 500,
                        message: "Description cannot exceed 500 characters",
                      },
                    })}
                  ></textarea>
                  {errors.description && ( // Display error message if validation fails
                    <p className="text-error text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {currentProblemId && (
                  <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
                    <p className="flex items-start gap-2">
                      <Plus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        The current problem will be added to this new playlist
                        after creation.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 bg-black/10 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-ghost"
                disabled={loading} // Disable buttons while loading
              >
                Cancel
              </button>
              <button
                type="button" // Use button type to prevent default form submission on this step
                onClick={handleConfirmAndSubmit} // Trigger confirmation step
                className="btn btn-primary"
                disabled={loading || Object.keys(errors).length > 0} // Disable if loading or form has errors
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Next" // Changed text to reflect it goes to confirmation
                )}
              </button>
            </div>
          </form>
        ) : (
          // --- Confirmation View ---
          <div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Confirm Creation</h3>
                <button
                  type="button"
                  onClick={handleBack} // Go back to form
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Go back"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && ( // Display local error if set, relevant here if handleFormSubmit fails
                <div className="mb-4 p-3 bg-error/20 border border-error/30 text-error rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="p-4 bg-base-200/30 rounded-xl border border-white/10">
                  <h4 className="font-semibold text-lg mb-1">{playlistName}</h4>
                  {watch("description") && ( // Show description if entered
                    <p className="text-sm text-gray-400">
                      {watch("description")}
                    </p>
                  )}
                </div>

                {currentProblemId && ( // Show problem info if applicable
                  <div className="p-3 bg-info/10 border border-info/20 rounded-lg text-sm">
                    <p className="flex items-start gap-2">
                      <Plus className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>The current problem will be added.</span>
                    </p>
                  </div>
                )}

                <p className="text-sm text-gray-400">
                  Are you sure you want to create this playlist?
                </p>
              </div>
            </div>

            <div className="p-4 bg-black/10 border-t border-white/10 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="btn btn-ghost"
                disabled={loading} // Disable buttons while loading
              >
                Back
              </button>
              <button
                type="button" // Use button type, handleSubmit is on the main form
                onClick={handleSubmit(handleFormSubmit)} // Call the main submit logic, which includes validation
                className="btn btn-primary"
                disabled={loading} // Disable if already loading
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Confirm & Create"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePlaylistModel;
