import React, { useEffect, useMemo } from "react";
import useProfileStore from "../store/useProfileStore";
import { useAuthStore } from "../store/useAuthStore";
import {
  Trophy,
  Award,
  Flame,
  TrendingUp,
  Calendar,
  Code,
  Target,
  Activity,
} from "lucide-react";
import ActivityHeatmap from "../components/ActivityHeatmap";
import ProblemStatsChart from "../components/ProblemStatsChart";
import LanguageChart from "../components/LanguageChart";
import SubmissionTrendsChart from "../components/SubmissionTrendsChart";
import RecentActivityTimeline from "../components/RecentActivityTimeline";
import PlaylistProgressCards from "../components/PlaylistProgressCards";
import ProfileSkeleton from "../components/ProfileSkeleton";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const {
    profile,
    activityCalendar,
    languageStats,
    recentActivity,
    submissionTrends,
    problemStats,
    isLoading,
    fetchAllProfileData,
  } = useProfileStore();

  useEffect(() => {
    fetchAllProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

  const stats = profile?.stats || {};
  const user = profile?.user || authUser;
  const playlists = profile?.playlists || [];

  return (
    <div className="min-h-screen px-4 py-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-primary opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-secondary opacity-15 blur-3xl rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            {user?.name || "Anonymous User"}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
          <div className="flex justify-center gap-2 mt-4">
            {user?.role === "ADMIN" && (
              <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                Admin
              </span>
            )}
            <span className="px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-primary to-secondary text-white">
              Top {stats.percentile}%
            </span>
          </div>
        </div>

        {/* Hero Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Solved */}
          <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Trophy className="w-8 h-8 text-amber-500" />
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-yellow-500">
                {stats.totalSolved || 0}
              </span>
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Problems Solved
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-500">
              out of {stats.totalProblems || 0} total
            </p>
          </div>

          {/* Current Streak */}
          <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-500">
                {stats.currentStreak || 0}
              </span>
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Current Streak
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-500">
              Max: {stats.maxStreak || 0} days
            </p>
          </div>

          {/* Rank */}
          <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-cyan-500">
                #{stats.rank || 0}
              </span>
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Global Rank
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-500">
              out of {stats.totalUsers || 0} users
            </p>
          </div>

          {/* Acceptance Rate */}
          <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:scale-105 transition-transform duration-300 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-emerald-500">
                {stats.acceptanceRate || 0}%
              </span>
            </div>
            <h3 className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Acceptance Rate
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-500">
              {stats.acceptedSubmissions || 0} / {stats.totalSubmissions || 0}
            </p>
          </div>
        </div>

        {/* Activity Calendar */}
        <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Activity Calendar</h2>
          </div>
          <ActivityHeatmap data={activityCalendar} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Stats */}
          <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Problem Statistics</h2>
            </div>
            <ProblemStatsChart stats={stats} problemStats={problemStats} />
          </div>

          {/* Language Usage */}
          <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Language Usage</h2>
            </div>
            <LanguageChart languages={languageStats} />
          </div>
        </div>

        {/* Submission Trends */}
        <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Submission Trends</h2>
          </div>
          <SubmissionTrendsChart trends={submissionTrends} />
        </div>

        {/* Playlist Progress */}
        {playlists.length > 0 && (
          <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Playlist Progress</h2>
            <PlaylistProgressCards playlists={playlists} />
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-base-100/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <RecentActivityTimeline activities={recentActivity} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
