"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Package,
  Lightbulb,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    name: "Total Revenue",
    value: "$847,392",
    change: "+12.5%",
    changeType: "positive",
    icon: DollarSign,
  },
  {
    name: "Active Products",
    value: "284",
    change: "+3.2%",
    changeType: "positive",
    icon: Package,
  },
  {
    name: "Avg. Price Point",
    value: "$149.99",
    change: "-2.1%",
    changeType: "negative",
    icon: TrendingUp,
  },
  {
    name: "Recommendations",
    value: "12",
    change: "New",
    changeType: "neutral",
    icon: Lightbulb,
  },
];

const recentActivity = [
  {
    title: "Price Optimization Completed",
    description: "Premium tier pricing updated based on AI recommendations",
    time: "2 hours ago",
    type: "success",
  },
  {
    title: "New Simulation Created",
    description: "Q1 2025 pricing strategy simulation",
    time: "5 hours ago",
    type: "info",
  },
  {
    title: "Data Import Successful",
    description: "Competitor pricing data updated",
    time: "1 day ago",
    type: "success",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="text-gray-400">
          Welcome back! Here's what's happening with your pricing strategy.
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
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-emerald-400"
                    : stat.changeType === "negative"
                    ? "text-red-400"
                    : "text-gray-400"
                }`}
              >
                {stat.changeType === "positive" && (
                  <ArrowUpRight className="h-4 w-4" />
                )}
                {stat.changeType === "negative" && (
                  <ArrowDownRight className="h-4 w-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.name}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart Placeholder */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">
            Revenue Trends
          </h3>
          <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <p className="text-sm text-gray-500">Chart coming soon...</p>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === "success"
                      ? "bg-emerald-400"
                      : "bg-blue-400"
                  }`}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium text-white">
                    {activity.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {activity.description}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid gap-4 md:grid-cols-3"
      >
        <button className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg font-semibold text-white">
            Run New Simulation
          </div>
          <div className="text-sm text-gray-400">
            Test pricing scenarios and forecast impact
          </div>
        </button>

        <button className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Package className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg font-semibold text-white">
            Upload New Data
          </div>
          <div className="text-sm text-gray-400">
            Import pricing or competitor data
          </div>
        </button>

        <button className="group rounded-2xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <Lightbulb className="h-6 w-6 text-white" />
          </div>
          <div className="text-lg font-semibold text-white">
            View Recommendations
          </div>
          <div className="text-sm text-gray-400">
            12 new AI-powered insights ready
          </div>
        </button>
      </motion.div>
    </div>
  );
}

