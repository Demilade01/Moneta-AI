"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#010203]">
      {/* Large Animated Radial Gradient Overlays */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 50% -20%, rgba(255,255,255,0.08), transparent)",
        }}
        animate={{
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 60% at 80% 50%, rgba(255,255,255,0.05), transparent)",
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 70% 70% at 20% 80%, rgba(255,255,255,0.06), transparent)",
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      />

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute -top-20 left-1/4 h-[600px] w-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, 120, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.3, 1.1, 1],
          opacity: [0.2, 0.35, 0.25, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-1/3 -right-40 h-[700px] w-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
          filter: "blur(70px)",
        }}
        animate={{
          x: [0, -120, 60, 0],
          y: [0, 100, -40, 0],
          scale: [1, 1.2, 1.15, 1],
          opacity: [0.15, 0.3, 0.2, 0.15],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, -100, 80, 0],
          y: [0, -80, 30, 0],
          scale: [1, 1.2, 1.1, 1],
          opacity: [0.12, 0.25, 0.18, 0.12],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Animated Center Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[1200px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[80px_80px]"
        style={{
          maskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 50%, black 0%, transparent 80%)",
        }}
      />

      {/* Subtle Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(1,2,3,0.8)_100%)]" />
    </div>
  );
}

