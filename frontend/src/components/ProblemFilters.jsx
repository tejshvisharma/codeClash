// src/components/ProblemFilters.jsx
import React from "react";

const ProblemFilters = ({
  searchQuery,
  onSearchChange,
  selectedDifficulty,
  onDifficultyChange,
  selectedTag,
  onTagChange,
  allTags,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search problems..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-base-100/50 border border-white/20 focus:border-primary focus:outline-none backdrop-blur-sm"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Difficulty */}
      <select
        className="select select-bordered rounded-xl bg-base-100/50 border-white/20 focus:border-primary backdrop-blur-sm"
        value={selectedDifficulty}
        onChange={(e) => onDifficultyChange(e.target.value)}
      >
        <option value="ALL">All Difficulties</option>
        <option value="EASY">Easy</option>
        <option value="MEDIUM">Medium</option>
        <option value="HARD">Hard</option>
      </select>

      {/* Tags */}
      <select
        className="select select-bordered rounded-xl bg-base-100/50 border-white/20 focus:border-primary backdrop-blur-sm"
        value={selectedTag}
        onChange={(e) => onTagChange(e.target.value)}
      >
        {allTags.map((tag) => (
          <option key={tag} value={tag}>
            {tag === "ALL" ? "All Tags" : tag}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProblemFilters;
