"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, Eye, FileCheck, TrendingUp } from "lucide-react";

const trustFeatures = [
  {
    icon: Eye,
    title: "Full Auditability",
    description:
      "Every pricing decision is logged, versioned, and traceable. Perfect for compliance and internal reviews.",
  },
  {
    icon: CheckCircle2,
    title: "Confidence Scores",
    description:
      "Know exactly how certain each recommendation is. No guessing, just transparent probability metrics.",
  },
  {
    icon: FileCheck,
    title: "Historical Comparisons",
    description:
      "See how recommendations compare to past strategies and their actual outcomes over time.",
  },
  {
    icon: TrendingUp,
    title: "CFO-Approved Metrics",
    description:
      "Built with enterprise finance teams in mind. Clear ROI, risk assessment, and impact forecasting.",
  },
];

export function Trust() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            No Black Boxes. Just Clarity.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Enterprise-grade transparency designed for teams that need to
            understand—and defend—every pricing decision.
          </p>
        </motion.div>

        {/* Trust Features Grid */}
        <div ref={ref} className="grid gap-6 md:grid-cols-2">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <feature.icon className="h-7 w-7 text-white" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Quote */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl md:p-12"
        >
          <blockquote className="text-xl text-gray-300 md:text-2xl">
            "Moneta AI doesn't just give us numbers. It gives us the confidence
            to defend our pricing strategy to the board."
          </blockquote>
          <div className="mt-6 text-sm text-gray-400">
            — CFO, Enterprise SaaS Company
          </div>
        </motion.div>
      </div>
    </section>
  );
}

