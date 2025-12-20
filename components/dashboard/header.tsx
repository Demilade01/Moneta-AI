"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bell, User, LogOut, Settings, Menu } from "lucide-react";
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
import { useLogout, useAuth } from "@/lib/client/auth";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [notifications] = useState(3);
  const { user } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex h-16 items-center justify-between border-b border-white/10 bg-[#010203]/80 px-4 backdrop-blur-xl md:h-20 md:px-6"
    >
      {/* Left Section - Hamburger + Search */}
      <div className="flex flex-1 items-center gap-2 md:gap-4">
        {/* Hamburger Menu - Mobile */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 lg:hidden"
        >
          <Menu className="h-5 w-5 text-white" />
        </Button>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            type="search"
            placeholder="Search..."
            className="h-9 rounded-xl border-white/10 bg-white/5 pl-10 text-sm text-white placeholder:text-gray-500 focus:border-white/20 focus:bg-white/10 md:h-10"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 md:h-10 md:w-10"
        >
          <Bell className="h-4 w-4 text-gray-400 md:h-5 md:w-5" />
          {notifications > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white md:h-5 md:w-5 md:text-xs">
              {notifications}
            </span>
          )}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 hover:bg-white/10 md:h-10 md:gap-3 md:px-3"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 md:h-8 md:w-8">
                <User className="h-3 w-3 text-white md:h-4 md:w-4" />
              </div>
              <div className="hidden text-left md:block">
                <div className="text-sm font-medium text-white">{user?.name || "User"}</div>
                <div className="text-xs text-gray-400">{user?.email || "Loading..."}</div>
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

