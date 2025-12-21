"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface CategoryBreakdownChartProps {
  data: Array<{
    category: string;
    revenue: number;
    units: number;
  }>;
  height?: number;
}

export function CategoryBreakdownChart({
  data,
  height = 300,
}: CategoryBreakdownChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="category"
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
        <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

