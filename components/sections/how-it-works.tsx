"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BarChart3, GitBranch, Lightbulb, FileText } from "lucide-react";

const steps = [
  {
    icon: BarChart3,
    title: "Analyze",
    description:
      "Moneta ingests historical pricing data, competitor intelligence, and market trends in real-time.",
  },
  {
    icon: GitBranch,
    title: "Simulate",
    description:
      "Run thousands of pricing scenarios to forecast revenue impact and customer response.",
  },
  {
    icon: Lightbulb,
    title: "Recommend",
    description:
      "Get data-backed pricing recommendations optimized for your business objectives.",
  },
  {
    icon: FileText,
    title: "Explain",
    description:
      "Understand the 'why' behind every decision with transparent reasoning and confidence scores.",
  },
];

export function HowItWorks() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
            Pricing Intelligence, Explained
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            A transparent process designed for enterprise trust and CFO-level confidence.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-white/20 via-white/10 to-transparent lg:block" />

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ y: 40, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className={`flex flex-col items-center gap-8 lg:flex-row ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div
                    className={`${
                      index % 2 === 1 ? "lg:ml-auto lg:mr-0" : "lg:mr-auto lg:ml-0"
                    } max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl`}
                  >
                    <h3 className="mb-3 text-2xl font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>

                {/* Icon Node */}
                <div className="relative z-10 flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl">
                  <step.icon className="h-8 w-8 text-white" />
                </div>

                {/* Spacer for alignment */}
                <div className="hidden flex-1 lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

