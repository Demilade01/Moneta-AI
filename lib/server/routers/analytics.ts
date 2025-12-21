/**
 * Analytics Router
 * Handles dashboard analytics and insights
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const analyticsRouter = router({
  // Get dashboard stats (alias for getOverview with additional fields)
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const [
      productCount,
      products,
      recentSales,
    ] = await Promise.all([
      ctx.prisma.product.count({
        where: { userId: ctx.user.id },
      }),
      ctx.prisma.product.findMany({
        where: { userId: ctx.user.id },
        select: {
          currentPrice: true,
        },
      }),
      ctx.prisma.salesData.aggregate({
        where: {
          product: {
            userId: ctx.user.id,
          },
          periodStart: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        _sum: {
          revenue: true,
          unitsSold: true,
        },
      }),
    ]);

    // Calculate average price
    const avgPrice = products.length > 0
      ? products.reduce((sum, p) => sum + Number(p.currentPrice), 0) / products.length
      : 0;

    return {
      totalProducts: productCount,
      totalRevenue: Number(recentSales._sum.revenue || 0),
      totalUnits: recentSales._sum.unitsSold || 0,
      avgPrice,
    };
  }),

  // Get dashboard overview stats
  getOverview: protectedProcedure.query(async ({ ctx }) => {
    const [
      productCount,
      activeRecommendations,
      recentSales,
      pendingSimulations,
    ] = await Promise.all([
      ctx.prisma.product.count({
        where: { userId: ctx.user.id, isActive: true },
      }),
      ctx.prisma.recommendation.count({
        where: { userId: ctx.user.id, status: "PENDING" },
      }),
      ctx.prisma.salesData.aggregate({
        where: {
          product: {
            userId: ctx.user.id,
          },
          periodStart: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        _sum: {
          revenue: true,
          unitsSold: true,
        },
        _avg: {
          margin: true,
        },
      }),
      ctx.prisma.simulation.count({
        where: { userId: ctx.user.id, status: "DRAFT" },
      }),
    ]);

    return {
      products: productCount,
      activeRecommendations,
      totalRevenue: recentSales._sum.revenue || 0,
      totalUnits: recentSales._sum.unitsSold || 0,
      avgMargin: recentSales._avg.margin || 0,
      pendingSimulations,
    };
  }),

  // Get revenue trend data
  getRevenueTrend: protectedProcedure
    .input(
      z.object({
        days: z.number().min(7).max(365).default(30),
      })
    )
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const salesData = await ctx.prisma.salesData.findMany({
        where: {
          product: {
            userId: ctx.user.id,
          },
          periodStart: {
            gte: startDate,
          },
        },
        orderBy: {
          periodStart: "asc",
        },
      });

      // Group by date
      type DayData = { date: string; revenue: number; units: number; margin: number; count: number };
      const revenueByDate = salesData.reduce<Record<string, DayData>>((acc: Record<string, DayData>, sale: typeof salesData[0]) => {
        const date = sale.periodStart.toISOString().split("T")[0];
        if (!acc[date]) {
          acc[date] = {
            date,
            revenue: 0,
            units: 0,
            margin: 0,
            count: 0,
          };
        }
        acc[date].revenue += Number(sale.revenue);
        acc[date].units += sale.unitsSold;
        acc[date].margin += Number(sale.margin || 0);
        acc[date].count += 1;
        return acc;
      }, {});

      // Calculate averages and format
      const trend = (Object.values(revenueByDate) as DayData[]).map((day) => ({
        date: day.date,
        revenue: day.revenue,
        units: day.units,
        avgMargin: day.margin / day.count,
      }));

      return trend;
    }),

  // Get pricing insights
  getInsights: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const insights = await ctx.prisma.pricingInsight.findMany({
        take: input.limit,
        orderBy: [{ severity: "desc" }, { generatedAt: "desc" }],
      });

      return insights;
    }),

  // Get category performance
  getCategoryPerformance: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: {
        userId: ctx.user.id,
        isActive: true,
      },
      include: {
        salesData: {
          where: {
            periodStart: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
        },
      },
    });

    // Group by category
    type CategoryStats = { category: string; productCount: number; totalRevenue: number; totalUnits: number; avgMargin: number; marginCount: number };
    const categoryStats = products.reduce<Record<string, CategoryStats>>((acc: Record<string, CategoryStats>, product: typeof products[0]) => {
      const category = product.category || "Uncategorized";
      if (!acc[category]) {
        acc[category] = {
          category,
          productCount: 0,
          totalRevenue: 0,
          totalUnits: 0,
          avgMargin: 0,
          marginCount: 0,
        };
      }

      acc[category].productCount += 1;

      product.salesData.forEach((sale: typeof product.salesData[0]) => {
        acc[category].totalRevenue += Number(sale.revenue);
        acc[category].totalUnits += sale.unitsSold;
        if (sale.margin) {
          acc[category].avgMargin += Number(sale.margin);
          acc[category].marginCount += 1;
        }
      });

      return acc;
    }, {});

    // Calculate averages
    const performance = (Object.values(categoryStats) as CategoryStats[]).map((cat) => ({
      category: cat.category,
      productCount: cat.productCount,
      totalRevenue: cat.totalRevenue,
      totalUnits: cat.totalUnits,
      avgMargin: cat.marginCount > 0 ? cat.avgMargin / cat.marginCount : 0,
    }));

    return performance;
  }),

  // Get recent activity feed
  getRecentActivity: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const [recommendations, simulations, priceChanges] = await Promise.all([
        ctx.prisma.recommendation.findMany({
          where: { userId: ctx.user.id },
          take: input.limit / 3,
          orderBy: { generatedAt: "desc" },
          include: {
            product: {
              select: { name: true, sku: true },
            },
          },
        }),
        ctx.prisma.simulation.findMany({
          where: { userId: ctx.user.id },
          take: input.limit / 3,
          orderBy: { createdAt: "desc" },
        }),
        ctx.prisma.priceHistory.findMany({
          where: {
            product: {
              userId: ctx.user.id,
            },
          },
          take: input.limit / 3,
          orderBy: { createdAt: "desc" },
          include: {
            product: {
              select: { name: true, sku: true },
            },
          },
        }),
      ]);

      // Combine and sort by date
      const activities = [
        ...recommendations.map((r: typeof recommendations[0]) => ({
          type: "recommendation" as const,
          id: r.id,
          title: `New recommendation for ${r.product.name}`,
          description: `${r.priority} priority - ${r.status}`,
          timestamp: r.generatedAt,
        })),
        ...simulations.map((s: typeof simulations[0]) => ({
          type: "simulation" as const,
          id: s.id,
          title: s.name,
          description: `Simulation ${s.status.toLowerCase()}`,
          timestamp: s.createdAt,
        })),
        ...priceChanges.map((p: typeof priceChanges[0]) => ({
          type: "price_change" as const,
          id: p.id,
          title: `Price updated for ${p.product.name}`,
          description: p.changeReason || "Manual update",
          timestamp: p.createdAt,
        })),
      ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      return activities.slice(0, input.limit);
    }),
});

