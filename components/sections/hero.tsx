"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 md:pt-32 pb-16 md:pb-24">
      {/* Enhanced background gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[800px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent_70%)] opacity-40" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Glow behind glass panel */}
          <div className="absolute top-32 left-1/2 -translate-x-1/2 h-[500px] w-[900px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)] blur-3xl" />

          {/* Glass panel behind content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full max-w-5xl rounded-2xl md:rounded-3xl border border-white/10 bg-white/5 p-6 md:p-12 lg:p-16 backdrop-blur-xl shadow-2xl shadow-white/5"
          >
            {/* Badge */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 md:mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm text-gray-300"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Powered Pricing Intelligence</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4 md:mb-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-white"
            >
              Your Intelligent
              <br />
              Pricing Analyst
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8 md:mb-10 mx-auto max-w-2xl text-base md:text-lg lg:text-xl text-gray-400"
            >
              Make confident, data-driven pricing decisions with AI-powered analysis,
              simulations, and explainable recommendations. No black boxes.
              Just clarity.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
            >
              <Button
                size="lg"
                className="group rounded-full border border-white/20 bg-white/10 px-8 text-base font-medium text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/15"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full border border-white/10 px-8 text-base font-medium text-white transition-all hover:border-white/20 hover:bg-white/5"
              >
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats or trust indicators */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 md:mt-16 grid grid-cols-3 gap-4 md:gap-8 lg:gap-16"
          >
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">98%</div>
              <div className="text-xs md:text-sm text-gray-400">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">2.3x</div>
              <div className="text-xs md:text-sm text-gray-400">ROI Increase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">24/7</div>
              <div className="text-xs md:text-sm text-gray-400">Analysis</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

