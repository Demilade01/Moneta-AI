"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AnalyticsPage() {
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
          <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">
            Deep insights into pricing performance and market trends
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30">
            <SelectTrigger className="w-[140px] rounded-xl border-white/10 bg-white/5 text-white">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/10 bg-[#010203]/95 backdrop-blur-xl">
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2 rounded-xl bg-white text-black hover:bg-white/90">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: "$2.4M",
            change: "+18.2%",
            icon: DollarSign,
            positive: true,
          },
          {
            label: "Avg. Order Value",
            value: "$347",
            change: "+12.5%",
            icon: ShoppingCart,
            positive: true,
          },
          {
            label: "Total Customers",
            value: "8,429",
            change: "+7.8%",
            icon: Users,
            positive: true,
          },
          {
            label: "Conversion Rate",
            value: "3.24%",
            change: "-0.5%",
            icon: TrendingUp,
            positive: false,
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <metric.icon className="h-6 w-6 text-white" />
              </div>
              <span
                className={`text-sm font-medium ${
                  metric.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {metric.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-white">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-gray-400 hover:text-white"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <p className="text-sm text-gray-500">Line chart coming soon...</p>
          </div>
        </motion.div>

        {/* Price Distribution */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Price Distribution
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg text-gray-400 hover:text-white"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <p className="text-sm text-gray-500">Bar chart coming soon...</p>
          </div>
        </motion.div>
      </div>

      {/* Product Performance */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          Top Performing Products
        </h3>
        <div className="space-y-4">
          {[
            {
              name: "Premium Plan",
              revenue: "$847K",
              growth: "+23%",
              bar: 95,
            },
            {
              name: "Enterprise Plan",
              revenue: "$624K",
              growth: "+18%",
              bar: 75,
            },
            {
              name: "Standard Plan",
              revenue: "$423K",
              growth: "+12%",
              bar: 55,
            },
            {
              name: "Basic Plan",
              revenue: "$178K",
              growth: "+8%",
              bar: 25,
            },
          ].map((product) => (
            <div key={product.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">{product.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">
                    {product.revenue}
                  </span>
                  <span className="text-sm font-medium text-emerald-400">
                    {product.growth}
                  </span>
                </div>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/30"
                  style={{ width: `${product.bar}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Market Insights */}
      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">
            Market Position
          </h3>
          <div className="flex h-48 items-center justify-center rounded-xl border border-white/10 bg-white/5">
            <p className="text-sm text-gray-500">Pie chart coming soon...</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">
            Customer Segments
          </h3>
          <div className="space-y-3">
            {[
              { name: "Enterprise", value: "42%", color: "bg-blue-400" },
              { name: "Mid-Market", value: "35%", color: "bg-purple-400" },
              { name: "SMB", value: "23%", color: "bg-emerald-400" },
            ].map((segment) => (
              <div key={segment.name} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${segment.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">{segment.name}</span>
                    <span className="text-sm font-medium text-white">
                      {segment.value}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">
            Quick Insights
          </h3>
          <div className="space-y-3">
            {[
              { label: "Best Performing Hour", value: "2-3 PM" },
              { label: "Peak Season", value: "Q4" },
              { label: "Avg. Deal Size", value: "$12.4K" },
              { label: "Churn Rate", value: "2.3%" },
            ].map((insight) => (
              <div
                key={insight.label}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
              >
                <span className="text-sm text-gray-400">{insight.label}</span>
                <span className="font-medium text-white">{insight.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

