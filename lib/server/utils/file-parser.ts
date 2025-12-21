/**
 * File Parser Utilities
 * Parse CSV and Excel files for data upload
 */

// @ts-ignore - papaparse types
import Papa from "papaparse";
// @ts-ignore - xlsx types
import * as XLSX from "xlsx";

export interface ParsedData {
  headers: string[];
  rows: Record<string, any>[];
  totalRows: number;
  preview: Record<string, any>[]; // First 10 rows
}

export interface ParseOptions {
  maxRows?: number;
  skipEmptyRows?: boolean;
}

/**
 * Parse CSV file from buffer
 */
export function parseCSV(
  buffer: Buffer,
  options: ParseOptions = {}
): ParsedData {
  const { maxRows, skipEmptyRows = true } = options;

  // Convert buffer to string
  const csvString = buffer.toString("utf-8");

  // Parse CSV
  const result = Papa.parse(csvString, {
    header: true,
    skipEmptyLines: skipEmptyRows,
    dynamicTyping: true, // Auto-convert numbers
    transformHeader: (header: string) => header.trim(), // Clean headers
  });

  if (result.errors.length > 0) {
    throw new Error(
      `CSV parsing error: ${result.errors[0].message}`
    );
  }

  const rows = result.data as Record<string, any>[];
  const headers = result.meta.fields || [];

  // Apply max rows limit if specified
  const limitedRows = maxRows ? rows.slice(0, maxRows) : rows;

  return {
    headers,
    rows: limitedRows,
    totalRows: rows.length,
    preview: rows.slice(0, 10),
  };
}

/**
 * Parse Excel file from buffer
 */
export function parseExcel(
  buffer: Buffer,
  options: ParseOptions = {}
): ParsedData {
  const { maxRows, skipEmptyRows = true } = options;

  // Read workbook from buffer
  const workbook = XLSX.read(buffer, { type: "buffer" });

  // Get first sheet
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) {
    throw new Error("Excel file has no sheets");
  }

  const worksheet = workbook.Sheets[sheetName];

  // Convert to JSON
  const rawData = XLSX.utils.sheet_to_json(worksheet, {
    header: 1, // Get as array of arrays first
    defval: null, // Default value for empty cells
    blankrows: !skipEmptyRows,
  }) as any[][];

  if (rawData.length === 0) {
    throw new Error("Excel file is empty");
  }

  // Extract headers (first row)
  const headers = rawData[0].map((h: any) => String(h).trim());

  // Extract data rows (skip header)
  const dataRows = rawData.slice(1);

  // Convert to objects
  const rows = dataRows
    .filter((row) => {
      // Skip empty rows if option is set
      if (skipEmptyRows) {
        return row.some((cell) => cell !== null && cell !== "");
      }
      return true;
    })
    .map((row) => {
      const obj: Record<string, any> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] ?? null;
      });
      return obj;
    });

  // Apply max rows limit if specified
  const limitedRows = maxRows ? rows.slice(0, maxRows) : rows;

  return {
    headers,
    rows: limitedRows,
    totalRows: rows.length,
    preview: rows.slice(0, 10),
  };
}

/**
 * Auto-detect file type and parse
 */
export function parseFile(
  buffer: Buffer,
  filename: string,
  options: ParseOptions = {}
): ParsedData {
  const extension = filename.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "csv":
      return parseCSV(buffer, options);
    case "xlsx":
    case "xls":
      return parseExcel(buffer, options);
    default:
      throw new Error(
        `Unsupported file type: ${extension}. Please upload CSV or Excel files.`
      );
  }
}

/**
 * Validate file size
 */
export function validateFileSize(
  buffer: Buffer,
  maxSizeMB: number = 10
): void {
  const sizeMB = buffer.length / (1024 * 1024);
  if (sizeMB > maxSizeMB) {
    throw new Error(
      `File size (${sizeMB.toFixed(2)}MB) exceeds maximum allowed size (${maxSizeMB}MB)`
    );
  }
}

/**
 * Validate file type
 */
export function validateFileType(filename: string): void {
  const extension = filename.split(".").pop()?.toLowerCase();
  const allowedTypes = ["csv", "xlsx", "xls"];

  if (!extension || !allowedTypes.includes(extension)) {
    throw new Error(
      `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`
    );
  }
}

