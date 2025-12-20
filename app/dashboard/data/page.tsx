"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Download,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const uploadHistory = [
  {
    id: "1",
    fileName: "pricing_data_q4_2024.csv",
    type: "Pricing Data",
    date: "2024-12-18",
    status: "completed",
    rows: 1248,
  },
  {
    id: "2",
    fileName: "competitor_prices_dec.xlsx",
    type: "Competitor Data",
    date: "2024-12-15",
    status: "completed",
    rows: 856,
  },
  {
    id: "3",
    fileName: "sales_data_november.csv",
    type: "Sales Data",
    date: "2024-12-10",
    status: "completed",
    rows: 3421,
  },
  {
    id: "4",
    fileName: "cost_analysis.csv",
    type: "Cost Data",
    date: "2024-12-08",
    status: "failed",
    rows: 0,
  },
];

export default function DataUploadPage() {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-white">Data Upload</h1>
        <p className="text-gray-400">
          Import pricing, sales, and competitor data to power AI analysis
        </p>
      </motion.div>

      {/* Upload Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Uploads", value: "47", icon: Upload },
          { label: "Total Records", value: "12.4K", icon: FileSpreadsheet },
          { label: "This Month", value: "8", icon: Calendar },
          { label: "Success Rate", value: "98%", icon: CheckCircle2 },
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

      {/* Upload Zone */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
            isDragging
              ? "border-white/40 bg-white/10"
              : "border-white/20 bg-white/5"
          }`}
        >
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
              <Upload className="h-10 w-10 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Drop files here or click to upload
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Supports CSV, Excel, and JSON files up to 50MB
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button className="gap-2 rounded-xl bg-white text-black hover:bg-white/90">
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              <Button
                variant="outline"
                className="gap-2 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
            </div>
          </div>
        </div>

        {/* File Type Badges */}
        <div className="mt-6 flex flex-wrap gap-2 justify-center">
          {["Pricing Data", "Sales Data", "Cost Data", "Competitor Data"].map(
            (type) => (
              <span
                key={type}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300"
              >
                {type}
              </span>
            )
          )}
        </div>
      </motion.div>

      {/* Upload Instructions */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">
          Data Upload Guidelines
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <div className="font-medium text-white">Required Columns</div>
                <div className="text-sm text-gray-400">
                  Product ID, Name, Price, Date
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <div className="font-medium text-white">File Format</div>
                <div className="text-sm text-gray-400">
                  CSV, XLSX, or JSON accepted
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <div className="font-medium text-white">Data Validation</div>
                <div className="text-sm text-gray-400">
                  Automatic checks for data quality
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-400" />
              <div>
                <div className="font-medium text-white">Secure Storage</div>
                <div className="text-sm text-gray-400">
                  All data encrypted at rest
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Upload History */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Recent Uploads
        </h3>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    File Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Rows
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {uploadHistory.map((upload) => (
                  <tr
                    key={upload.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-white">
                          {upload.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{upload.type}</td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(upload.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {upload.rows.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      {upload.status === "completed" ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" />
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
                          <AlertCircle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg text-gray-400 hover:text-white"
                        >
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

