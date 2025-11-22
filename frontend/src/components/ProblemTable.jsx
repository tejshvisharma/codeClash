import React, { useMemo, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { CheckCircle2, Clock, Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import  useProblemStore  from "../store/useProblemStore";
import ProblemFilters from "./ProblemFilters";
import AddToPlaylistModal from "./AddToPlaylist";

const DifficultyBadge = ({ difficulty }) => {
  const styles = {
    EASY: "bg-emerald-500/20 text-emerald-400",
    MEDIUM: "bg-amber-500/20 text-amber-400",
    HARD: "bg-rose-500/20 text-rose-400",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${styles[difficulty]}`}
    >
      {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
    </span>
  );
};

const TagBadge = ({ tag }) => (
  <span className="px-2 py-1 text-xs bg-base-100/30 rounded-full text-gray-400 mr-1 mb-1 inline-block">
    {tag}
  </span>
);



const ProblemTable = ({ problems, isLoading = false }) => {
  const { authUser } = useAuthStore();
  const { deleteProblem } = useProblemStore();
  const navigate = useNavigate();

  // Playlist related states and hooks : 
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [problemToAdd, setProblemToAdd] = useState(null); // Store the problem object being added

  const openAddToPlaylistModal = (problem) => {
    setProblemToAdd(problem);
    setIsAddToPlaylistModalOpen(true);
  };

  const closeAddToPlaylistModal = () => {
    setIsAddToPlaylistModalOpen(false);
    setProblemToAdd(null); 
  };


  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("ALL");
  const [selectedTag, setSelectedTag] = React.useState("ALL");
  const [showUnsolvedOnly, setShowUnsolvedOnly] = React.useState(false);
  // Extract unique tags
  const allTags = useMemo(() => {
    const tags = new Set();
    problems.forEach((p) => p.tags?.forEach((tag) => tags.add(tag)));
    return ["ALL", ...Array.from(tags)];
  }, [problems]);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "ALL" ||
        problem.difficulty === selectedDifficulty;
      const matchesTag =
        selectedTag === "ALL" || problem.tags?.includes(selectedTag);
      const isUnsolved = !authUser?.solvedProblems?.includes(problem.id);

      return (
        matchesSearch &&
        matchesDifficulty &&
        matchesTag &&
        (showUnsolvedOnly ? isUnsolved : true)
      );
    });
  }, [
    problems,
    searchQuery,
    selectedDifficulty,
    selectedTag,
    showUnsolvedOnly,
    authUser?.solvedProblems,
  ]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(10);

  const { currentProblems, totalPages } = useMemo(() => {
    const total = filteredProblems.length;
    const pages = Math.ceil(total / itemsPerPage);

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const current = filteredProblems.slice(start, end);

    return { currentProblems: current, totalPages: pages };
  }, [filteredProblems, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(
    currentPage * itemsPerPage,
    filteredProblems.length
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const isSolved = (problemId) => {
    return authUser?.solvedProblems?.includes(problemId);
  };


  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this problem?")) {
      await deleteProblem(id);
    }
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/add-problem/${id}`);
  };

  return (
    <div className="w-full max-w-7xl">
      {/* Filters */}
      <ProblemFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        allTags={allTags}
      />

      {/* Summary & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
        <div className="text-sm text-gray-400">
          Showing{" "}
          <span className="text-white font-medium">
            {startIndex}-{endIndex}
          </span>{" "}
          of{" "}
          <span className="text-white font-medium">
            {filteredProblems.length}
          </span>{" "}
          problems
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="checkbox checkbox-xs checkbox-primary"
            checked={showUnsolvedOnly}
            onChange={(e) => setShowUnsolvedOnly(e.target.checked)}
          />
          <span className="text-sm text-gray-300">Hide solved problems</span>
        </label>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20 backdrop-blur-lg scrollbar-hide">
        <table className="table w-full table-auto">
          <thead>
            <tr className="text-left text-gray-400 text-sm">
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Problem</th>
              <th className="px-4 py-3">Difficulty</th>
              <th className="px-4 py-3">Tags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="text-center py-8">
                  <span className="loading loading-spinner text-primary"></span>
                </td>
              </tr>
            ) : filteredProblems.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  {problems.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <div className="text-lg font-medium mb-2">
                        No problems yet!
                      </div>
                      {authUser?.role === "ADMIN" ? (
                        <Link
                          to="/add-problem"
                          className="btn btn-primary btn-sm mt-2"
                        >
                          Create Your First Problem
                        </Link>
                      ) : (
                        "Check back soon — problems are being added!"
                      )}
                    </div>
                  ) : (
                    "No problems match your filters."
                  )}
                </td>
              </tr>
            ) : (
              currentProblems.map((problem) => (
                <tr
                  key={problem.id}
                  className="border-t border-white/5 hover:bg-white/5 transition-colors group"
                >
                  {/* Status */}
                  <td className="px-4 py-4 w-12">
                    {isSolved(problem.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-500" />
                    )}
                  </td>

                  {/* Title with Hover Preview */}
                  <td className="px-4 py-4 font-medium relative">
                    <Link
                      to={`/problem/${problem.id}`}
                      className="text-white hover:text-primary transition-colors inline-block"
                    >
                      {problem.title}
                    </Link>
                    {/* Hover Preview */}
                    <div className="absolute left-0 top-full z-20 hidden group-hover:block mt-1 max-w-md w-[300px] bg-base-100/90 backdrop-blur border border-white/10 rounded-xl p-3 text-xs shadow-xl">
                      <div className="font-medium text-white mb-1">
                        {problem.title}
                      </div>
                      <div className="text-gray-300 line-clamp-3">
                        {problem.description || "No description available."}
                      </div>
                      <div className="mt-2 flex gap-2">
                        <DifficultyBadge difficulty={problem.difficulty} />
                        <span className="text-amber-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {problem.views || 0}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Difficulty */}
                  <td className="px-4 py-4">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap max-w-xs">
                      {problem.tags?.map((tag, i) => (
                        <TagBadge key={i} tag={tag} />
                      ))}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/problem/${problem.id}`}
                        className="btn btn-ghost btn-sm p-2 rounded-full text-gray-400 hover:text-primary"
                        aria-label="View problem"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => openAddToPlaylistModal(problem)}
                        className="btn btn-xs btn-ghost tooltip tooltip-top"
                        data-tip="Add to Playlist"
                        aria-label={`Add ${problem.title} to playlist`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {authUser?.role === "ADMIN" && (
                        <>
                          <button
                            onClick={(e) => handleEdit(e, problem.id)}
                            className="btn btn-ghost btn-sm p-2 rounded-full text-blue-400 hover:text-blue-300"
                            aria-label="Edit problem"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDelete(e, problem.id)}
                            className="btn btn-ghost btn-sm p-2 rounded-full text-error hover:text-error"
                            aria-label="Delete problem"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 p-4 bg-base-100/20 rounded-xl border border-white/10">
        {/* Left: Previous Button */}
        <button
          className={`btn btn-sm rounded-xl ${
            currentPage === 1
              ? "btn-disabled opacity-50 cursor-not-allowed"
              : "btn-ghost hover:bg-primary/20 hover:text-primary"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>

        {/* Center: Page Numbers */}
        <div className="flex items-center gap-1">
          {/* First Page */}
          {currentPage > 2 && (
            <>
              <button
                className="btn btn-sm btn-ghost rounded-lg"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {currentPage > 3 && (
                <span className="px-2 text-gray-400">...</span>
              )}
            </>
          )}

          {/* Previous Page Button (if needed) */}
          {currentPage > 1 && (
            <button
              className="btn btn-sm btn-ghost rounded-lg"
              onClick={() => handlePageChange(currentPage - 1)}
            >
              {currentPage - 1}
            </button>
          )}

          {/* Current Page */}
          <button
            className="btn btn-sm btn-primary rounded-lg min-w-[36px] text-white shadow-lg shadow-primary/20"
            onClick={() => handlePageChange(currentPage)}
          >
            {currentPage}
          </button>

          {/* Next Page Button (if needed) */}
          {currentPage < totalPages && (
            <button
              className="btn btn-sm btn-ghost rounded-lg"
              onClick={() => handlePageChange(currentPage + 1)}
            >
              {currentPage + 1}
            </button>
          )}

          {/* Next Dots and Last Page */}
          {currentPage < totalPages - 1 && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-400">...</span>
              )}
              <button
                className="btn btn-sm btn-ghost rounded-lg"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Right: Next Button */}
        <button
          className={`btn btn-sm rounded-xl ${
            currentPage === totalPages
              ? "btn-disabled opacity-50 cursor-not-allowed"
              : "btn-ghost hover:bg-primary/20 hover:text-primary"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
      {/* Render the AddToPlaylistModal */}
      {problemToAdd && (
        <AddToPlaylistModal
          isOpen={isAddToPlaylistModalOpen}
          onClose={closeAddToPlaylistModal}
          problemIdToAdd={problemToAdd.id}
          problemTitle={problemToAdd.title}
        />
      )}
    </div>
  );
};

export default ProblemTable;
