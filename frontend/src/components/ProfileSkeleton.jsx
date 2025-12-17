import React from "react";

const ProfileSkeleton = () => {
  return (
    <div className="min-h-screen px-4 py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-secondary opacity-15 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header Skeleton */}
        <div className="text-center mb-8 animate-pulse">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-700"></div>
          </div>
          <div className="h-8 w-48 bg-gray-700 rounded mx-auto mb-2"></div>
          <div className="h-4 w-64 bg-gray-700 rounded mx-auto"></div>
        </div>

        {/* Hero Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 animate-pulse"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
                <div className="w-12 h-8 bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-24 bg-gray-700 rounded mb-1"></div>
              <div className="h-3 w-32 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Activity Calendar Skeleton */}
        <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 animate-pulse">
          <div className="h-6 w-40 bg-gray-700 rounded mb-6"></div>
          <div className="h-40 bg-gray-700 rounded"></div>
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-6 w-48 bg-gray-700 rounded mb-6"></div>
              <div className="h-64 bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>

        {/* Trends Skeleton */}
        <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 animate-pulse">
          <div className="h-6 w-48 bg-gray-700 rounded mb-6"></div>
          <div className="h-80 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
