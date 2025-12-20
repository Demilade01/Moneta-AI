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

  // Run simulation (this would trigger AI analysis in real implementation)
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
                    take: 30,
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

      // In a real implementation, this would trigger the AI agent
      // For now, we'll create a placeholder result
      // TODO: Integrate with AI agent

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Create dummy results (replace with actual AI calculations)
      const result = await ctx.prisma.simulationResult.create({
        data: {
          simulationId: input.id,
          projectedRevenue: 125000,
          projectedUnits: 450,
          projectedMargin: 55000,
          revenueDelta: 12500,
          unitsDelta: -25,
          marginDelta: 8500,
          confidence: 75.5,
          riskLevel: "MEDIUM",
        },
      });

      // Update simulation status
      await ctx.prisma.simulation.update({
        where: { id: input.id },
        data: { status: "COMPLETED" },
      });

      return result;
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
});

