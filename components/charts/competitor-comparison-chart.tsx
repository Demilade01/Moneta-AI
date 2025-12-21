"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface CompetitorComparisonChartProps {
  data: Array<{
    productName: string;
    yourPrice: number;
    avgCompetitorPrice: number;
    positioning: string;
  }>;
  height?: number;
}

export function CompetitorComparisonChart({
  data,
  height = 300,
}: CompetitorComparisonChartProps) {
  // Transform data for grouped bar chart
  const chartData = data.map((d) => ({
    name: d.productName.length > 20 ? d.productName.substring(0, 20) + "..." : d.productName,
    "Your Price": d.yourPrice,
    "Competitor Avg": d.avgCompetitorPrice,
    positioning: d.positioning,
  }));

  const getBarColor = (positioning: string) => {
    switch (positioning) {
      case "premium":
        return "#8b5cf6";
      case "competitive":
        return "#10b981";
      case "discount":
        return "#f59e0b";
      case "underpriced":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis
          dataKey="name"
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: "11px" }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis
          stroke="rgba(255,255,255,0.5)"
          style={{ fontSize: "12px" }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(0,0,0,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            color: "#fff",
          }}
          formatter={(value: number | undefined) => value ? `$${value.toFixed(2)}` : "$0.00"}
        />
        <Bar dataKey="Your Price" fill="#3b82f6" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getBarColor(entry.positioning)} />
          ))}
        </Bar>
        <Bar dataKey="Competitor Avg" fill="#6b7280" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

