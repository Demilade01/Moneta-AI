"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  X,
  ChevronDown,
  BarChart3,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const recommendations = [
  {
    id: "1",
    title: "Increase Premium Plan Pricing",
    description:
      "Based on market analysis and competitor pricing, we recommend increasing the Premium Plan price from $149.99 to $159.99",
    impact: {
      revenue: "+$42,000/month",
      confidence: 94,
      risk: "Low",
    },
    reasoning: [
      "Competitor A prices at $159.99 with similar features",
      "Customer surveys indicate willingness to pay up to $165",
      "Premium segment shows low price elasticity (-0.64)",
      "Current pricing undervalues the product compared to market",
    ],
    data: {
      currentPrice: 149.99,
      recommendedPrice: 159.99,
      expectedUnits: 5200,
      currentUnits: 5647,
    },
    status: "pending",
    priority: "high",
  },
  {
    id: "2",
    title: "Optimize Volume Discount Structure",
    description:
      "Adjust volume discounts for enterprise customers to improve margins while maintaining competitiveness",
    impact: {
      revenue: "+$28,000/month",
      confidence: 87,
      risk: "Medium",
    },
    reasoning: [
      "Current discount structure leaves margin on the table",
      "Analysis shows customers are less sensitive to 5-10% changes",
      "Competitor volume pricing is less aggressive",
      "Streamlined tiers will simplify sales process",
    ],
    data: {
      currentDiscount: "15%",
      recommendedDiscount: "10%",
      affectedCustomers: 142,
    },
    status: "pending",
    priority: "medium",
  },
  {
    id: "3",
    title: "Bundle Basic + Analytics Add-on",
    description:
      "Create a new bundled offering combining Basic Plan with Analytics features at an optimized price point",
    impact: {
      revenue: "+$19,000/month",
      confidence: 79,
      risk: "Medium",
    },
    reasoning: [
      "45% of Basic users purchase Analytics add-on separately",
      "Bundle pricing at $39.99 shows strong conversion potential",
      "Reduces decision friction for new customers",
      "Competitive advantage in SMB segment",
    ],
    data: {
      basicPrice: 29.99,
      analyticsPrice: 14.99,
      bundlePrice: 39.99,
      savings: "11%",
    },
    status: "pending",
    priority: "high",
  },
];

export default function RecommendationsPage() {
  const [selectedRec, setSelectedRec] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">
          AI-Powered Recommendations
        </h1>
        <p className="text-gray-400">
          Data-driven pricing insights with transparent reasoning
        </p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        {[
          {
            label: "Active Recommendations",
            value: "12",
            icon: Lightbulb,
            color: "text-yellow-400",
          },
          {
            label: "Projected Monthly Impact",
            value: "+$89K",
            icon: TrendingUp,
            color: "text-emerald-400",
          },
          {
            label: "Implemented This Month",
            value: "8",
            icon: CheckCircle2,
            color: "text-blue-400",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${
                        rec.priority === "high"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {rec.priority.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-xs text-gray-500">
                      Recommendation #{rec.id}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {rec.title}
                  </h3>
                  <p className="text-gray-400">{rec.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setSelectedRec(selectedRec === rec.id ? null : rec.id)
                  }
                  className="rounded-xl text-gray-400 hover:text-white"
                >
                  <ChevronDown
                    className={`h-5 w-5 transition-transform ${
                      selectedRec === rec.id ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </div>

              {/* Impact Metrics */}
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-gray-400">Revenue Impact</div>
                  <div className="mt-1 text-2xl font-bold text-emerald-400">
                    {rec.impact.revenue}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-gray-400">Confidence Score</div>
                  <div className="mt-1 flex items-baseline gap-2">
                    <div className="text-2xl font-bold text-white">
                      {rec.impact.confidence}%
                    </div>
                    <div className="h-2 flex-1 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${rec.impact.confidence}%` }}
                      />
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm text-gray-400">Risk Level</div>
                  <div
                    className={`mt-1 flex items-center gap-2 text-2xl font-bold ${
                      rec.impact.risk === "Low"
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    }`}
                  >
                    <AlertCircle className="h-5 w-5" />
                    {rec.impact.risk}
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedRec === rec.id && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/10 bg-white/5 p-6"
              >
                {/* Reasoning */}
                <div className="mb-6">
                  <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                    <BarChart3 className="h-4 w-4" />
                    Why This Recommendation?
                  </h4>
                  <ul className="space-y-2">
                    {rec.reasoning.map((reason, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 text-sm text-gray-300"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Data Comparison */}
                <div className="mb-6 rounded-xl border border-white/10 bg-black/20 p-4">
                  <h4 className="mb-3 text-sm font-semibold text-white">
                    Impact Analysis
                  </h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-xs text-gray-500">Current</div>
                      <div className="mt-1 text-lg font-semibold text-white">
                        ${rec.data.currentPrice}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Recommended</div>
                      <div className="mt-1 text-lg font-semibold text-emerald-400">
                        ${rec.data.recommendedPrice}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 gap-2 rounded-xl bg-white text-black hover:bg-white/90">
                    <CheckCircle2 className="h-4 w-4" />
                    Accept & Implement
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Schedule Review
                  </Button>
                  <Button
                    variant="ghost"
                    className="gap-2 rounded-xl text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                    Dismiss
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

