/**
 * Data Validation Utilities
 * Validate and clean uploaded data
 */

import { z } from "zod";

// Schema for product data
export const ProductDataSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  currentPrice: z.number().positive("Price must be positive"),
  costPrice: z.number().positive("Cost must be positive").optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});

// Schema for sales data
export const SalesDataSchema = z.object({
  productId: z.string().optional(), // Can be mapped later
  sku: z.string().min(1, "SKU is required"),
  date: z.coerce.date(),
  quantity: z.number().int().positive("Quantity must be positive"),
  revenue: z.number().positive("Revenue must be positive"),
  unitPrice: z.number().positive("Unit price must be positive").optional(),
});

// Schema for competitor data
export const CompetitorDataSchema = z.object({
  productId: z.string().optional(),
  sku: z.string().min(1, "SKU is required"),
  competitorName: z.string().min(1, "Competitor name is required"),
  competitorPrice: z.number().positive("Competitor price must be positive"),
  date: z.coerce.date().optional(),
  url: z.string().url().optional(),
});

export type DataType = "products" | "sales" | "competitors";

/**
 * Get schema for data type
 */
export function getSchemaForType(type: DataType) {
  switch (type) {
    case "products":
      return ProductDataSchema;
    case "sales":
      return SalesDataSchema;
    case "competitors":
      return CompetitorDataSchema;
    default:
      throw new Error(`Unknown data type: ${type}`);
  }
}

/**
 * Validate a single row of data
 */
export function validateRow(
  row: Record<string, any>,
  type: DataType
): { valid: boolean; errors: string[]; data?: any } {
  const schema = getSchemaForType(type);

  try {
    const validatedData = schema.parse(row);
    return {
      valid: true,
      errors: [],
      data: validatedData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`),
      };
    }
    return {
      valid: false,
      errors: ["Unknown validation error"],
    };
  }
}

/**
 * Validate multiple rows
 */
export function validateRows(
  rows: Record<string, any>[],
  type: DataType
): {
  validRows: any[];
  invalidRows: Array<{ row: Record<string, any>; errors: string[]; index: number }>;
  stats: {
    total: number;
    valid: number;
    invalid: number;
  };
} {
  const validRows: any[] = [];
  const invalidRows: Array<{ row: Record<string, any>; errors: string[]; index: number }> = [];

  rows.forEach((row, index) => {
    const result = validateRow(row, type);
    if (result.valid && result.data) {
      validRows.push(result.data);
    } else {
      invalidRows.push({
        row,
        errors: result.errors,
        index,
      });
    }
  });

  return {
    validRows,
    invalidRows,
    stats: {
      total: rows.length,
      valid: validRows.length,
      invalid: invalidRows.length,
    },
  };
}

/**
 * Clean and normalize data
 */
export function cleanData(rows: Record<string, any>[]): Record<string, any>[] {
  return rows.map((row) => {
    const cleaned: Record<string, any> = {};

    Object.entries(row).forEach(([key, value]) => {
      // Skip null/undefined
      if (value === null || value === undefined) {
        return;
      }

      // Trim strings
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (trimmed !== "") {
          cleaned[key] = trimmed;
        }
        return;
      }

      // Keep other types as-is
      cleaned[key] = value;
    });

    return cleaned;
  });
}

/**
 * Detect column mapping suggestions
 */
export function suggestColumnMapping(
  headers: string[],
  type: DataType
): Record<string, string> {
  const mapping: Record<string, string> = {};

  // Define common column name variations
  const patterns: Record<DataType, Record<string, string[]>> = {
    products: {
      name: ["name", "product", "product_name", "productname", "title"],
      sku: ["sku", "code", "product_code", "productcode", "item_code"],
      currentPrice: ["price", "current_price", "currentprice", "selling_price", "retail_price"],
      costPrice: ["cost", "cost_price", "costprice", "unit_cost", "purchase_price"],
      category: ["category", "cat", "product_category", "type"],
      description: ["description", "desc", "details", "product_description"],
    },
    sales: {
      sku: ["sku", "code", "product_code", "productcode", "item_code"],
      date: ["date", "sale_date", "saledate", "transaction_date", "order_date"],
      quantity: ["quantity", "qty", "units", "units_sold", "amount"],
      revenue: ["revenue", "sales", "total", "total_sales", "amount"],
      unitPrice: ["unit_price", "unitprice", "price", "selling_price"],
    },
    competitors: {
      sku: ["sku", "code", "product_code", "productcode", "item_code"],
      competitorName: ["competitor", "competitor_name", "competitorname", "store", "retailer"],
      competitorPrice: ["price", "competitor_price", "competitorprice", "their_price"],
      date: ["date", "check_date", "checkdate", "scraped_date"],
      url: ["url", "link", "product_url", "producturl"],
    },
  };

  const typePatterns = patterns[type];

  headers.forEach((header) => {
    const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, "_");

    // Try to match against patterns
    for (const [field, variations] of Object.entries(typePatterns)) {
      if (variations.some((v) => normalized.includes(v) || v.includes(normalized))) {
        mapping[header] = field;
        break;
      }
    }
  });

  return mapping;
}

