"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  X,
  Sparkles,
  Clock,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/client/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

export default function RecommendationsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("PENDING");
  const [selectedProduct, setSelectedProduct] = useState<string>("");

  // Fetch recommendations
  const { data: recommendationsData, refetch } = trpc.recommendations.getAll.useQuery({
    status: statusFilter as any,
    limit: 50,
    offset: 0,
  });

  // Fetch products for generation
  const { data: productsData } = trpc.products.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Fetch summary
  const { data: summary } = trpc.recommendations.getSummary.useQuery();

  // Mutations
  const generateRecommendation = trpc.recommendations.generate.useMutation({
    onSuccess: () => {
      toast.success("AI recommendation generated successfully!");
      refetch();
      setSelectedProduct("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate recommendation");
    },
  });

  const updateStatus = trpc.recommendations.updateStatus.useMutation({
    onSuccess: (data) => {
      if (data.status === "IMPLEMENTED") {
        toast.success("Recommendation implemented! Product price updated.");
      } else if (data.status === "ACCEPTED") {
        toast.success("Recommendation accepted!");
      } else if (data.status === "REJECTED") {
        toast.success("Recommendation rejected.");
      }
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update recommendation");
    },
  });

  const handleGenerate = () => {
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    generateRecommendation.mutate({ productId: selectedProduct });
  };

  const getRiskColor = (confidence: number) => {
    if (confidence >= 80) return "text-emerald-400 bg-emerald-500/20";
    if (confidence >= 60) return "text-yellow-400 bg-yellow-500/20";
    return "text-red-400 bg-red-500/20";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
      case "HIGH":
        return "text-red-400 bg-red-500/20";
      case "MEDIUM":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">AI Recommendations</h1>
        <p className="text-gray-400">
          Intelligent pricing suggestions powered by AI
        </p>
      </motion.div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid gap-6 md:grid-cols-4">
          {[
            {
              label: "Total Recommendations",
              value: summary.total.toString(),
              icon: Lightbulb,
            },
            {
              label: "Pending Review",
              value: summary.pending.toString(),
              icon: Clock,
            },
            {
              label: "Implemented",
              value: summary.implemented.toString(),
              icon: CheckCircle2,
            },
            {
              label: "Projected Impact",
              value: `$${(Number(summary.projectedImpact) / 1000).toFixed(1)}K`,
              icon: Target,
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                  <div className="mt-1 text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Generate New Recommendation */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">
            Generate AI Recommendation
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-sm text-white placeholder:text-gray-400 outline-none transition-all focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-white/10 hover:border-white/20 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-[#010203] [&>option]:text-white [&>option:disabled]:text-gray-500"
            style={{
              colorScheme: 'dark',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'white\' stroke-opacity=\'0.5\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              paddingRight: '2.5rem',
              appearance: 'none'
            }}
          >
            <option value="" disabled>Select a product...</option>
            {productsData?.products.map((product) => (
              <option
                key={product.id}
                value={product.id}
                disabled={product._count.salesData < 3}
              >
                {product.name} ({product.sku})
                {product._count.salesData < 3 && ` - Need ${3 - product._count.salesData} more sales records`}
              </option>
            ))}
          </select>
          <Button
            onClick={handleGenerate}
            disabled={generateRecommendation.isPending || !selectedProduct}
            className="gap-2 rounded-xl bg-purple-500 text-white hover:bg-purple-600"
          >
            {generateRecommendation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          AI will analyze sales data, competitor prices, and market trends to generate a recommendation
        </p>
      </motion.div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-[200px] rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl px-4 py-3 text-sm text-white outline-none transition-all focus:border-white/20 focus:bg-white/10 focus:ring-2 focus:ring-white/10 hover:border-white/20 hover:bg-white/10 [&>option]:bg-[#010203] [&>option]:text-white"
            style={{
              colorScheme: 'dark',
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'12\' height=\'8\' viewBox=\'0 0 12 8\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M1 1.5L6 6.5L11 1.5\' stroke=\'white\' stroke-opacity=\'0.5\' stroke-width=\'1.5\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              paddingRight: '2.5rem',
              appearance: 'none'
            }}
          >
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IMPLEMENTED">Implemented</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Recommendations List */}
      {recommendationsData && recommendationsData.recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendationsData.recommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">
                      {rec.product.name}
                    </h3>
                    <span
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${getPriorityColor(
                        rec.priority
                      )}`}
                    >
                      {rec.priority}
                    </span>
                    <span
                      className={`rounded-lg px-2 py-1 text-xs font-medium ${getRiskColor(
                        Number(rec.confidenceScore)
                      )}`}
                    >
                      {Number(rec.confidenceScore)}% Confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{rec.product.sku}</p>

                  {/* Price Change */}
                  <div className="flex items-center gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-400">Current Price</div>
                      <div className="text-xl font-bold text-white">
                        ${Number(rec.currentPrice).toFixed(2)}
                      </div>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div>
                      <div className="text-xs text-gray-400">Recommended Price</div>
                      <div className="text-xl font-bold text-emerald-400">
                        ${Number(rec.recommendedPrice).toFixed(2)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-xs text-gray-400">Change</div>
                      <div
                        className={`text-lg font-semibold ${
                          Number(rec.recommendedPrice) > Number(rec.currentPrice)
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {Number(rec.recommendedPrice) > Number(rec.currentPrice) ? "+" : ""}
                        {(
                          ((Number(rec.recommendedPrice) - Number(rec.currentPrice)) /
                            Number(rec.currentPrice)) *
                          100
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <div className="text-xs text-gray-400">Revenue Impact</div>
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {Number(rec.projectedRevenueImpact) > 0 ? "+" : ""}
                        {Number(rec.projectedRevenueImpact).toFixed(1)}%
                      </div>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-blue-400" />
                        <div className="text-xs text-gray-400">Margin Impact</div>
                      </div>
                      <div className="text-lg font-semibold text-white">
                        {Number(rec.projectedMarginImpact) > 0 ? "+" : ""}
                        {Number(rec.projectedMarginImpact).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 mb-4">
                    <div className="text-xs font-medium text-gray-400 mb-2">
                      AI Reasoning
                    </div>
                    <p className="text-sm text-gray-300">{rec.reasoning}</p>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <div>Generated {format(new Date(rec.generatedAt), "MMM d, yyyy")}</div>
                    {rec.expiresAt && (
                      <div>Expires {format(new Date(rec.expiresAt), "MMM d, yyyy")}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {rec.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() =>
                        updateStatus.mutate({ id: rec.id, status: "IMPLEMENTED" })
                      }
                      disabled={updateStatus.isPending}
                      className="gap-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Implement
                    </Button>
                    <Button
                      onClick={() =>
                        updateStatus.mutate({ id: rec.id, status: "REJECTED" })
                      }
                      disabled={updateStatus.isPending}
                      variant="outline"
                      className="gap-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl"
        >
          <Lightbulb className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-semibold text-white">
            No recommendations yet
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            Select a product above and click "Generate" to create your first AI-powered pricing recommendation
          </p>
        </motion.div>
      )}
    </div>
  );
}
