/**
 * Product Router
 * Handles all product-related operations
 */

import { z } from "zod";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const productsRouter = router({
  // Get all products for current user
  getAll: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.user.id,
        ...(input.category && { category: input.category }),
        ...(input.search && {
          OR: [
            { name: { contains: input.search, mode: "insensitive" as const } },
            { sku: { contains: input.search, mode: "insensitive" as const } },
          ],
        }),
      };

      const [products, total] = await Promise.all([
        ctx.prisma.product.findMany({
          where,
          take: input.limit,
          skip: input.offset,
          orderBy: { createdAt: "desc" },
          include: {
            _count: {
              select: {
                salesData: true,
                priceHistory: true,
              },
            },
          },
        }),
        ctx.prisma.product.count({ where }),
      ]);

      return {
        products,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get single product by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: {
          priceHistory: {
            orderBy: { effectiveDate: "desc" },
            take: 10,
          },
          salesData: {
            orderBy: { periodStart: "desc" },
            take: 30,
          },
          competitorData: {
            orderBy: { scrapedAt: "desc" },
            take: 5,
          },
          recommendations: {
            where: { status: "PENDING" },
            orderBy: { generatedAt: "desc" },
            take: 5,
          },
        },
      });

      if (!product || product.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return product;
    }),

  // Create new product
  create: protectedProcedure
    .input(
      z.object({
        sku: z.string().min(1),
        name: z.string().min(1),
        description: z.string().optional(),
        category: z.string().optional(),
        currentPrice: z.number().positive(),
        costPrice: z.number().positive(),
        currency: z.string().default("USD"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if SKU already exists
      const existing = await ctx.prisma.product.findUnique({
        where: { sku: input.sku },
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A product with this SKU already exists",
        });
      }

      const product = await ctx.prisma.product.create({
        data: {
          ...input,
          userId: ctx.user.id,
        },
      });

      // Create initial price history entry
      await ctx.prisma.priceHistory.create({
        data: {
          productId: product.id,
          price: input.currentPrice,
          costPrice: input.costPrice,
          changeReason: "Initial price",
        },
      });

      return product;
    }),

  // Update product
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        category: z.string().optional(),
        currentPrice: z.number().positive().optional(),
        costPrice: z.number().positive().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
      const existing = await ctx.prisma.product.findUnique({
        where: { id },
      });

      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // If price changed, create price history entry
      if (data.currentPrice && data.currentPrice !== Number(existing.currentPrice)) {
        await ctx.prisma.priceHistory.create({
          data: {
            productId: id,
            price: data.currentPrice,
            costPrice: data.costPrice || Number(existing.costPrice),
            changeReason: "Manual price update",
          },
        });
      }

      const product = await ctx.prisma.product.update({
        where: { id },
        data,
      });

      return product;
    }),

  // Delete product
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify ownership
      const existing = await ctx.prisma.product.findUnique({
        where: { id: input.id },
      });

      if (!existing || existing.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      await ctx.prisma.product.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Get product analytics summary
  getAnalytics: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.id },
        include: {
          salesData: {
            orderBy: { periodStart: "desc" },
            take: 30,
          },
          priceHistory: {
            orderBy: { effectiveDate: "desc" },
            take: 2,
          },
        },
      });

      if (!product || product.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Calculate metrics
      const totalRevenue = product.salesData.reduce(
        (sum, sale) => sum + Number(sale.revenue),
        0
      );
      const totalUnits = product.salesData.reduce(
        (sum, sale) => sum + sale.unitsSold,
        0
      );
      const avgMargin =
        product.salesData.reduce((sum, sale) => sum + Number(sale.margin || 0), 0) /
        product.salesData.length;

      return {
        product,
        metrics: {
          totalRevenue,
          totalUnits,
          avgMargin,
          currentPrice: product.currentPrice,
          previousPrice: product.priceHistory[1]?.price || product.currentPrice,
        },
      };
    }),
});

