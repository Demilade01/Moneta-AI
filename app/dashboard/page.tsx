"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Package,
  Lightbulb,
  ArrowUpRight,
  Upload,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/client/trpc";
import { format } from "date-fns";
import { RevenueTrendChart } from "@/components/charts/revenue-trend-chart";

export default function DashboardPage() {
  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } =
    trpc.analytics.getDashboardStats.useQuery();

  // Fetch products count
  const { data: productsData } = trpc.products.list.useQuery({
    limit: 1,
    offset: 0,
  });

  // Fetch recent uploads
  const { data: uploadsData } = trpc.upload.getHistory.useQuery({
    limit: 5,
    offset: 0,
  });

  // Fetch revenue analytics
  const { data: revenueData } = trpc.analytics.getRevenueAnalytics.useQuery({
    period: "30d",
  });

  const stats = [
    {
      name: "Total Revenue",
      value: analyticsData?.totalRevenue
        ? `$${(analyticsData.totalRevenue / 1000).toFixed(1)}K`
        : "$0",
      icon: DollarSign,
    },
    {
      name: "Active Products",
      value: productsData?.total.toString() || "0",
      icon: Package,
    },
    {
      name: "Avg. Price Point",
      value: analyticsData?.avgPrice
        ? `$${analyticsData.avgPrice.toFixed(2)}`
        : "$0",
      icon: TrendingUp,
    },
    {
      name: "Data Uploads",
      value: uploadsData?.total.toString() || "0",
      icon: Upload,
    },
  ];

  if (analyticsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400">
          Monitor your pricing intelligence and AI recommendations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-400">{stat.name}</div>
                <div className="mt-2 text-3xl font-bold text-white">
                  {stat.value}
                </div>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Revenue Trend Chart */}
      {revenueData && revenueData.timeSeriesData.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Revenue Trend</h2>
              <p className="text-sm text-gray-400">
                {revenueData.trend.trend === "increasing" ? "📈" : revenueData.trend.trend === "decreasing" ? "📉" : "➡️"}{" "}
                {revenueData.trend.trend.charAt(0).toUpperCase() + revenueData.trend.trend.slice(1)} trend •{" "}
                {revenueData.growthRate > 0 ? "+" : ""}{revenueData.growthRate.toFixed(1)}% growth
              </p>
            </div>
          </div>
          <RevenueTrendChart data={revenueData.timeSeriesData} height={250} />
        </motion.div>
      )}

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Recent Data Uploads
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/dashboard/data")}
              className="text-gray-400 hover:text-white"
            >
              View All
            </Button>
          </div>

          {uploadsData && uploadsData.uploads.length > 0 ? (
            <div className="space-y-4">
              {uploadsData.uploads.map((upload) => (
                <div
                  key={upload.id}
                  className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                    <Activity className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {upload.fileName}
                    </div>
                    <div className="mt-1 text-sm text-gray-400">
                      {upload.fileType} • {upload.rowsProcessed || 0} rows
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {format(new Date(upload.uploadedAt), "MMM d, yyyy 'at' h:mm a")}
                    </div>
                  </div>
                  <div>
                    {upload.status === "COMPLETED" ? (
                      <span className="rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                        Success
                      </span>
                    ) : upload.status === "FAILED" ? (
                      <span className="rounded-lg bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
                        Failed
                      </span>
                    ) : (
                      <span className="rounded-lg bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                        Processing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold text-white">
                No data uploaded yet
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Upload your pricing, sales, or competitor data to get started
              </p>
              <Button
                onClick={() => (window.location.href = "/dashboard/data")}
                className="mt-4 rounded-xl bg-white text-black hover:bg-white/90"
              >
                Upload Data
              </Button>
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h2 className="mb-6 text-xl font-semibold text-white">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "Upload Data",
                description: "Import pricing, sales, or competitor data",
                icon: Upload,
                href: "/dashboard/data",
              },
              {
                title: "View Products",
                description: "Analyze your product pricing",
                icon: Package,
                href: "/dashboard/pricing",
              },
              {
                title: "AI Recommendations",
                description: "Get intelligent pricing suggestions",
                icon: Lightbulb,
                href: "/dashboard/recommendations",
              },
            ].map((action) => (
              <button
                key={action.title}
                onClick={() => (window.location.href = action.href)}
                className="flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:bg-white/10"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-white">{action.title}</div>
                  <div className="text-sm text-gray-400">
                    {action.description}
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Getting Started Guide */}
      {(!productsData || productsData.total === 0) && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
        >
          <h2 className="mb-4 text-xl font-semibold text-white">
            Getting Started with Moneta AI
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Upload Your Data",
                description:
                  "Import your product pricing, sales history, and competitor data",
              },
              {
                step: "2",
                title: "AI Analysis",
                description:
                  "Our AI analyzes patterns and identifies pricing opportunities",
              },
              {
                step: "3",
                title: "Get Recommendations",
                description:
                  "Receive actionable pricing recommendations with confidence scores",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              onClick={() => (window.location.href = "/dashboard/data")}
              className="gap-2 rounded-xl bg-white text-black hover:bg-white/90"
            >
              <Upload className="h-4 w-4" />
              Upload Your First Dataset
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
