import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const ProblemStatsChart = ({ stats = {}, problemStats = [] }) => {
  // Doughnut chart for solved problems by difficulty
  const doughnutData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Problems Solved",
        data: [
          stats.easySolved || 0,
          stats.mediumSolved || 0,
          stats.hardSolved || 0,
        ],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderColor: ["#16a34a", "#d97706", "#dc2626"],
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
  };

  // Bar chart for acceptance rates by difficulty
  const barData = {
    labels: ["Easy", "Medium", "Hard"],
    datasets: [
      {
        label: "Acceptance Rate (%)",
        data: Array.isArray(problemStats)
          ? problemStats.map((stat) => parseFloat(stat.acceptanceRate || 0))
          : [0, 0, 0],
        backgroundColor: [
          "rgba(34, 197, 94, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
        ],
        borderColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          callback: (value) => value + "%",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => `${context.parsed.y.toFixed(1)}% acceptance rate`,
        },
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
          <p className="text-2xl font-bold text-green-500">
            {stats.easySolved || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Easy</p>
        </div>
        <div className="text-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <p className="text-2xl font-bold text-amber-500">
            {stats.mediumSolved || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Medium</p>
        </div>
        <div className="text-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-2xl font-bold text-red-500">
            {stats.hardSolved || 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Hard</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <div className="h-64">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Problems Solved
          </h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>

        {/* Bar Chart */}
        <div className="h-64">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            Acceptance Rate
          </h3>
          <Bar data={barData} options={barOptions} />
        </div>
      </div>
    </div>
  );
};

export default ProblemStatsChart;
