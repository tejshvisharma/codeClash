// frontend/src/pages/HomePage.jsx
import React, { useState } from "react";
import useProblemStore from "../store/useProblemStore";
import ProblemTable from "../components/ProblemTable";
import { Plus } from "lucide-react";
import CreatePlaylistModel from "../components/CreatePlaylistModel";

const HomePage = () => {
  const { problems, getAllProblems, isProblemsLoading } = useProblemStore();

  React.useEffect(() => {
    if (problems.length === 0) {
      getAllProblems();
    }
  }, [getAllProblems, problems.length]);

  
  const [isCreatePlaylistModalOpen, setIsCreatePlaylistModalOpen] =
    useState(false);

  // Function to handle playlist creation (passed to the modal)
  const handleCreatePlaylist = async (newPlaylist) => {
    
    console.log("New playlist created:", newPlaylist);
  };

  // Function to open the modal, passing the current problem ID
  const openCreatePlaylistModal = () => {
    setIsCreatePlaylistModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center mt-14 px-4 w-full relative overflow-hidden">
      {" "}
      <div className="absolute top-16 left-0 w-1/3 h-1/3 bg-primary opacity-20 blur-3xl rounded-full"></div>{" "}
      {/* Made it a circle and adjusted opacity */}
      <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-secondary opacity-15 blur-3xl rounded-full"></div>{" "}
      <div className="flex flex-col items-center z-10 max-w-7xl w-full">
        {" "}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center">
          Welcome to{" "}
          <span className="font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            CodeClash
          </span>
        </h1>
        <p className="mt-4 text-center text-lg font-semibold text-gray-500 dark:text-gray-400 max-w-2xl">
          A Platform Inspired by Leetcode which helps you to prepare for coding
          interviews and helps you to improve your coding skills by solving
          coding problems.
        </p>
        {/* Action Buttons Container */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 z-10 w-full max-w-md">
          {" "}
          <a
            href="/runcode" // Replace with actual route if different
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/10 focus:ring-4 focus:ring-primary/30 transition-all duration-200 shadow-lg shadow-primary/10"
          >
            <svg
              className="w-4 h-4 mr-2" // Added mr-2 for icon spacing
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
            Run Code Now
          </a>
          <button
            onClick={openCreatePlaylistModal}
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-center text-white bg-black/20 backdrop-blur-lg rounded-xl border border-white/10 hover:bg-white/10 focus:ring-4 focus:ring-accent/30 transition-all duration-200 shadow-lg shadow-accent/10"
          >
            <Plus className="w-4 h-4 mr-1" />
            Create Playlist
          </button>
        </div>
        {/* Problem Table */}
        <div className="w-full mt-8 z-10">
          <ProblemTable problems={problems} isLoading={isProblemsLoading} />
        </div>
      </div>
      <CreatePlaylistModel
        isOpen={isCreatePlaylistModalOpen}
        onClose={() => setIsCreatePlaylistModalOpen(false)}
        onSubmit={handleCreatePlaylist}
      />
    </div>
  );
};

export default HomePage;
