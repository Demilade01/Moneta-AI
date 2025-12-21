"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Filter,
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  DollarSign,
  ShoppingCart,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/client/trpc";
import { format } from "date-fns";
import { CompetitorComparisonChart } from "@/components/charts/competitor-comparison-chart";

export default function PricingAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch products
  const { data: productsData, isLoading } = trpc.products.list.useQuery({
    limit: 100,
    offset: 0,
  });

  // Fetch analytics
  const { data: analyticsData } = trpc.analytics.getDashboardStats.useQuery();

  // Fetch competitor comparison
  const { data: competitorData } = trpc.analytics.getCompetitorComparison.useQuery();

  // Filter products
  const filteredProducts = productsData?.products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(
    new Set(productsData?.products.map((p) => p.category).filter(Boolean))
  );

  // Calculate summary stats
  const totalProducts = productsData?.total || 0;
  const avgPrice = productsData?.products
    ? productsData.products.reduce(
        (sum, p) => sum + Number(p.currentPrice),
        0
      ) / (productsData.products.length || 1)
    : 0;
  const totalRevenue = analyticsData?.totalRevenue || 0;

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">Pricing Analysis</h1>
        <p className="text-gray-400">
          Monitor and optimize your product pricing strategy
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            label: "Total Products",
            value: totalProducts.toLocaleString(),
            icon: Package,
            change: null,
          },
          {
            label: "Avg Price",
            value: `$${avgPrice.toFixed(2)}`,
            icon: DollarSign,
            change: null,
          },
          {
            label: "Total Revenue",
            value: `$${(totalRevenue / 1000).toFixed(1)}K`,
            icon: ShoppingCart,
            change: null,
          },
          {
            label: "Active Products",
            value: totalProducts.toLocaleString(),
            icon: Activity,
            change: null,
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

      {/* Filters */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search products or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-gray-400"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px] rounded-xl border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat || ""}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button className="gap-2 rounded-xl bg-white text-black hover:bg-white/90">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
      >
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    SKU
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Current Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Cost Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Margin
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const margin =
                    ((Number(product.currentPrice) - Number(product.costPrice)) /
                      Number(product.currentPrice)) *
                    100;
                  return (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 transition-colors hover:bg-white/5"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-white">
                            {product.name}
                          </div>
                          {product.description && (
                            <div className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                              {product.description}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-xs font-mono text-gray-300">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {product.category || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-white">
                          ${Number(product.currentPrice).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        ${Number(product.costPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                            margin > 40
                              ? "bg-emerald-500/20 text-emerald-400"
                              : margin > 20
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {margin > 40 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {margin.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {format(new Date(product.createdAt), "MMM d, yyyy")}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-semibold text-white">
              No products found
            </h3>
            <p className="mt-2 text-sm text-gray-400">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "Upload product data to get started"}
            </p>
            <Button
              onClick={() => (window.location.href = "/dashboard/data")}
              className="mt-4 rounded-xl bg-white text-black hover:bg-white/90"
            >
              Upload Data
            </Button>
          </div>
        )}
      </motion.div>

      {/* Competitor Comparison */}
      {competitorData && competitorData.length > 0 && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">
              Competitor Price Comparison
            </h2>
            <p className="text-sm text-gray-400">
              Your pricing vs market average
            </p>
          </div>
          <CompetitorComparisonChart data={competitorData.slice(0, 10)} height={300} />
        </motion.div>
      )}

      {/* Pagination */}
      {filteredProducts && filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Showing {filteredProducts.length} of {totalProducts} products
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-white/10 bg-white/5 text-white"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-white/10 bg-white/5 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
