"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.querySelector(targetId);
    if (element) {
      const offset = 100; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl"
    >
      <div className="rounded-full border border-white/10 bg-[#010203]/80 backdrop-blur-xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <span className="text-xl font-semibold tracking-tight text-white">
              Moneta AI
            </span>
          </div>

          {/* Navigation Links - Centered */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex md:items-center md:gap-8">
            <a
              href="#features"
              onClick={(e) => handleSmoothScroll(e, "#features")}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Sectors
            </a>
            <a
              href="#analytics"
              onClick={(e) => handleSmoothScroll(e, "#analytics")}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Analytics
            </a>
            <a
              href="#contact"
              onClick={(e) => handleSmoothScroll(e, "#contact")}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Contact
            </a>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="rounded-full border border-white/20 px-6 text-sm font-medium text-white transition-all hover:bg-white/5"
            >
              Login
            </Button>
            <Button
              className="rounded-full bg-white px-6 text-sm font-medium text-black transition-all hover:bg-white/90"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}

