"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu on click
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
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-7xl"
      >
        <div className="rounded-full border border-white/10 bg-[#010203]/80 backdrop-blur-xl px-4 md:px-6 lg:px-8">
          <div className="flex h-14 md:h-16 items-center justify-between">
            {/* Logo */}
            <div className="shrink-0">
              <span className="text-lg md:text-xl font-semibold tracking-tight text-white">
                Moneta AI
              </span>
            </div>

            {/* Navigation Links - Desktop Centered */}
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

            {/* Right Side - Desktop & Mobile */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Desktop Buttons */}
              <Button
                variant="ghost"
                asChild
                className="hidden sm:inline-flex rounded-full border border-white/20 px-4 md:px-6 text-sm font-medium text-white transition-all hover:bg-white/5"
              >
                <a href="/auth/login">Login</a>
              </Button>
              <Button
                asChild
                className="hidden sm:inline-flex rounded-full bg-white px-4 md:px-6 text-sm font-medium text-black transition-all hover:bg-white/90"
              >
                <a href="/auth/signup">Sign Up</a>
              </Button>

              {/* Mobile Hamburger */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="flex sm:hidden rounded-full border border-white/20 text-white hover:bg-white/5"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-20 left-4 right-4 z-40 mx-auto max-w-7xl sm:hidden"
          >
            <div className="rounded-2xl border border-white/10 bg-[#010203]/95 backdrop-blur-xl p-6 shadow-2xl">
              {/* Mobile Navigation Links */}
              <div className="space-y-4 mb-6">
                <a
                  href="#features"
                  onClick={(e) => handleSmoothScroll(e, "#features")}
                  className="block text-base font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={(e) => handleSmoothScroll(e, "#how-it-works")}
                  className="block text-base font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Sectors
                </a>
                <a
                  href="#analytics"
                  onClick={(e) => handleSmoothScroll(e, "#analytics")}
                  className="block text-base font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Analytics
                </a>
                <a
                  href="#contact"
                  onClick={(e) => handleSmoothScroll(e, "#contact")}
                  className="block text-base font-medium text-gray-300 transition-colors hover:text-white"
                >
                  Contact
                </a>
              </div>

              {/* Mobile Buttons */}
              <div className="space-y-3 pt-6 border-t border-white/10">
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-center rounded-xl border border-white/20 text-white hover:bg-white/5"
                >
                  <a href="/auth/login">Login</a>
                </Button>
                <Button
                  asChild
                  className="w-full justify-center rounded-xl bg-white text-black hover:bg-white/90"
                >
                  <a href="/auth/signup">Sign Up</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

