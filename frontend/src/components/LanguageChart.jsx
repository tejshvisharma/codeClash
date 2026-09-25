import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const LanguageChart = ({ languages = [] }) => {
  if (!languages || languages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>
          No language data available. Submit some code to see your language
          preferences!
        </p>
      </div>
    );
  }

  // Color palette for different languages
  const colorPalette = [
    { bg: "rgba(59, 130, 246, 0.7)", border: "#3b82f6" }, // Blue
    { bg: "rgba(16, 185, 129, 0.7)", border: "#10b981" }, // Green
    { bg: "rgba(245, 158, 11, 0.7)", border: "#f59e0b" }, // Amber
    { bg: "rgba(239, 68, 68, 0.7)", border: "#ef4444" }, // Red
    { bg: "rgba(139, 92, 246, 0.7)", border: "#8b5cf6" }, // Violet
    { bg: "rgba(236, 72, 153, 0.7)", border: "#ec4899" }, // Pink
    { bg: "rgba(20, 184, 166, 0.7)", border: "#14b8a6" }, // Teal
    { bg: "rgba(251, 146, 60, 0.7)", border: "#fb923c" }, // Orange
  ];

  const chartData = {
    labels: languages.map((lang) => lang.language),
    datasets: [
      {
        label: "Submissions",
        data: languages.map((lang) => lang.count),
        backgroundColor: languages.map(
          (_, index) => colorPalette[index % colorPalette.length].bg
        ),
        borderColor: languages.map(
          (_, index) => colorPalette[index % colorPalette.length].border
        ),
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#9ca3af",
          padding: 12,
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const total = data.datasets[0].data.reduce(
                  (acc, val) => acc + val,
                  0
                );
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  strokeStyle: data.datasets[0].borderColor[i],
                  lineWidth: data.datasets[0].borderWidth,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
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
        callbacks: {
          label: (context) => {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce(
              (acc, val) => acc + val,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} submissions (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="h-64">
        <Doughnut data={chartData} options={options} />
      </div>

      {/* Language List */}
      <div className="space-y-2">
        {languages.map((lang, index) => (
          <div
            key={lang.language}
            className="flex items-center justify-between p-3 bg-base-200/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    colorPalette[index % colorPalette.length].border,
                }}
              ></div>
              <span className="font-medium">{lang.language}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {lang.count} submissions
              </span>
              <span className="text-sm font-semibold text-primary">
                {lang.percentage}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageChart;
