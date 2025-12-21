"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface RevenueTrendChartProps {
  data: Array<{
    date: string;
    revenue: number;
    units?: number;
  }>;
  height?: number;
}

export function RevenueTrendChart({
  data,
  height = 300,
}: RevenueTrendChartProps) {
  // Format data for chart
  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="date"
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value: number | undefined) => value ? [`$${value.toFixed(2)}`, "Revenue"] : ["$0.00", "Revenue"]}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ fill: "#10b981", r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

