"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  GitBranch,
  Play,
  Save,
  Plus,
  TrendingUp,
  DollarSign,
  Calendar,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/client/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

export default function SimulationsPage() {
  const [showNewSimulation, setShowNewSimulation] = useState(false);
  const [simulationData, setSimulationData] = useState({
    name: "",
    productId: "",
    proposedPrice: "",
    duration: "30",
  });

  // Fetch data
  const { data: simulationsData, refetch } = trpc.simulations.getAll.useQuery({
    limit: 20,
    offset: 0,
  });
  const { data: productsData } = trpc.products.list.useQuery({});

  // Mutations
  const createSimulation = trpc.simulations.create.useMutation({
    onSuccess: () => {
      toast.success("Simulation created successfully!");
      setShowNewSimulation(false);
      setSimulationData({
        name: "",
        productId: "",
        proposedPrice: "",
        duration: "30",
      });
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create simulation");
    },
  });

  const runSimulation = trpc.simulations.run.useMutation({
    onSuccess: () => {
      toast.success("Simulation completed!");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to run simulation");
    },
  });

  const deleteSimulation = trpc.simulations.delete.useMutation({
    onSuccess: () => {
      toast.success("Simulation deleted");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete simulation");
    },
  });

  const simulations = simulationsData?.simulations || [];
  const products = productsData?.products || [];

  // Calculate stats
  const totalSimulations = simulationsData?.total || 0;
  const completedSimulations = simulations.filter((s) => s.status === "COMPLETED");
  const avgRevenueImpact =
    completedSimulations.length > 0
      ? completedSimulations.reduce((sum, s) => {
          const result = s.results?.[0];
          if (!result) return sum;
          const percent = (Number(result.revenueDelta) / (Number(result.projectedRevenue) - Number(result.revenueDelta))) * 100;
          return sum + percent;
        }, 0) / completedSimulations.length
      : 0;
  const bestPerforming =
    completedSimulations.length > 0
      ? Math.max(
          ...completedSimulations.map((s) => {
            const result = s.results?.[0];
            if (!result) return 0;
            return (Number(result.revenueDelta) / (Number(result.projectedRevenue) - Number(result.revenueDelta))) * 100;
          })
        )
      : 0;
  const thisMonth = simulations.filter((s) => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    return new Date(s.createdAt) > monthAgo;
  }).length;

  const handleCreateSimulation = () => {
    if (!simulationData.name || !simulationData.productId || !simulationData.proposedPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const proposedPrice = parseFloat(simulationData.proposedPrice);
    if (isNaN(proposedPrice) || proposedPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    createSimulation.mutate({
      name: simulationData.name,
      duration: parseInt(simulationData.duration),
      items: [
        {
          productId: simulationData.productId,
          proposedPrice,
        },
      ],
    });
  };

  const handleSaveDraft = () => {
    if (!simulationData.name || !simulationData.productId || !simulationData.proposedPrice) {
      toast.error("Please fill in all required fields");
      return;
    }

    const proposedPrice = parseFloat(simulationData.proposedPrice);
    if (isNaN(proposedPrice) || proposedPrice <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    createSimulation.mutate({
      name: simulationData.name,
      duration: parseInt(simulationData.duration),
      items: [
        {
          productId: simulationData.productId,
          proposedPrice,
        },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Simulations",
            value: totalSimulations.toString(),
            icon: GitBranch,
          },
          {
            label: "Avg. Revenue Impact",
            value: avgRevenueImpact > 0 ? `+${avgRevenueImpact.toFixed(1)}%` : "N/A",
            icon: TrendingUp,
          },
          {
            label: "Best Performing",
            value: bestPerforming > 0 ? `+${bestPerforming.toFixed(1)}%` : "N/A",
            icon: DollarSign,
          },
          {
            label: "This Month",
            value: thisMonth.toString(),
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
      <AnimatePresence>
        {showNewSimulation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
          >
            <div className="p-6">
              <h3 className="mb-6 text-lg font-semibold text-white">
                Create New Simulation
              </h3>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sim-name" className="text-sm text-gray-300">
                      Simulation Name <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="sim-name"
                      placeholder="e.g., Q1 2025 Strategy"
                      value={simulationData.name}
                      onChange={(e) =>
                        setSimulationData({ ...simulationData, name: e.target.value })
                      }
                      className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product" className="text-sm text-gray-300">
                      Product <span className="text-red-400">*</span>
                    </Label>
                    <select
                      id="product"
                      value={simulationData.productId}
                      onChange={(e) =>
                        setSimulationData({ ...simulationData, productId: e.target.value })
                      }
                      className="h-10 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white backdrop-blur-xl transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 0.5rem center",
                        backgroundSize: "1.5em 1.5em",
                        paddingRight: "2.5rem",
                      }}
                    >
                      <option value="" className="bg-[#010203] text-gray-400">
                        Select a product...
                      </option>
                      {products.map((product) => (
                        <option
                          key={product.id}
                          value={product.id}
                          className="bg-[#010203] text-white"
                        >
                          {product.name} - ${Number(product.currentPrice).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="proposed-price" className="text-sm text-gray-300">
                      Proposed Price ($) <span className="text-red-400">*</span>
                    </Label>
                    <Input
                      id="proposed-price"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 49.99"
                      value={simulationData.proposedPrice}
                      onChange={(e) =>
                        setSimulationData({
                          ...simulationData,
                          proposedPrice: e.target.value,
                        })
                      }
                      className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                    {simulationData.productId && simulationData.proposedPrice && (
                      <div className="text-xs text-gray-400">
                        {(() => {
                          const product = products.find((p) => p.id === simulationData.productId);
                          if (!product) return null;
                          const currentPrice = Number(product.currentPrice);
                          const proposedPrice = parseFloat(simulationData.proposedPrice);
                          const change = ((proposedPrice - currentPrice) / currentPrice) * 100;
                          return (
                            <span className={change >= 0 ? "text-emerald-400" : "text-red-400"}>
                              {change >= 0 ? "+" : ""}
                              {change.toFixed(1)}% from current price
                            </span>
                          );
                        })()}
                      </div>
                    )}
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
                      className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateSimulation}
                    disabled={createSimulation.isPending}
                    className="flex-1 gap-2 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50"
                  >
                    {createSimulation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    {createSimulation.isPending ? "Creating..." : "Create & Run"}
                  </Button>
                  <Button
                    onClick={handleSaveDraft}
                    disabled={createSimulation.isPending}
                    variant="outline"
                    className="gap-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved Simulations */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Recent Simulations
        </h3>
        {simulations.length === 0 ? (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl"
          >
            <GitBranch className="mx-auto mb-4 h-12 w-12 text-gray-500" />
            <h3 className="mb-2 text-lg font-semibold text-white">
              No simulations yet
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Create your first simulation to test pricing strategies
            </p>
            <Button
              onClick={() => setShowNewSimulation(true)}
              className="gap-2 rounded-xl bg-white text-black hover:bg-white/90"
            >
              <Plus className="h-4 w-4" />
              Create Simulation
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {simulations.map((sim, index) => {
              const result = sim.results?.[0];
              const item = sim.items?.[0];
              const product = item?.product;

              // Calculate percentage changes
              const revenuePercent = result
                ? (Number(result.revenueDelta) /
                    (Number(result.projectedRevenue) - Number(result.revenueDelta))) *
                  100
                : 0;
              const unitsPercent = result
                ? (result.unitsDelta /
                    (result.projectedUnits - result.unitsDelta)) *
                  100
                : 0;
              const marginPercent = result
                ? (Number(result.marginDelta) /
                    (Number(result.projectedMargin) - Number(result.marginDelta))) *
                  100
                : 0;

              const statusColors = {
                DRAFT: "bg-gray-500/20 text-gray-400",
                RUNNING: "bg-blue-500/20 text-blue-400",
                COMPLETED: "bg-emerald-500/20 text-emerald-400",
                FAILED: "bg-red-500/20 text-red-400",
              };

              return (
                <motion.div
                  key={sim.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-3">
                        <h4 className="text-lg font-semibold text-white">
                          {sim.name}
                        </h4>
                        <span
                          className={`rounded-lg px-2 py-1 text-xs font-medium ${
                            statusColors[sim.status]
                          }`}
                        >
                          {sim.status}
                        </span>
                        {sim.status === "RUNNING" && (
                          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        )}
                      </div>
                      <div className="mb-4 space-y-1 text-sm text-gray-400">
                        <p>Created {format(new Date(sim.createdAt), "MMM d, yyyy")}</p>
                        {product && item && (
                          <p>
                            {product.name}: ${Number(item.currentPrice).toFixed(2)} → $
                            {Number(item.proposedPrice).toFixed(2)} (
                            {Number(item.changePercent) >= 0 ? "+" : ""}
                            {Number(item.changePercent).toFixed(1)}%)
                          </p>
                        )}
                        {sim.description && <p>{sim.description}</p>}
                      </div>

                      {result && (
                        <div className="mt-4 grid gap-3 sm:grid-cols-3">
                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <div className="text-xs text-gray-400">Revenue Impact</div>
                              {revenuePercent >= 0 ? (
                                <ArrowUp className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-red-400" />
                              )}
                            </div>
                            <div
                              className={`text-lg font-semibold ${
                                revenuePercent >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {revenuePercent >= 0 ? "+" : ""}
                              {revenuePercent.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              ${Number(result.projectedRevenue).toLocaleString()}
                            </div>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <div className="text-xs text-gray-400">Units Sold</div>
                              {unitsPercent >= 0 ? (
                                <ArrowUp className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-red-400" />
                              )}
                            </div>
                            <div
                              className={`text-lg font-semibold ${
                                unitsPercent >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {unitsPercent >= 0 ? "+" : ""}
                              {unitsPercent.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {result.projectedUnits.toLocaleString()} units
                            </div>
                          </div>
                          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                            <div className="mb-1 flex items-center gap-2">
                              <div className="text-xs text-gray-400">Margin Impact</div>
                              {marginPercent >= 0 ? (
                                <ArrowUp className="h-3 w-3 text-emerald-400" />
                              ) : (
                                <ArrowDown className="h-3 w-3 text-red-400" />
                              )}
                            </div>
                            <div
                              className={`text-lg font-semibold ${
                                marginPercent >= 0 ? "text-emerald-400" : "text-red-400"
                              }`}
                            >
                              {marginPercent >= 0 ? "+" : ""}
                              {marginPercent.toFixed(1)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              ${Number(result.projectedMargin).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )}

                      {result && (
                        <div className="mt-4 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Risk Level:</span>
                            <span
                              className={`font-medium ${
                                result.riskLevel === "LOW"
                                  ? "text-emerald-400"
                                  : result.riskLevel === "MEDIUM"
                                    ? "text-yellow-400"
                                    : "text-red-400"
                              }`}
                            >
                              {result.riskLevel}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-400">Confidence:</span>
                            <span className="font-medium text-white">
                              {Number(result.confidence).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-row gap-2 lg:flex-col">
                      {sim.status === "DRAFT" && (
                        <Button
                          onClick={() => runSimulation.mutate({ id: sim.id })}
                          disabled={runSimulation.isPending}
                          size="sm"
                          className="flex-1 gap-2 rounded-xl bg-white text-black hover:bg-white/90 disabled:opacity-50 lg:flex-none"
                        >
                          {runSimulation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                          Run
                        </Button>
                      )}
                      <Button
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this simulation?")) {
                            deleteSimulation.mutate({ id: sim.id });
                          }
                        }}
                        disabled={deleteSimulation.isPending}
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-2 rounded-xl border-white/10 bg-white/5 text-red-400 hover:bg-red-500/10 disabled:opacity-50 lg:flex-none"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Simulation Insights */}
      {completedSimulations.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">
            Simulation Insights
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Best Performing Simulation */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <h4 className="font-semibold text-white">Best Performer</h4>
              </div>
              {(() => {
                const best = completedSimulations.reduce((max, sim) => {
                  const result = sim.results?.[0];
                  if (!result) return max;
                  const percent =
                    (Number(result.revenueDelta) /
                      (Number(result.projectedRevenue) - Number(result.revenueDelta))) *
                    100;
                  const maxResult = max?.results?.[0];
                  const maxPercent = maxResult
                    ? (Number(maxResult.revenueDelta) /
                        (Number(maxResult.projectedRevenue) - Number(maxResult.revenueDelta))) *
                      100
                    : 0;
                  return percent > maxPercent ? sim : max;
                }, completedSimulations[0]);

                const result = best?.results?.[0];
                const percent = result
                  ? (Number(result.revenueDelta) /
                      (Number(result.projectedRevenue) - Number(result.revenueDelta))) *
                    100
                  : 0;

                return (
                  <>
                    <p className="mb-2 text-sm text-gray-400">{best?.name}</p>
                    <div className="text-2xl font-bold text-emerald-400">
                      +{percent.toFixed(1)}% Revenue
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Average Performance */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-400" />
                <h4 className="font-semibold text-white">Average Impact</h4>
              </div>
              <p className="mb-2 text-sm text-gray-400">
                Across {completedSimulations.length} simulations
              </p>
              <div className="text-2xl font-bold text-blue-400">
                +{avgRevenueImpact.toFixed(1)}% Revenue
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Getting Started Guide */}
      {simulations.length === 0 && !showNewSimulation && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <h3 className="mb-4 text-lg font-semibold text-white">
            How Simulations Work
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <span className="text-lg font-bold text-white">1</span>
              </div>
              <h4 className="font-semibold text-white">Select Product</h4>
              <p className="text-sm text-gray-400">
                Choose a product and propose a new price point to test
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <span className="text-lg font-bold text-white">2</span>
              </div>
              <h4 className="font-semibold text-white">AI Analysis</h4>
              <p className="text-sm text-gray-400">
                Our AI analyzes historical data and predicts the impact
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <span className="text-lg font-bold text-white">3</span>
              </div>
              <h4 className="font-semibold text-white">Review Results</h4>
              <p className="text-sm text-gray-400">
                See projected revenue, units sold, and margin changes
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

