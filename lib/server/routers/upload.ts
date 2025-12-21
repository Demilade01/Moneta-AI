/**
 * Upload Router
 * Handles file upload, parsing, and data import
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  parseFile,
  validateFileSize,
  validateFileType,
} from "../utils/file-parser";
import {
  validateRows,
  cleanData,
  suggestColumnMapping,
  type DataType,
} from "../utils/data-validator";

export const uploadRouter = router({
  /**
   * Parse uploaded file and return preview
   */
  parseFile: protectedProcedure
    .input(
      z.object({
        fileData: z.string(), // Base64 encoded file
        filename: z.string(),
        dataType: z.enum(["products", "sales", "competitors"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Validate file
        validateFileType(input.filename);
        validateFileSize(buffer, 10); // 10MB max

        // Parse file
        const parsed = parseFile(buffer, input.filename, {
          maxRows: 1000, // Limit to 1000 rows for preview
          skipEmptyRows: true,
        });

        // Clean data
        const cleanedRows = cleanData(parsed.rows);

        // Suggest column mapping
        const suggestedMapping = suggestColumnMapping(
          parsed.headers,
          input.dataType
        );

        // Create upload record
        const upload = await ctx.prisma.dataUpload.create({
          data: {
            userId: ctx.user.id,
            fileName: input.filename,
            fileType: input.filename.split(".").pop()?.toUpperCase() || "UNKNOWN",
            fileSize: buffer.length,
            status: "PROCESSING",
            rowsProcessed: 0,
            rowsFailed: 0,
          },
        });

        return {
          uploadId: upload.id,
          headers: parsed.headers,
          preview: parsed.preview,
          totalRows: parsed.totalRows,
          suggestedMapping,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error instanceof Error ? error.message : "Failed to parse file",
        });
      }
    }),

  /**
   * Validate and import data with column mapping
   */
  importData: protectedProcedure
    .input(
      z.object({
        uploadId: z.string(),
        fileData: z.string(), // Base64 encoded file
        filename: z.string(),
        dataType: z.enum(["products", "sales", "competitors"]),
        columnMapping: z.record(z.string(), z.string()), // { "CSV Column": "DB Field" }
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Decode and parse file again
        const buffer = Buffer.from(input.fileData, "base64");
        const parsed = parseFile(buffer, input.filename);

        // Apply column mapping
        const mappedRows = parsed.rows.map((row) => {
          const mapped: Record<string, any> = {};
          Object.entries(input.columnMapping).forEach(([csvCol, dbField]: [string, any]) => {
            if (row[csvCol] !== undefined) {
              mapped[dbField] = row[csvCol];
            }
          });
          return mapped;
        });

        // Clean data
        const cleanedRows = cleanData(mappedRows);

        // Validate rows
        const validation = validateRows(cleanedRows, input.dataType);

        // Import valid rows based on data type
        let imported = 0;

        if (input.dataType === "products") {
          // Import products
          for (const row of validation.validRows) {
            await ctx.prisma.product.upsert({
              where: { sku: row.sku },
              update: {
                name: row.name,
                currentPrice: row.currentPrice,
                costPrice: row.costPrice,
                category: row.category,
                description: row.description,
              },
              create: {
                userId: ctx.user.id,
                name: row.name,
                sku: row.sku,
                currentPrice: row.currentPrice,
                costPrice: row.costPrice || row.currentPrice * 0.6, // Default 40% margin
                category: row.category,
                description: row.description,
              },
            });
            imported++;
          }
        } else if (input.dataType === "sales") {
          // Import sales data
          for (const row of validation.validRows) {
            // Find product by SKU
            const product = await ctx.prisma.product.findFirst({
              where: {
                sku: row.sku,
                userId: ctx.user.id,
              },
            });

            if (product) {
              await ctx.prisma.salesData.create({
                data: {
                  productId: product.id,
                  periodStart: row.date,
                  periodEnd: row.date,
                  periodType: "DAILY",
                  unitsSold: row.quantity,
                  revenue: row.revenue,
                  cost: product.costPrice ? Number(product.costPrice) * row.quantity : null,
                },
              });
              imported++;
            }
          }
        } else if (input.dataType === "competitors") {
          // Import competitor data
          for (const row of validation.validRows) {
            // Find product by SKU
            const product = await ctx.prisma.product.findFirst({
              where: {
                sku: row.sku,
                userId: ctx.user.id,
              },
            });

            if (product) {
              await ctx.prisma.competitorData.create({
                data: {
                  productId: product.id,
                  competitorName: row.competitorName,
                  competitorPrice: row.competitorPrice,
                  productUrl: row.url,
                  scrapedAt: row.date || new Date(),
                },
              });
              imported++;
            }
          }
        }

        // Update upload record
        await ctx.prisma.dataUpload.update({
          where: { id: input.uploadId },
          data: {
            status: "COMPLETED",
            rowsProcessed: validation.stats.valid,
            rowsFailed: validation.stats.invalid,
            processedAt: new Date(),
            errorLog: validation.invalidRows.length > 0
              ? JSON.stringify(validation.invalidRows.slice(0, 100)) // Store first 100 errors
              : null,
          },
        });

        return {
          success: true,
          imported,
          stats: validation.stats,
          errors: validation.invalidRows.slice(0, 10), // Return first 10 errors
        };
      } catch (error) {
        // Update upload record with error
        await ctx.prisma.dataUpload.update({
          where: { id: input.uploadId },
          data: {
            status: "FAILED",
            errorLog: error instanceof Error ? error.message : "Import failed",
          },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Failed to import data",
        });
      }
    }),

  /**
   * Get upload history
   */
  getHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const [uploads, total] = await Promise.all([
        ctx.prisma.dataUpload.findMany({
          where: { userId: ctx.user.id },
          orderBy: { uploadedAt: "desc" },
          take: input.limit,
          skip: input.offset,
        }),
        ctx.prisma.dataUpload.count({
          where: { userId: ctx.user.id },
        }),
      ]);

      return {
        uploads,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  /**
   * Delete upload record
   */
  deleteUpload: protectedProcedure
    .input(z.object({ uploadId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Verify ownership
      const upload = await ctx.prisma.dataUpload.findFirst({
        where: {
          id: input.uploadId,
          userId: ctx.user.id,
        },
      });

      if (!upload) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Upload not found",
        });
      }

      await ctx.prisma.dataUpload.delete({
        where: { id: input.uploadId },
      });

      return { success: true };
    }),
});

