/**
 * WorkSummery.jsx
 * 
 * A Pie Chart to show Employee's Work Distribution by Task
 */

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Color palette (feel free to match your theme)
const COLORS = [
  "#2563eb", // blue-600
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ec4899", // pink-500
  "#8b5cf6", // purple-500
  "#ef4444", // red-500
  "#14b8a6", // teal-500
  "#6366f1", // indigo-500
];

const WorkSummery = ({ data, employeeName }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-6">
        No work data available for this employee.
      </div>
    );
  }
// ✅ Aggregate data: sum hours by task
const aggregatedData = Object.values(
  data.reduce((acc, item) => {
    // If this task isn't in the accumulator yet, initialize it
    if (!acc[item.task]) {
      acc[item.task] = { task: item.task, hour: 0 };
    }
    // Add this entry's hours to the total
    acc[item.task].hour += item.hour;
    return acc;
  }, {})
);
// Now aggregatedData is an array like:
// [ { task: "Support", hour: 8 }, { task: "Sales", hour: 2 } ]


  return (
    <div className="bg-base-100 border rounded-lg shadow p-4 mb-6">
      <h3 className="text-xl font-bold text-center mb-4 text-primary">
        {employeeName}'s Work Distribution
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={aggregatedData}
            dataKey="hour"
            nameKey="task"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {aggregatedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value} hours`}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkSummery;
