/**
 * Test Data Generator for Profile Page
 *
 * This script helps generate sample data for testing the profile page.
 * Run this file or use the functions in your application to create test data.
 */

// Sample data for testing profile page

export const sampleProfile = {
  user: {
    id: "test-user-id",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://ui-avatars.com/api/?name=John+Doe&size=250",
    role: "USER",
    createdAt: new Date("2024-01-01"),
  },
  stats: {
    totalSolved: 150,
    easySolved: 60,
    mediumSolved: 70,
    hardSolved: 20,
    totalProblems: 500,
    easyProblems: 200,
    mediumProblems: 200,
    hardProblems: 100,
    totalSubmissions: 300,
    acceptedSubmissions: 200,
    acceptanceRate: "66.7",
    currentStreak: 7,
    maxStreak: 15,
    rank: 1234,
    percentile: "85.5",
    totalUsers: 10000,
  },
  playlists: [
    {
      id: "playlist-1",
      name: "Array Problems",
      description: "Master array manipulation",
      totalProblems: 40,
      solvedProblems: 30,
      createdAt: new Date("2024-06-01"),
    },
    {
      id: "playlist-2",
      name: "Dynamic Programming",
      description: "DP practice set",
      totalProblems: 30,
      solvedProblems: 15,
      createdAt: new Date("2024-07-01"),
    },
    {
      id: "playlist-3",
      name: "Graph Algorithms",
      description: "Graph theory problems",
      totalProblems: 25,
      solvedProblems: 25,
      createdAt: new Date("2024-08-01"),
    },
  ],
};

export const sampleActivityCalendar = generateActivityData(365);

export const sampleLanguageStats = [
  { language: "Python", count: 120, percentage: "45.0" },
  { language: "JavaScript", count: 80, percentage: "30.0" },
  { language: "Java", count: 50, percentage: "18.8" },
  { language: "C++", count: 17, percentage: "6.2" },
];

export const sampleRecentActivity = [
  {
    id: "1",
    problemId: "prob-1",
    problemTitle: "Two Sum",
    difficulty: "EASY",
    solvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "2",
    problemId: "prob-2",
    problemTitle: "Binary Tree Inorder Traversal",
    difficulty: "MEDIUM",
    solvedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
  {
    id: "3",
    problemId: "prob-3",
    problemTitle: "Maximum Subarray",
    difficulty: "MEDIUM",
    solvedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "4",
    problemId: "prob-4",
    problemTitle: "Regular Expression Matching",
    difficulty: "HARD",
    solvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "5",
    problemId: "prob-5",
    problemTitle: "Valid Parentheses",
    difficulty: "EASY",
    solvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

export const sampleSubmissionTrends = generateTrendsData(30);

export const sampleProblemStats = [
  {
    difficulty: "EASY",
    solved: 60,
    totalAttempts: 100,
    accepted: 80,
    acceptanceRate: "80.0",
  },
  {
    difficulty: "MEDIUM",
    solved: 70,
    totalAttempts: 150,
    accepted: 90,
    acceptanceRate: "60.0",
  },
  {
    difficulty: "HARD",
    solved: 20,
    totalAttempts: 50,
    accepted: 30,
    acceptanceRate: "60.0",
  },
];

// Helper functions

function generateActivityData(days) {
  const activity = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Random activity: 0-5 problems per day with some days having no activity
    const count = Math.random() > 0.3 ? Math.floor(Math.random() * 6) : 0;

    activity.push({
      date: date.toISOString().split("T")[0],
      count,
    });
  }

  return activity;
}

function generateTrendsData(days) {
  const trends = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const totalSubmissions = Math.floor(Math.random() * 10) + 1;
    const acceptedSubmissions = Math.floor(
      totalSubmissions * (0.5 + Math.random() * 0.4)
    );

    trends.push({
      date: date.toISOString().split("T")[0],
      totalSubmissions,
      acceptedSubmissions,
      successRate: ((acceptedSubmissions / totalSubmissions) * 100).toFixed(1),
    });
  }

  return trends;
}

// Test function to log sample data
export function logSampleData() {
  console.log("Sample Profile Data:");
  console.log(JSON.stringify(sampleProfile, null, 2));
  console.log("\nSample Activity Calendar:");
  console.log(JSON.stringify(sampleActivityCalendar.slice(0, 5), null, 2));
  console.log("\nSample Language Stats:");
  console.log(JSON.stringify(sampleLanguageStats, null, 2));
  console.log("\nSample Recent Activity:");
  console.log(JSON.stringify(sampleRecentActivity, null, 2));
  console.log("\nSample Submission Trends:");
  console.log(JSON.stringify(sampleSubmissionTrends.slice(0, 5), null, 2));
  console.log("\nSample Problem Stats:");
  console.log(JSON.stringify(sampleProblemStats, null, 2));
}

// Export all for testing
export default {
  sampleProfile,
  sampleActivityCalendar,
  sampleLanguageStats,
  sampleRecentActivity,
  sampleSubmissionTrends,
  sampleProblemStats,
  logSampleData,
};
