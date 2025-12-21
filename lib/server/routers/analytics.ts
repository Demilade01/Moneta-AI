/**
 * Analytics Router
 * Handles dashboard analytics and insights
 */

import { z } from "zod";
import { router, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";

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

  // Get product-level analytics with elasticity
  getProductAnalytics: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.prisma.product.findUnique({
        where: { id: input.productId },
        include: {
          priceHistory: {
            orderBy: { effectiveDate: "desc" },
            take: 10,
          },
          salesData: {
            orderBy: { periodStart: "desc" },
            take: 90, // Last 90 periods
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

      // Calculate elasticity if we have enough data
      let elasticity = null;
      if (product.priceHistory.length >= 2 && product.salesData.length >= 2) {
        const recentPriceChange = product.priceHistory[0];
        const previousPrice = product.priceHistory[1];

        // Get sales before and after price change
        const salesAfter = product.salesData.filter(
          (s) => s.periodStart >= recentPriceChange.effectiveDate
        );
        const salesBefore = product.salesData.filter(
          (s) => s.periodStart < recentPriceChange.effectiveDate
        );

        if (salesAfter.length > 0 && salesBefore.length > 0) {
          const avgSalesAfter =
            salesAfter.reduce((sum, s) => sum + s.unitsSold, 0) / salesAfter.length;
          const avgSalesBefore =
            salesBefore.reduce((sum, s) => sum + s.unitsSold, 0) / salesBefore.length;

          const { calculatePriceElasticity } = await import("../utils/analytics");
          elasticity = calculatePriceElasticity(
            Number(previousPrice.price),
            Number(recentPriceChange.price),
            avgSalesBefore,
            avgSalesAfter
          );
        }
      }

      // Calculate margin
      const { calculateMargin } = await import("../utils/analytics");
      const margin = calculateMargin(
        Number(product.currentPrice),
        Number(product.costPrice)
      );

      // Calculate revenue trend
      const revenueData = product.salesData.map((s) => ({
        date: s.periodStart,
        revenue: Number(s.revenue),
      }));

      return {
        product,
        elasticity,
        margin,
        revenueData,
        competitorPrices: product.competitorData.map((c) => ({
          name: c.competitorName,
          price: Number(c.competitorPrice),
          date: c.scrapedAt,
        })),
      };
    }),

  // Get competitor comparison
  getCompetitorComparison: protectedProcedure.query(async ({ ctx }) => {
    const products = await ctx.prisma.product.findMany({
      where: { userId: ctx.user.id },
      include: {
        competitorData: {
          orderBy: { scrapedAt: "desc" },
          take: 5,
        },
      },
    });

    const { calculatePriceIndex, getPricePositioning } = await import(
      "../utils/analytics"
    );

    const comparison = products
      .filter((p) => p.competitorData.length > 0)
      .map((product) => {
        const competitorPrices = product.competitorData.map((c) =>
          Number(c.competitorPrice)
        );
        const priceIndex = calculatePriceIndex(
          Number(product.currentPrice),
          competitorPrices
        );
        const positioning = getPricePositioning(priceIndex);

        const avgCompetitorPrice =
          competitorPrices.reduce((sum, p) => sum + p, 0) /
          competitorPrices.length;
        const priceDiff = Number(product.currentPrice) - avgCompetitorPrice;

        return {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          yourPrice: Number(product.currentPrice),
          avgCompetitorPrice,
          priceDiff,
          priceIndex,
          positioning: positioning.position,
          description: positioning.description,
          competitorCount: product.competitorData.length,
        };
      });

    return comparison;
  }),

  // Get revenue analytics with trends
  getRevenueAnalytics: protectedProcedure
    .input(
      z.object({
        period: z.enum(["7d", "30d", "90d", "1y"]).default("30d"),
      })
    )
    .query(async ({ ctx, input }) => {
      const days = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
        "1y": 365,
      }[input.period];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const salesData = await ctx.prisma.salesData.findMany({
        where: {
          product: {
            userId: ctx.user.id,
          },
          periodStart: {
            gte: startDate,
          },
        },
        include: {
          product: {
            select: {
              name: true,
              category: true,
            },
          },
        },
        orderBy: {
          periodStart: "asc",
        },
      });

      // Group by date
      interface DayData {
        date: string;
        revenue: number;
        units: number;
      }

      const dailyData = salesData.reduce((acc: Record<string, DayData>, sale) => {
        const dateKey = sale.periodStart.toISOString().split("T")[0];
        if (!acc[dateKey]) {
          acc[dateKey] = { date: dateKey, revenue: 0, units: 0 };
        }
        acc[dateKey].revenue += Number(sale.revenue);
        acc[dateKey].units += sale.unitsSold;
        return acc;
      }, {});

      const timeSeriesData = Object.values(dailyData).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // Calculate trend
      const { analyzeTrend, calculateGrowthRate } = await import(
        "../utils/analytics"
      );
      const revenueValues = timeSeriesData.map((d) => d.revenue);
      const trend = analyzeTrend(revenueValues);

      // Calculate growth rate
      const firstWeekRevenue = revenueValues.slice(0, 7).reduce((sum, v) => sum + v, 0);
      const lastWeekRevenue = revenueValues.slice(-7).reduce((sum, v) => sum + v, 0);
      const growthRate = calculateGrowthRate(firstWeekRevenue, lastWeekRevenue);

      // Category breakdown
      interface CategoryStats {
        category: string;
        revenue: number;
        units: number;
      }

      const categoryData = salesData.reduce((acc: Record<string, CategoryStats>, sale) => {
        const category = sale.product.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = { category, revenue: 0, units: 0 };
        }
        acc[category].revenue += Number(sale.revenue);
        acc[category].units += sale.unitsSold;
        return acc;
      }, {});

      return {
        timeSeriesData,
        trend,
        growthRate,
        categoryBreakdown: Object.values(categoryData).sort(
          (a, b) => b.revenue - a.revenue
        ),
        totalRevenue: revenueValues.reduce((sum, v) => sum + v, 0),
        totalUnits: timeSeriesData.reduce((sum, d) => sum + d.units, 0),
      };
    }),

  // Get top/bottom performers
  getProductPerformance: protectedProcedure
    .input(
      z.object({
        period: z.enum(["7d", "30d", "90d"]).default("30d"),
        sortBy: z.enum(["revenue", "margin", "units"]).default("revenue"),
        limit: z.number().min(1).max(50).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const days = {
        "7d": 7,
        "30d": 30,
        "90d": 90,
      }[input.period];

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const products = await ctx.prisma.product.findMany({
        where: { userId: ctx.user.id },
        include: {
          salesData: {
            where: {
              periodStart: {
                gte: startDate,
              },
            },
          },
        },
      });

      const { calculateMargin, calculatePerformanceScore } = await import(
        "../utils/analytics"
      );

      const performance = products.map((product) => {
        const totalRevenue = product.salesData.reduce(
          (sum, s) => sum + Number(s.revenue),
          0
        );
        const totalUnits = product.salesData.reduce(
          (sum, s) => sum + s.unitsSold,
          0
        );
        const margin = calculateMargin(
          Number(product.currentPrice),
          Number(product.costPrice)
        );

        const score = calculatePerformanceScore({
          margin,
          revenueGrowth: 0, // TODO: Calculate from historical data
          salesVolume: totalUnits,
          priceCompetitiveness: 100, // TODO: Calculate from competitor data
        });

        return {
          productId: product.id,
          productName: product.name,
          sku: product.sku,
          category: product.category,
          revenue: totalRevenue,
          units: totalUnits,
          margin,
          performanceScore: score.score,
          grade: score.grade,
        };
      });

      // Sort based on input
      const sorted = performance.sort((a, b) => {
        if (input.sortBy === "revenue") return b.revenue - a.revenue;
        if (input.sortBy === "margin") return b.margin - a.margin;
        return b.units - a.units;
      });

      return {
        topPerformers: sorted.slice(0, input.limit),
        bottomPerformers: sorted.slice(-input.limit).reverse(),
      };
    }),
});

