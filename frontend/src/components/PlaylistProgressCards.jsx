import React from "react";
import { ListCheck, Target, TrendingUp } from "lucide-react";

const PlaylistProgressCards = ({ playlists = [] }) => {
  if (!playlists || playlists.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
        <p>
          No playlists created yet. Create a playlist to organize your
          problem-solving journey!
        </p>
      </div>
    );
  }

  const getProgressPercentage = (solved, total) => {
    if (total === 0) return 0;
    return Math.round((solved / total) * 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage === 100) return "from-green-500 to-emerald-500";
    if (percentage >= 70) return "from-blue-500 to-cyan-500";
    if (percentage >= 40) return "from-amber-500 to-yellow-500";
    return "from-red-500 to-pink-500";
  };

  const getProgressRing = (percentage) => {
    const circumference = 2 * Math.PI * 40; // radius = 40
    const offset = circumference - (percentage / 100) * circumference;
    return { circumference, offset };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playlists.map((playlist) => {
        const percentage = getProgressPercentage(
          playlist.solvedProblems,
          playlist.totalProblems
        );
        const { circumference, offset } = getProgressRing(percentage);

        return (
          <div
            key={playlist.id}
            className="bg-base-200/50 rounded-xl p-6 border border-white/10 hover:border-primary/50 hover:scale-105 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors duration-200">
                  {playlist.name}
                </h3>
                {playlist.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                    {playlist.description}
                  </p>
                )}
              </div>
              <ListCheck className="w-5 h-5 text-primary flex-shrink-0 ml-2" />
            </div>

            {/* Progress Circle */}
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-700"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="64"
                    cy="64"
                    r="40"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop
                        offset="0%"
                        className="text-primary"
                        stopColor="currentColor"
                      />
                      <stop
                        offset="100%"
                        className="text-secondary"
                        stopColor="currentColor"
                      />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Percentage text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {percentage}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Problems
                  </span>
                </div>
                <span className="font-semibold">
                  {playlist.solvedProblems} / {playlist.totalProblems}
                </span>
              </div>

              {percentage > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Progress
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {percentage === 100 ? (
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-semibold border border-green-500/20">
                        Completed! 🎉
                      </span>
                    ) : percentage >= 70 ? (
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-semibold border border-blue-500/20">
                        Almost there!
                      </span>
                    ) : percentage >= 40 ? (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-semibold border border-amber-500/20">
                        In Progress
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-semibold border border-red-500/20">
                        Just Started
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getProgressColor(
                  percentage
                )} transition-all duration-1000 ease-out`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>

            {/* Created Date */}
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              Created{" "}
              {new Date(playlist.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlaylistProgressCards;
