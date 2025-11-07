import React from "react";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

// Colors for pie slices
const COLORS = ["#00C49F", "#FF8042", "#FFBB28"]; // you can customize

const Charts = ({ reviews }) => {
  // Initialize sentiment counters
  const sentimentCount = {};

  reviews.forEach((review) => {
    const sentiment = review.sentiment.trim(); // e.g., "Positive Feedback"
    sentimentCount[sentiment] = (sentimentCount[sentiment] || 0) + 1;
  });

  const chartData = Object.entries(sentimentCount).map(([key, value]) => ({
    name: key,
    value,
  }));

  return (
    <div className="flex flex-col md:flex-row gap-10 items-center justify-center mt-10">
      {/* Pie Chart */}
      <PieChart width={300} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* Bar Chart */}
      <BarChart width={400} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </div>
  );
};

export default Charts;
