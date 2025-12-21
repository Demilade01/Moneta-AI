"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Target,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/client/trpc";
import { RevenueTrendChart } from "@/components/charts/revenue-trend-chart";
import { CategoryBreakdownChart } from "@/components/charts/category-breakdown-chart";
import { CompetitorComparisonChart } from "@/components/charts/competitor-comparison-chart";

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

  // Fetch analytics data
  const { data: revenueData, isLoading } = trpc.analytics.getRevenueAnalytics.useQuery({
    period,
  });

  const { data: performanceData } = trpc.analytics.getProductPerformance.useQuery({
    period,
    sortBy: "revenue",
    limit: 10,
  });

  const { data: competitorData } = trpc.analytics.getCompetitorComparison.useQuery();

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400">
            Deep dive into your pricing performance
          </p>
        </div>
        <Select value={period} onValueChange={(v: any) => setPeriod(v)}>
          <SelectTrigger className="w-[180px] rounded-xl border-white/10 bg-white/5 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Summary Cards */}
      {revenueData && (
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              label: "Total Revenue",
              value: `$${(revenueData.totalRevenue / 1000).toFixed(1)}K`,
              icon: DollarSign,
              trend: revenueData.growthRate,
            },
            {
              label: "Units Sold",
              value: revenueData.totalUnits.toLocaleString(),
              icon: Package,
              trend: null,
            },
            {
              label: "Trend",
              value: revenueData.trend.trend.charAt(0).toUpperCase() + revenueData.trend.trend.slice(1),
              icon: revenueData.trend.trend === "increasing" ? TrendingUp : TrendingDown,
              trend: null,
            },
            {
              label: "Growth Rate",
              value: `${revenueData.growthRate > 0 ? "+" : ""}${revenueData.growthRate.toFixed(1)}%`,
              icon: Target,
              trend: revenueData.growthRate,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="mt-1 text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  {stat.trend !== null && (
                    <div
                      className={`mt-1 text-xs ${
                        stat.trend > 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stat.trend > 0 ? "↑" : "↓"} {Math.abs(stat.trend).toFixed(1)}%
                    </div>
                  )}
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Revenue Trend Chart */}
      {revenueData && revenueData.timeSeriesData.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Revenue Trend
          </h2>
          <RevenueTrendChart data={revenueData.timeSeriesData} height={350} />
        </motion.div>
      )}

      {/* Category Breakdown */}
      {revenueData && revenueData.categoryBreakdown.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Revenue by Category
          </h2>
          <CategoryBreakdownChart data={revenueData.categoryBreakdown} height={300} />
        </motion.div>
      )}

      {/* Top & Bottom Performers */}
      {performanceData && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top Performers */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <Award className="h-6 w-6 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">
                Top Performers
              </h2>
            </div>
            <div className="space-y-3">
              {performanceData.topPerformers.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-sm font-bold text-emerald-400">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {product.productName}
                      </div>
                      <div className="text-xs text-gray-400">{product.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      ${product.revenue.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {product.units} units
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Performers */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <TrendingDown className="h-6 w-6 text-red-400" />
              <h2 className="text-xl font-semibold text-white">
                Needs Attention
              </h2>
            </div>
            <div className="space-y-3">
              {performanceData.bottomPerformers.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/20 text-sm font-bold text-red-400">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">
                        {product.productName}
                      </div>
                      <div className="text-xs text-gray-400">{product.sku}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-white">
                      ${product.revenue.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {product.units} units
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Competitor Comparison */}
      {competitorData && competitorData.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Competitor Price Comparison
          </h2>
          <CompetitorComparisonChart data={competitorData.slice(0, 10)} height={350} />
        </motion.div>
      )}
    </div>
  );
}
