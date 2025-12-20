"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, User, LogOut, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const [notifications] = useState(3);

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex h-20 items-center justify-between border-b border-white/10 bg-[#010203]/80 px-6 backdrop-blur-xl"
    >
      {/* Search Bar */}
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search products, insights, or reports..."
            className="h-10 rounded-xl border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl border border-white/10 bg-white/5 hover:bg-white/10"
        >
          <Bell className="h-5 w-5 text-gray-400" />
          {notifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              {notifications}
            </span>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 hover:bg-white/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-white">Demo User</div>
                <div className="text-xs text-gray-400">demo@monetaai.com</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl border-white/10 bg-[#010203]/95 backdrop-blur-xl"
          >
            <DropdownMenuLabel className="text-white">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer text-gray-300 focus:bg-white/10 focus:text-white"
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem
              className="cursor-pointer text-gray-300 focus:bg-white/10 focus:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}

