"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  GitBranch,
  Play,
  Save,
  Plus,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const savedSimulations = [
  {
    id: "1",
    name: "Q1 2025 Price Increase",
    date: "2024-12-15",
    status: "completed",
    results: {
      revenueChange: "+12.5%",
      unitChange: "-3.2%",
      profitChange: "+18.3%",
    },
  },
  {
    id: "2",
    name: "Holiday Discount Strategy",
    date: "2024-12-10",
    status: "completed",
    results: {
      revenueChange: "+8.7%",
      unitChange: "+15.4%",
      profitChange: "+4.2%",
    },
  },
  {
    id: "3",
    name: "Enterprise Tier Test",
    date: "2024-12-05",
    status: "draft",
    results: null,
  },
];

export default function SimulationsPage() {
  const [showNewSimulation, setShowNewSimulation] = useState(false);
  const [simulationData, setSimulationData] = useState({
    name: "",
    product: "",
    priceChange: "",
    duration: "30",
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">Price Simulations</h1>
          <p className="text-gray-400">
            Test pricing strategies before implementation
          </p>
        </div>
        <Button
          onClick={() => setShowNewSimulation(!showNewSimulation)}
          className="gap-2 rounded-xl bg-white text-black hover:bg-white/90"
        >
          <Plus className="h-4 w-4" />
          New Simulation
        </Button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            label: "Total Simulations",
            value: "24",
            icon: GitBranch,
          },
          {
            label: "Avg. Revenue Impact",
            value: "+11.2%",
            icon: TrendingUp,
          },
          {
            label: "Best Performing",
            value: "+18.3%",
            icon: DollarSign,
          },
          {
            label: "This Month",
            value: "8",
            icon: Calendar,
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* New Simulation Form */}
      {showNewSimulation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-6 text-lg font-semibold text-white">
            Create New Simulation
          </h3>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sim-name" className="text-sm text-gray-300">
                  Simulation Name
                </Label>
                <Input
                  id="sim-name"
                  placeholder="e.g., Q1 2025 Strategy"
                  value={simulationData.name}
                  onChange={(e) =>
                    setSimulationData({ ...simulationData, name: e.target.value })
                  }
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product" className="text-sm text-gray-300">
                  Product
                </Label>
                <Select
                  value={simulationData.product}
                  onValueChange={(value) =>
                    setSimulationData({ ...simulationData, product: value })
                  }
                >
                  <SelectTrigger className="rounded-xl border-white/10 bg-white/5 text-white">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-white/10 bg-[#010203]/95 backdrop-blur-xl">
                    <SelectItem value="premium">Premium Plan</SelectItem>
                    <SelectItem value="standard">Standard Plan</SelectItem>
                    <SelectItem value="basic">Basic Plan</SelectItem>
                    <SelectItem value="enterprise">Enterprise Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price-change" className="text-sm text-gray-300">
                  Price Change (%)
                </Label>
                <Input
                  id="price-change"
                  type="number"
                  placeholder="e.g., +10 or -5"
                  value={simulationData.priceChange}
                  onChange={(e) =>
                    setSimulationData({
                      ...simulationData,
                      priceChange: e.target.value,
                    })
                  }
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-sm text-gray-300">
                  Simulation Duration (days)
                </Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={simulationData.duration}
                  onChange={(e) =>
                    setSimulationData({
                      ...simulationData,
                      duration: e.target.value,
                    })
                  }
                  className="rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 gap-2 rounded-xl bg-white text-black hover:bg-white/90">
                <Play className="h-4 w-4" />
                Run Simulation
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Save className="h-4 w-4" />
                Save as Draft
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Saved Simulations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Recent Simulations
        </h3>
        <div className="space-y-4">
          {savedSimulations.map((sim, index) => (
            <motion.div
              key={sim.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h4 className="text-lg font-semibold text-white">
                      {sim.name}
                    </h4>
                    <span
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${
                        sim.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {sim.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Created on {new Date(sim.date).toLocaleDateString()}
                  </p>

                  {sim.results && (
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-gray-400">Revenue Impact</div>
                        <div className="mt-1 text-lg font-semibold text-emerald-400">
                          {sim.results.revenueChange}
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-gray-400">Units Sold</div>
                        <div
                          className={`mt-1 text-lg font-semibold ${
                            sim.results.unitChange.startsWith("+")
                              ? "text-emerald-400"
                              : "text-red-400"
                          }`}
                        >
                          {sim.results.unitChange}
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                        <div className="text-xs text-gray-400">Profit Impact</div>
                        <div className="mt-1 text-lg font-semibold text-emerald-400">
                          {sim.results.profitChange}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    View Details
                  </Button>
                  {sim.status === "completed" && (
                    <Button
                      size="sm"
                      className="rounded-xl bg-white text-black hover:bg-white/90"
                    >
                      Implement
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Simulation Insights */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          Historical Performance
        </h3>
        <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-gray-500">
            Simulation comparison chart coming soon...
          </p>
        </div>
      </motion.div>
    </div>
  );
}

