import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SubmissionTrendsChart = ({ trends = [] }) => {
  if (!trends || trends.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No submission trend data available yet.</p>
      </div>
    );
  }

  // Sort trends by date
  const sortedTrends = [...trends].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const chartData = {
    labels: sortedTrends.map((trend) => {
      const date = new Date(trend.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Total Submissions",
        data: sortedTrends.map((trend) => trend.totalSubmissions),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Accepted Submissions",
        data: sortedTrends.map((trend) => trend.acceptedSubmissions),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#9ca3af",
          padding: 15,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          usePointStyle: true,
          pointStyle: "circle",
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
        callbacks: {
          afterLabel: (context) => {
            const dataIndex = context.dataIndex;
            const successRate = sortedTrends[dataIndex].successRate;
            return `Success Rate: ${successRate}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          precision: 0,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  // Calculate summary stats
  const totalSubmissions = sortedTrends.reduce(
    (sum, trend) => sum + trend.totalSubmissions,
    0
  );
  const totalAccepted = sortedTrends.reduce(
    (sum, trend) => sum + trend.acceptedSubmissions,
    0
  );
  const avgSuccessRate =
    sortedTrends.length > 0
      ? (
          sortedTrends.reduce(
            (sum, trend) => sum + parseFloat(trend.successRate),
            0
          ) / sortedTrends.length
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Total Submissions
          </p>
          <p className="text-2xl font-bold text-blue-500">{totalSubmissions}</p>
        </div>
        <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Accepted
          </p>
          <p className="text-2xl font-bold text-green-500">{totalAccepted}</p>
        </div>
        <div className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/20">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
            Avg Success Rate
          </p>
          <p className="text-2xl font-bold text-purple-500">
            {avgSuccessRate}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SubmissionTrendsChart;
