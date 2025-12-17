import React from "react";
import { CheckCircle, Clock } from "lucide-react";

const RecentActivityTimeline = ({ activities = [] }) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
        <p>No recent activity. Start solving problems to build your history!</p>
      </div>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "EASY":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "MEDIUM":
        return "text-amber-500 bg-amber-500/10 border-amber-500/20";
      case "HARD":
        return "text-red-500 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const solvedDate = new Date(date);
    const diffMs = now - solvedDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return solvedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div key={activity.id} className="relative">
          {/* Timeline Line */}
          {index < activities.length - 1 && (
            <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent"></div>
          )}

          {/* Activity Card */}
          <div className="flex gap-4 items-start group hover:bg-base-200/50 p-4 rounded-lg transition-all duration-200">
            {/* Icon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <a
                  href={`/problem/${activity.problemId}`}
                  className="font-semibold text-lg hover:text-primary transition-colors duration-200"
                >
                  {activity.problemTitle}
                </a>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                    activity.difficulty
                  )}`}
                >
                  {activity.difficulty}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{getTimeAgo(activity.solvedAt)}</span>
              </div>
            </div>

            {/* Success Badge */}
            <div className="flex-shrink-0">
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span className="text-sm font-semibold text-green-500">
                  Solved
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* View More Button */}
      {activities.length >= 10 && (
        <div className="text-center pt-4">
          <button className="px-6 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-semibold transition-all duration-200">
            View All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentActivityTimeline;
