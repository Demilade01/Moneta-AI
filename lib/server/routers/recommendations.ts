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

