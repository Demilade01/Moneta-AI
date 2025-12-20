"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function AnalyticsPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="analytics" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Built for Enterprise Intelligence
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Real-time dashboards that transform complex pricing data into
            actionable insights.
          </p>
        </motion.div>

        {/* Dashboard Preview */}
        <div ref={ref} className="space-y-6">
          {/* Main Dashboard */}
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">
                Revenue Simulation Dashboard
              </h3>
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-80 rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="flex h-full items-end justify-between gap-4">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map(
                  (height, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={isInView ? { height: `${height}%` } : {}}
                      transition={{ duration: 0.6, delay: 0.8 + i * 0.05 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-white/20 to-white/40"
                    />
                  )
                )}
              </div>
            </div>

            {/* Stats Row */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Projected Revenue", value: "+18.4%" },
                { label: "Price Elasticity", value: "-1.32" },
                { label: "Confidence Score", value: "94%" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Secondary Panels */}
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <h4 className="mb-4 text-lg font-semibold text-white">
                Competitor Analysis
              </h4>
              <div className="space-y-3">
                {[
                  { name: "Competitor A", price: "$49", change: "+2.1%" },
                  { name: "Competitor B", price: "$52", change: "-1.8%" },
                  { name: "Competitor C", price: "$47", change: "+0.5%" },
                ].map((comp) => (
                  <div
                    key={comp.name}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <span className="text-sm text-gray-300">{comp.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-white">
                        {comp.price}
                      </span>
                      <span className="text-xs text-gray-400">
                        {comp.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <h4 className="mb-4 text-lg font-semibold text-white">
                Recent Recommendations
              </h4>
              <div className="space-y-3">
                {[
                  { action: "Increase Premium Tier", impact: "+$42K/mo" },
                  { action: "Adjust Volume Discount", impact: "+$28K/mo" },
                  { action: "Bundle Optimization", impact: "+$19K/mo" },
                ].map((rec) => (
                  <div
                    key={rec.action}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <span className="text-sm text-gray-300">{rec.action}</span>
                    <span className="text-sm font-semibold text-white">
                      {rec.impact}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

