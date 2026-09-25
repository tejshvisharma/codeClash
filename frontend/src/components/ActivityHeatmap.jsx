import React from "react";
import {ActivityCalendar} from "react-activity-calendar";

const ActivityHeatmap = ({ data = [] }) => {
  // Transform data to the format required by react-activity-calendar
  const transformedData = data.map((item) => ({
    date: item.date,
    count: item.count,
    level:
      item.count === 0
        ? 0
        : item.count <= 2
        ? 1
        : item.count <= 4
        ? 2
        : item.count <= 6
        ? 3
        : 4,
  }));

  // Define custom theme matching our app's color scheme
  const theme = {
    light: ["#f0f0f0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-500 dark:text-gray-400">
        <p>
          No activity data available. Start solving problems to see your
          activity!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px]">
        <ActivityCalendar
          data={transformedData}
          theme={theme}
          blockSize={12}
          blockMargin={4}
          fontSize={12}
          hideColorLegend={false}
          hideTotalCount={false}
          showWeekdayLabels
          labels={{
            totalCount: "{{count}} problems solved in the last year",
          }}
        />
      </div>
    </div>
  );
};

export default ActivityHeatmap;
