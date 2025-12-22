/**
 * Simulations Router
 * Handles pricing simulation scenarios
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

export const simulationsRouter = router({
  // Get all simulations
  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["DRAFT", "RUNNING", "COMPLETED", "FAILED"]).optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const where = {
        userId: ctx.user.id,
        ...(input.status && { status: input.status }),
      };

      const [simulations, total] = await Promise.all([
        ctx.prisma.simulation.findMany({
          where,
          take: input.limit,
          skip: input.offset,
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              include: {
                product: {
                  select: {
                    id: true,
                    name: true,
                    sku: true,
                  },
                },
              },
            },
            results: true,
            _count: {
              select: {
                items: true,
              },
            },
          },
        }),
        ctx.prisma.simulation.count({ where }),
      ]);

      return {
        simulations,
        total,
        hasMore: input.offset + input.limit < total,
      };
    }),

  // Get single simulation
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const simulation = await ctx.prisma.simulation.findUnique({
        where: { id: input.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          results: true,
        },
      });

      if (!simulation || simulation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simulation not found",
        });
      }

      return simulation;
    }),

  // Create new simulation
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        duration: z.number().min(1).max(365),
        items: z.array(
          z.object({
            productId: z.string(),
            proposedPrice: z.number().positive(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify all products belong to user
      const products = await ctx.prisma.product.findMany({
        where: {
          id: { in: input.items.map((item) => item.productId) },
          userId: ctx.user.id,
        },
      });

      if (products.length !== input.items.length) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "One or more products not found",
        });
      }

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + input.duration);

      const simulation = await ctx.prisma.simulation.create({
        data: {
          name: input.name,
          description: input.description,
          duration: input.duration,
          startDate,
          endDate,
          status: "DRAFT",
          userId: ctx.user.id,
          items: {
            create: input.items.map((item) => {
              const product = products.find((p: typeof products[0]) => p.id === item.productId)!;
              const changePercent =
                ((Number(item.proposedPrice) - Number(product.currentPrice)) /
                  Number(product.currentPrice)) *
                100;

              return {
                productId: item.productId,
                currentPrice: product.currentPrice,
                proposedPrice: item.proposedPrice,
                changePercent,
              };
            }),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      return simulation;
    }),

  // Run simulation with AI-powered predictions
  run: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const simulation = await ctx.prisma.simulation.findUnique({
        where: { id: input.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  salesData: {
                    orderBy: { periodStart: "desc" },
                    take: 90,
                  },
                  competitorData: {
                    orderBy: { scrapedAt: "desc" },
                    take: 10,
                  },
                },
              },
            },
          },
        },
      });

      if (!simulation || simulation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simulation not found",
        });
      }

      // Update status to RUNNING
      await ctx.prisma.simulation.update({
        where: { id: input.id },
        data: { status: "RUNNING" },
      });

      try {
        // Get the first simulation item (support for single product simulations for now)
        const item = simulation.items[0];
        if (!item) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Simulation has no items",
          });
        }

        const product = item.product;
        const salesData = product.salesData;

        // Calculate current metrics
        const totalUnits = salesData.reduce((sum, s) => sum + s.unitsSold, 0);
        const avgUnitsPerPeriod = totalUnits / Math.max(salesData.length, 1);
        const currentRevenue = salesData.reduce((sum, s) => sum + Number(s.revenue), 0);
        const avgRevenuePerPeriod = currentRevenue / Math.max(salesData.length, 1);

        // Calculate price elasticity from historical data
        let elasticity = -1.2; // Default moderate elasticity
        if (salesData.length >= 2) {
          const recent = salesData.slice(0, Math.floor(salesData.length / 2));
          const older = salesData.slice(Math.floor(salesData.length / 2));

          const recentAvgPrice =
            recent.reduce((sum, s) => sum + Number(s.revenue) / s.unitsSold, 0) / recent.length;
          const olderAvgPrice =
            older.reduce((sum, s) => sum + Number(s.revenue) / s.unitsSold, 0) / older.length;
          const recentAvgUnits = recent.reduce((sum, s) => sum + s.unitsSold, 0) / recent.length;
          const olderAvgUnits = older.reduce((sum, s) => sum + s.unitsSold, 0) / older.length;

          if (olderAvgPrice !== 0 && olderAvgUnits !== 0) {
            const priceChange = ((recentAvgPrice - olderAvgPrice) / olderAvgPrice) * 100;
            const quantityChange = ((recentAvgUnits - olderAvgUnits) / olderAvgUnits) * 100;
            if (priceChange !== 0) {
              elasticity = quantityChange / priceChange;
              // Clamp elasticity to reasonable range
              elasticity = Math.max(-5, Math.min(-0.2, elasticity));
            }
          }
        }

        // Project impact over simulation duration
        const currentPrice = Number(item.currentPrice);
        const proposedPrice = Number(item.proposedPrice);
        const priceChangePercent = ((proposedPrice - currentPrice) / currentPrice) * 100;

        // Calculate projected units (based on elasticity)
        const quantityChangePercent = elasticity * priceChangePercent;
        const projectedUnitsPerPeriod = avgUnitsPerPeriod * (1 + quantityChangePercent / 100);
        const periodsInSimulation = Math.ceil(simulation.duration / 7); // Assuming weekly periods
        const projectedUnits = Math.round(projectedUnitsPerPeriod * periodsInSimulation);

        // Calculate projected revenue
        const projectedRevenue = proposedPrice * projectedUnits;
        const currentProjectedRevenue = currentPrice * (avgUnitsPerPeriod * periodsInSimulation);
        const revenueDelta = projectedRevenue - currentProjectedRevenue;

        // Calculate projected margin
        const costPrice = Number(product.costPrice || 0);
        const currentMargin = (currentPrice - costPrice) * avgUnitsPerPeriod * periodsInSimulation;
        const projectedMargin = (proposedPrice - costPrice) * projectedUnits;
        const marginDelta = projectedMargin - currentMargin;

        // Calculate units delta
        const currentUnits = Math.round(avgUnitsPerPeriod * periodsInSimulation);
        const unitsDelta = projectedUnits - currentUnits;

        // Calculate confidence and risk
        const dataQuality = Math.min(salesData.length / 30, 1); // More data = higher confidence
        const priceChangeMagnitude = Math.abs(priceChangePercent) / 100;
        const baseConfidence = 50 + dataQuality * 30; // 50-80% based on data
        const confidence = Math.max(30, baseConfidence - priceChangeMagnitude * 20); // Reduce confidence for large changes

        // Determine risk level
        let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM";
        if (Math.abs(priceChangePercent) < 5 && Math.abs(quantityChangePercent) < 10) {
          riskLevel = "LOW";
        } else if (Math.abs(priceChangePercent) > 15 || Math.abs(quantityChangePercent) > 30) {
          riskLevel = "HIGH";
        }

        // Create simulation result
        const result = await ctx.prisma.simulationResult.create({
          data: {
            simulationId: input.id,
            projectedRevenue,
            projectedUnits,
            projectedMargin,
            revenueDelta,
            unitsDelta,
            marginDelta,
            confidence,
            riskLevel,
          },
        });

        // Update simulation status
        await ctx.prisma.simulation.update({
          where: { id: input.id },
          data: { status: "COMPLETED" },
        });

        return result;
      } catch (error: any) {
        console.error("Simulation run error:", error);
        // Update simulation status to FAILED
        await ctx.prisma.simulation.update({
          where: { id: input.id },
          data: { status: "FAILED" },
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error?.message || "Failed to run simulation",
        });
      }
    }),

  // Delete simulation
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const simulation = await ctx.prisma.simulation.findUnique({
        where: { id: input.id },
      });

      if (!simulation || simulation.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Simulation not found",
        });
      }

      await ctx.prisma.simulation.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),

  // Get summary statistics
  getSummary: protectedProcedure.query(async ({ ctx }) => {
    const simulations = await ctx.prisma.simulation.findMany({
      where: { userId: ctx.user.id },
      include: {
        results: true,
      },
    });

    const total = simulations.length;
    const completed = simulations.filter((s) => s.status === "COMPLETED").length;
    const running = simulations.filter((s) => s.status === "RUNNING").length;
    const failed = simulations.filter((s) => s.status === "FAILED").length;

    const completedWithResults = simulations.filter(
      (s) => s.status === "COMPLETED" && s.results.length > 0
    );

    const avgRevenueImpact =
      completedWithResults.length > 0
        ? completedWithResults.reduce((sum, s) => {
            const result = s.results[0];
            const percent =
              (Number(result.revenueDelta) /
                (Number(result.projectedRevenue) - Number(result.revenueDelta))) *
              100;
            return sum + percent;
          }, 0) / completedWithResults.length
        : 0;

    const bestSimulation =
      completedWithResults.length > 0
        ? completedWithResults.reduce((best, sim) => {
            const result = sim.results[0];
            const percent =
              (Number(result.revenueDelta) /
                (Number(result.projectedRevenue) - Number(result.revenueDelta))) *
              100;
            const bestResult = best?.results[0];
            const bestPercent = bestResult
              ? (Number(bestResult.revenueDelta) /
                  (Number(bestResult.projectedRevenue) - Number(bestResult.revenueDelta))) *
                100
              : 0;
            return percent > bestPercent ? sim : best;
          })
        : null;

    return {
      total,
      completed,
      running,
      failed,
      avgRevenueImpact,
      bestSimulation: bestSimulation
        ? {
            id: bestSimulation.id,
            name: bestSimulation.name,
            revenueImpact:
              (Number(bestSimulation.results[0].revenueDelta) /
                (Number(bestSimulation.results[0].projectedRevenue) -
                  Number(bestSimulation.results[0].revenueDelta))) *
              100,
          }
        : null,
    };
  }),
});

