"use client";

import { motion } from "framer-motion";
import { Brain, TrendingUp, Shield, Zap } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description:
      "Advanced machine learning models analyze market dynamics, competitor pricing, and customer behavior in real-time.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Simulation",
    description:
      "Test pricing strategies before implementation with accurate revenue forecasting and scenario modeling.",
  },
  {
    icon: Shield,
    title: "Explainable Decisions",
    description:
      "Every recommendation comes with clear reasoning, confidence scores, and historical comparisons for full transparency.",
  },
  {
    icon: Zap,
    title: "Instant Insights",
    description:
      "Get actionable pricing recommendations in seconds, not weeks. Make faster decisions with confidence.",
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Pricing Intelligence, Simplified
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Enterprise-grade pricing tools that feel effortless. Built for CFOs,
            pricing teams, and data-driven decision makers.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div ref={ref} className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
            >
              {/* Icon Container */}
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

