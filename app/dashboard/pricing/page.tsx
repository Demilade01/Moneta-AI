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

// Mock data for products
const products = [
  {
    id: "1",
    name: "Premium Plan",
    sku: "PREM-001",
    currentPrice: 149.99,
    previousPrice: 139.99,
    change: 7.1,
    revenue: 847392,
    units: 5647,
    elasticity: -0.82,
    competitors: [
      { name: "Competitor A", price: 159.99 },
      { name: "Competitor B", price: 145.00 },
    ],
    status: "active",
  },
  {
    id: "2",
    name: "Standard Plan",
    sku: "STD-002",
    currentPrice: 79.99,
    previousPrice: 84.99,
    change: -5.9,
    revenue: 423891,
    units: 5299,
    elasticity: -1.15,
    competitors: [
      { name: "Competitor A", price: 89.99 },
      { name: "Competitor B", price: 74.99 },
    ],
    status: "active",
  },
  {
    id: "3",
    name: "Basic Plan",
    sku: "BSC-003",
    currentPrice: 29.99,
    previousPrice: 29.99,
    change: 0,
    revenue: 178456,
    units: 5951,
    elasticity: -1.42,
    competitors: [
      { name: "Competitor A", price: 34.99 },
      { name: "Competitor B", price: 27.99 },
    ],
    status: "active",
  },
  {
    id: "4",
    name: "Enterprise Plan",
    sku: "ENT-004",
    currentPrice: 499.99,
    previousPrice: 479.99,
    change: 4.2,
    revenue: 1247891,
    units: 2496,
    elasticity: -0.64,
    competitors: [
      { name: "Competitor A", price: 549.99 },
      { name: "Competitor B", price: 489.99 },
    ],
    status: "active",
  },
];

export default function PricingAnalysisPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

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
          <h1 className="text-3xl font-bold text-white">Pricing Analysis</h1>
          <p className="text-gray-400">
            Monitor and optimize your product pricing strategy
          </p>
        </div>
        <Button className="gap-2 rounded-xl bg-white text-black hover:bg-white/90">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          {
            label: "Avg. Price",
            value: "$189.99",
            change: "+5.2%",
            positive: true,
          },
          {
            label: "Total Revenue",
            value: "$2.7M",
            change: "+12.5%",
            positive: true,
          },
          {
            label: "Avg. Elasticity",
            value: "-1.01",
            change: "Optimal",
            positive: true,
          },
          {
            label: "Active Products",
            value: "284",
            change: "+8",
            positive: true,
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
              <div className="text-sm text-gray-400">{stat.label}</div>
              <div
                className={`flex items-center gap-1 text-xs font-medium ${
                  stat.positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.positive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-white">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[180px] rounded-xl border-white/10 bg-white/5 text-white">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-white/10 bg-[#010203]/95 backdrop-blur-xl">
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="basic">Basic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Current Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Change
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Revenue
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Units Sold
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Elasticity
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                  Competitors
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="border-b border-white/5 transition-colors hover:bg-white/5"
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-white">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">{product.sku}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-white">
                      ${product.currentPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      was ${product.previousPrice.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1 font-medium ${
                        product.change > 0
                          ? "text-emerald-400"
                          : product.change < 0
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {product.change > 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : product.change < 0 ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : null}
                      {product.change > 0 ? "+" : ""}
                      {product.change.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    ${product.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {product.units.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-lg bg-white/10 px-2 py-1 text-sm font-medium text-white">
                      {product.elasticity.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {product.competitors.map((comp) => (
                        <div
                          key={comp.name}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-gray-400">{comp.name}</span>
                          <span className="font-medium text-white">
                            ${comp.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Price Performance Chart */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          Price Performance Trends
        </h3>
        <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-gray-500">
            Chart visualization coming soon...
          </p>
        </div>
      </motion.div>
    </div>
  );
}

