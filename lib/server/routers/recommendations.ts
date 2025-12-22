/**
 * Recommendations Router
 * Handles AI-generated pricing recommendations
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const recommendationsRouter = router({
  // Get all recommendations
  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "IMPLEMENTED", "EXPIRED"]).optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.user.id,
        ...(input.status && { status: input.status }),
        ...(input.priority && { priority: input.priority }),
      };

      const [recommendations, total] = await Promise.all([
        ctx.prisma.recommendation.findMany({
          where,
          take: input.limit,
          skip: input.offset,
          orderBy: [{ priority: "desc" }, { generatedAt: "desc" }],
          include: {
            product: {
              select: {
                id: true,
                name: true,
                sku: true,
                category: true,
              },
            },
          },
        }),
        ctx.prisma.recommendation.count({ where }),
      ]);

      return {
        recommendations,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get single recommendation
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const recommendation = await ctx.prisma.recommendation.findUnique({
        where: { id: input.id },
        include: {
          product: {
            include: {
              salesData: {
                orderBy: { periodStart: "desc" },
                take: 30,
              },
              priceHistory: {
                orderBy: { effectiveDate: "desc" },
                take: 10,
              },
            },
          },
        },
      });

      if (!recommendation || recommendation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recommendation not found",
        });
      }

      return recommendation;
    }),

  // Update recommendation status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "IMPLEMENTED", "EXPIRED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const recommendation = await ctx.prisma.recommendation.findUnique({
        where: { id: input.id },
      });

      if (!recommendation || recommendation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Recommendation not found",
        });
      }

      const updated = await ctx.prisma.recommendation.update({
        where: { id: input.id },
        data: {
          status: input.status,
          ...(input.status === "IMPLEMENTED" && {
            implementedAt: new Date(),
          }),
        },
      });

      // If implemented, update the product price
      if (input.status === "IMPLEMENTED") {
        await ctx.prisma.product.update({
          where: { id: recommendation.productId },
          data: {
            currentPrice: recommendation.recommendedPrice,
          },
        });

        // Create price history entry
        await ctx.prisma.priceHistory.create({
          data: {
            productId: recommendation.productId,
            price: recommendation.recommendedPrice,
            changeReason: `AI Recommendation implemented (ID: ${input.id})`,
          },
        });
      }

      return updated;
    }),

  // Generate AI recommendation for a product
  generate: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Get product with related data
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          salesData: {
            orderBy: { periodStart: "desc" },
            take: 90,
          },
          priceHistory: {
            orderBy: { effectiveDate: "desc" },
            take: 10,
          },
          competitorData: {
            orderBy: { scrapedAt: "desc" },
            take: 10,
          },
        },
      });

      if (!product || product.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      // Check if there's enough data
      if (product.salesData.length < 3) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough sales data to generate recommendation. This product has ${product.salesData.length} data points, but at least 3 are required. Please upload more sales data.`,
        });
      }

      // Prepare data for AI agent
      const { generatePricingRecommendation } = await import("../ai/pricing-agent");

      const result = await generatePricingRecommendation({
        productId: product.id,
        productName: product.name,
        currentPrice: Number(product.currentPrice),
        costPrice: Number(product.costPrice),
        category: product.category || "Uncategorized",
        salesHistory: product.salesData.map((s) => ({
          date: s.periodStart.toISOString(),
          quantity: s.unitsSold,
          revenue: Number(s.revenue),
        })),
        priceHistory: product.priceHistory.map((p) => ({
          date: p.effectiveDate.toISOString(),
          price: Number(p.price),
        })),
        competitorPrices: product.competitorData.map((c) => ({
          name: c.competitorName,
          price: Number(c.competitorPrice),
        })),
      });

      if (result.error || !result.recommendation) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.error || "Failed to generate recommendation",
        });
      }

      // Save recommendation to database
      const changePercent = ((result.recommendation.recommendedPrice - Number(product.currentPrice)) / Number(product.currentPrice)) * 100;

      const recommendation = await ctx.prisma.recommendation.create({
        data: {
          userId: ctx.user.id,
          productId: product.id,
          currentPrice: product.currentPrice,
          recommendedPrice: result.recommendation.recommendedPrice,
          changePercent: changePercent,
          reasoning: result.recommendation.reasoning,
          confidenceScore: result.recommendation.confidenceScore,
          projectedRevenueImpact: result.recommendation.expectedRevenueImpact,
          projectedMarginImpact: result.recommendation.expectedMarginImpact,
          riskLevel: result.recommendation.riskLevel.toUpperCase() as "LOW" | "MEDIUM" | "HIGH",
          priority: result.recommendation.priority.toUpperCase() as "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
          status: "PENDING",
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });

      return {
        recommendation,
        insights: {
          dataInsights: result.dataInsights,
          marketInsights: result.marketInsights,
          strategyInsights: result.strategyInsights,
        },
      };
    }),

  // Get summary stats
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const [total, pending, implemented, projectedImpact] = await Promise.all([
      ctx.prisma.recommendation.count({
        where: { userId: ctx.user.id },
      }),
      ctx.prisma.recommendation.count({
        where: { userId: ctx.user.id, status: "PENDING" },
      }),
      ctx.prisma.recommendation.count({
        where: { userId: ctx.user.id, status: "IMPLEMENTED" },
      }),
      ctx.prisma.recommendation.aggregate({
        where: {
          userId: ctx.user.id,
          status: "PENDING",
        },
        _sum: {
          projectedRevenueImpact: true,
        },
      }),
    ]);

    return {
      total,
      pending,
      implemented,
      projectedImpact: projectedImpact._sum.projectedRevenueImpact || 0,
    };
  }),
});

