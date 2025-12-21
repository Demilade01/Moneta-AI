"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Trash2,
  X,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/client/trpc";
import { toast } from "sonner";
import { format } from "date-fns";

type DataType = "products" | "sales" | "competitors";
type UploadStep = "select" | "mapping" | "importing" | "complete";

export default function DataUploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>("products");
  const [uploadStep, setUploadStep] = useState<UploadStep>("select");
  const [uploadId, setUploadId] = useState<string>("");
  const [parsedData, setParsedData] = useState<any>(null);
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries
  const { data: historyData, refetch: refetchHistory } = trpc.upload.getHistory.useQuery({
    limit: 10,
    offset: 0,
  });

  // Mutations
  const parseFile = trpc.upload.parseFile.useMutation({
    onSuccess: (data) => {
      setParsedData(data);
      setColumnMapping(data.suggestedMapping);
      setUploadId(data.uploadId);
      setUploadStep("mapping");
      toast.success("File parsed successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to parse file");
      resetUpload();
    },
  });

  const importData = trpc.upload.importData.useMutation({
    onSuccess: (data) => {
      toast.success(`Successfully imported ${data.imported} rows!`);
      if (data.stats.invalid > 0) {
        toast.warning(`${data.stats.invalid} rows had errors`);
      }
      setUploadStep("complete");
      refetchHistory();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to import data");
      setUploadStep("mapping");
    },
  });

  const deleteUpload = trpc.upload.deleteUpload.useMutation({
    onSuccess: () => {
      toast.success("Upload deleted");
      refetchHistory();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete upload");
    },
  });

  // File handling
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

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [".csv", ".xlsx", ".xls"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();

    if (!validTypes.includes(fileExt)) {
      toast.error("Invalid file type. Please upload CSV or Excel files.");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadFile = async () => {
    if (!selectedFile) return;

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(",")[1]; // Remove data:*/*;base64, prefix

      parseFile.mutate({
        fileData: base64Data,
        filename: selectedFile.name,
        dataType,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleImport = async () => {
    if (!selectedFile || !uploadId) return;

    setUploadStep("importing");

    // Convert file to base64 again
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      const base64Data = base64.split(",")[1];

      importData.mutate({
        uploadId,
        fileData: base64Data,
        filename: selectedFile.name,
        dataType,
        columnMapping,
      });
    };
    reader.readAsDataURL(selectedFile);
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadStep("select");
    setParsedData(null);
    setColumnMapping({});
    setUploadId("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Render upload steps
  const renderUploadContent = () => {
    if (uploadStep === "select") {
      return (
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
              {selectedFile ? selectedFile.name : "Drop files here or click to upload"}
            </h3>
            <p className="mb-6 text-sm text-gray-400">
              Supports CSV and Excel files up to 10MB
            </p>

            {/* Data Type Selection */}
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-white">
                Data Type
              </label>
              <div className="flex gap-2 justify-center">
                {(["products", "sales", "competitors"] as DataType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setDataType(type)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                      dataType === type
                        ? "border-white bg-white text-black"
                        : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileInputChange}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 rounded-xl bg-white text-black hover:bg-white/90"
              >
                <Upload className="h-4 w-4" />
                Choose File
              </Button>
              {selectedFile && (
                <>
                  <Button
                    onClick={handleUploadFile}
                    disabled={parseFile.isPending}
                    className="gap-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
                  >
                    {parseFile.isPending ? "Parsing..." : "Upload & Parse"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setSelectedFile(null)}
                    variant="ghost"
                    className="gap-2 rounded-xl text-red-400 hover:text-red-300"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    if (uploadStep === "mapping" && parsedData) {
      return (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">
                Map Columns
              </h3>
              <p className="text-sm text-gray-400">
                {parsedData.totalRows} rows found • Map your columns to our fields
              </p>
            </div>
            <Button
              onClick={resetUpload}
              variant="ghost"
              className="gap-2 text-gray-400"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>

          {/* Column Mapping */}
          <div className="space-y-3">
            {parsedData.headers.map((header: string) => (
              <div key={header} className="flex items-center gap-4">
                <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                  <span className="text-sm text-white">{header}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <select
                  value={columnMapping[header] || ""}
                  onChange={(e) =>
                    setColumnMapping({ ...columnMapping, [header]: e.target.value })
                  }
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white"
                >
                  <option value="">Skip this column</option>
                  {dataType === "products" && (
                    <>
                      <option value="name">Product Name</option>
                      <option value="sku">SKU</option>
                      <option value="currentPrice">Current Price</option>
                      <option value="costPrice">Cost Price</option>
                      <option value="category">Category</option>
                      <option value="description">Description</option>
                    </>
                  )}
                  {dataType === "sales" && (
                    <>
                      <option value="sku">SKU</option>
                      <option value="date">Date</option>
                      <option value="quantity">Quantity</option>
                      <option value="revenue">Revenue</option>
                      <option value="unitPrice">Unit Price</option>
                    </>
                  )}
                  {dataType === "competitors" && (
                    <>
                      <option value="sku">SKU</option>
                      <option value="competitorName">Competitor Name</option>
                      <option value="competitorPrice">Competitor Price</option>
                      <option value="date">Date</option>
                      <option value="url">URL</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>

          {/* Preview */}
          <div>
            <h4 className="mb-3 text-sm font-medium text-white">Data Preview</h4>
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead className="border-b border-white/10 bg-white/5">
                  <tr>
                    {parsedData.headers.map((header: string) => (
                      <th key={header} className="px-4 py-2 text-left text-gray-400">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.preview.slice(0, 5).map((row: any, i: number) => (
                    <tr key={i} className="border-b border-white/5">
                      {parsedData.headers.map((header: string) => (
                        <td key={header} className="px-4 py-2 text-gray-300">
                          {row[header]?.toString() || "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              onClick={resetUpload}
              variant="outline"
              className="rounded-xl border-white/10 bg-white/5"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              className="gap-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600"
            >
              Import Data
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }

    if (uploadStep === "importing") {
      return (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-white"></div>
          <h3 className="text-xl font-semibold text-white">Importing Data...</h3>
          <p className="text-sm text-gray-400">Please wait while we process your data</p>
        </div>
      );
    }

    if (uploadStep === "complete") {
      return (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h3 className="mb-2 text-xl font-semibold text-white">Import Complete!</h3>
          <p className="mb-6 text-sm text-gray-400">Your data has been successfully imported</p>
          <Button
            onClick={resetUpload}
            className="rounded-xl bg-white text-black hover:bg-white/90"
          >
            Upload Another File
          </Button>
        </div>
      );
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
        <h1 className="text-3xl font-bold text-white">Data Upload</h1>
        <p className="text-gray-400">
          Import pricing, sales, and competitor data to power AI analysis
        </p>
      </motion.div>

      {/* Upload Zone */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
      >
        {renderUploadContent()}
      </motion.div>

      {/* Upload History */}
      {historyData && historyData.uploads.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">
            Recent Uploads
          </h3>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
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
                  {historyData.uploads.map((upload) => (
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
                      <td className="px-6 py-4 text-gray-300">{upload.fileType}</td>
                      <td className="px-6 py-4 text-gray-300">
                        {format(new Date(upload.uploadedAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-gray-300">
                        {(upload.rowsProcessed || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {upload.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2 py-1 text-xs font-medium text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        ) : upload.status === "FAILED" ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-red-500/20 px-2 py-1 text-xs font-medium text-red-400">
                            <AlertCircle className="h-3 w-3" />
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-400">
                            <Calendar className="h-3 w-3" />
                            Processing
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUpload.mutate({ uploadId: upload.id })}
                          disabled={deleteUpload.isPending}
                          className="h-8 rounded-lg text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
