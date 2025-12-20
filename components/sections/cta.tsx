"use client";

import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export function CTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ y: 40, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/5 p-12 text-center backdrop-blur-xl md:p-16"
        >
          {/* Subtle accent glow */}
          <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 bg-white/5 blur-3xl" />

          <div className="relative">
            <h2 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Ready to transform your pricing strategy?
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-400">
              Join enterprise teams making smarter, faster pricing decisions with
              Moneta AI.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="group rounded-full border border-white/20 bg-white/10 px-10 text-base font-medium text-white backdrop-blur-xl transition-all hover:border-white/30 hover:bg-white/15"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full border border-white/10 px-10 text-base font-medium text-white transition-all hover:border-white/20 hover:bg-white/5"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

