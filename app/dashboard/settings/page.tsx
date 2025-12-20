"use client";

import { motion } from "framer-motion";
import { User, Bell, Shield, CreditCard, Users, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400">
          Manage your account settings and preferences
        </p>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar Navigation */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-2"
        >
          {[
            { icon: User, label: "Profile", active: true },
            { icon: Bell, label: "Notifications", active: false },
            { icon: Shield, label: "Security", active: false },
            { icon: CreditCard, label: "Billing", active: false },
            { icon: Users, label: "Team", active: false },
            { icon: Key, label: "API Keys", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-all ${
                item.active
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Profile Section */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Profile Information
            </h2>

            {/* Avatar */}
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                <User className="h-10 w-10 text-white" />
              </div>
              <div>
                <Button
                  size="sm"
                  className="mb-2 rounded-lg bg-white text-black hover:bg-white/90"
                >
                  Change Avatar
                </Button>
                <p className="text-xs text-gray-400">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm text-gray-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    defaultValue="Demo"
                    className="rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm text-gray-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    defaultValue="User"
                    className="rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="demo@monetaai.com"
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm text-gray-300">
                  Company
                </Label>
                <Input
                  id="company"
                  defaultValue="Moneta AI"
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm text-gray-300">
                  Role
                </Label>
                <Input
                  id="role"
                  defaultValue="Pricing Manager"
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>

            <Separator className="my-6 bg-white/10" />

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button className="rounded-xl bg-white text-black hover:bg-white/90">
                Save Changes
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Notification Preferences
            </h2>

            <div className="space-y-4">
              {[
                {
                  label: "Email Notifications",
                  description: "Receive email updates about pricing changes",
                  enabled: true,
                },
                {
                  label: "Price Alerts",
                  description: "Get notified when competitor prices change",
                  enabled: true,
                },
                {
                  label: "Weekly Reports",
                  description: "Receive weekly pricing performance reports",
                  enabled: false,
                },
                {
                  label: "AI Recommendations",
                  description: "Get notified about new AI recommendations",
                  enabled: true,
                },
              ].map((notification) => (
                <div
                  key={notification.label}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="flex-1">
                    <div className="font-medium text-white">
                      {notification.label}
                    </div>
                    <div className="text-sm text-gray-400">
                      {notification.description}
                    </div>
                  </div>
                  <Switch defaultChecked={notification.enabled} />
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-6 text-xl font-semibold text-white">
              Security Settings
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm text-gray-300">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm text-gray-300">
                  New Password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm text-gray-300">
                  Confirm New Password
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>

              <Button className="w-full rounded-xl bg-white text-black hover:bg-white/90">
                Update Password
              </Button>
            </div>

            <Separator className="my-6 bg-white/10" />

            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="font-medium text-white">
                  Two-Factor Authentication
                </div>
                <div className="text-sm text-gray-400">
                  Add an extra layer of security
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Enable
              </Button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-xl">
            <h2 className="mb-4 text-xl font-semibold text-red-400">
              Danger Zone
            </h2>
            <p className="mb-4 text-sm text-gray-400">
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
            <Button
              variant="destructive"
              className="rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30"
            >
              Delete Account
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

