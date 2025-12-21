/**
 * Analytics Utilities
 * Statistical calculations for pricing intelligence
 */

import { Prisma } from "@/lib/generated/prisma/client";

/**
 * Calculate price elasticity of demand (PED)
 * PED = (% Change in Quantity) / (% Change in Price)
 */
export function calculatePriceElasticity(
  oldPrice: number,
  newPrice: number,
  oldQuantity: number,
  newQuantity: number
): number {
  if (oldPrice === 0 || oldQuantity === 0) return 0;

  const priceChange = ((newPrice - oldPrice) / oldPrice) * 100;
  const quantityChange = ((newQuantity - oldQuantity) / oldQuantity) * 100;

  if (priceChange === 0) return 0;

  return quantityChange / priceChange;
}

/**
 * Calculate profit margin percentage
 * Margin = ((Price - Cost) / Price) * 100
 */
export function calculateMargin(price: number, cost: number): number {
  if (price === 0) return 0;
  return ((price - cost) / price) * 100;
}

/**
 * Calculate markup percentage
 * Markup = ((Price - Cost) / Cost) * 100
 */
export function calculateMarkup(price: number, cost: number): number {
  if (cost === 0) return 0;
  return ((price - cost) / cost) * 100;
}

/**
 * Calculate optimal price based on elasticity
 * Optimal Price = Cost / (1 + (1 / PED))
 */
export function calculateOptimalPrice(
  cost: number,
  elasticity: number
): number {
  if (elasticity >= 0 || elasticity === -1) return cost * 1.5; // Default 50% markup
  return cost / (1 + 1 / elasticity);
}

/**
 * Calculate revenue impact of price change
 */
export function calculateRevenueImpact(
  currentPrice: number,
  newPrice: number,
  currentQuantity: number,
  elasticity: number
): {
  currentRevenue: number;
  projectedRevenue: number;
  revenueChange: number;
  percentChange: number;
} {
  const priceChangePercent = ((newPrice - currentPrice) / currentPrice) * 100;
  const quantityChangePercent = elasticity * priceChangePercent;
  const projectedQuantity =
    currentQuantity * (1 + quantityChangePercent / 100);

  const currentRevenue = currentPrice * currentQuantity;
  const projectedRevenue = newPrice * projectedQuantity;
  const revenueChange = projectedRevenue - currentRevenue;
  const percentChange = (revenueChange / currentRevenue) * 100;

  return {
    currentRevenue,
    projectedRevenue,
    revenueChange,
    percentChange,
  };
}

/**
 * Calculate price index (your price vs competitor average)
 * Index = (Your Price / Avg Competitor Price) * 100
 * 100 = at market, >100 = premium, <100 = discount
 */
export function calculatePriceIndex(
  yourPrice: number,
  competitorPrices: number[]
): number {
  if (competitorPrices.length === 0) return 100;

  const avgCompetitorPrice =
    competitorPrices.reduce((sum, p) => sum + p, 0) / competitorPrices.length;

  if (avgCompetitorPrice === 0) return 100;

  return (yourPrice / avgCompetitorPrice) * 100;
}

/**
 * Calculate price positioning
 */
export function getPricePositioning(priceIndex: number): {
  position: "premium" | "competitive" | "discount" | "underpriced";
  description: string;
} {
  if (priceIndex > 115) {
    return {
      position: "premium",
      description: "Priced significantly above market average",
    };
  } else if (priceIndex > 95) {
    return {
      position: "competitive",
      description: "Priced at market average",
    };
  } else if (priceIndex > 80) {
    return {
      position: "discount",
      description: "Priced below market average",
    };
  } else {
    return {
      position: "underpriced",
      description: "Priced significantly below market",
    };
  }
}

/**
 * Calculate moving average
 */
export function calculateMovingAverage(
  data: number[],
  windowSize: number
): number[] {
  const result: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = data.slice(start, i + 1);
    const avg = window.reduce((sum, val) => sum + val, 0) / window.length;
    result.push(avg);
  }

  return result;
}

/**
 * Calculate growth rate
 */
export function calculateGrowthRate(oldValue: number, newValue: number): number {
  if (oldValue === 0) return 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Analyze sales trends
 */
export function analyzeTrend(data: number[]): {
  trend: "increasing" | "decreasing" | "stable";
  strength: number; // 0-100
  slope: number;
} {
  if (data.length < 2) {
    return { trend: "stable", strength: 0, slope: 0 };
  }

  // Simple linear regression
  const n = data.length;
  const xSum = (n * (n - 1)) / 2; // Sum of indices
  const ySum = data.reduce((sum, val) => sum + val, 0);
  const xySum = data.reduce((sum, val, idx) => sum + idx * val, 0);
  const xSquareSum = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * xySum - xSum * ySum) / (n * xSquareSum - xSum * xSum);

  // Calculate R-squared for strength
  const yMean = ySum / n;
  const ssTotal = data.reduce((sum, val) => sum + Math.pow(val - yMean, 2), 0);
  const ssResidual = data.reduce(
    (sum, val, idx) => sum + Math.pow(val - (slope * idx + yMean), 2),
    0
  );
  const rSquared = 1 - ssResidual / ssTotal;
  const strength = Math.abs(rSquared) * 100;

  let trend: "increasing" | "decreasing" | "stable";
  if (Math.abs(slope) < 0.01) {
    trend = "stable";
  } else if (slope > 0) {
    trend = "increasing";
  } else {
    trend = "decreasing";
  }

  return { trend, strength, slope };
}

/**
 * Calculate confidence score for recommendation
 */
export function calculateConfidenceScore(factors: {
  dataPoints: number; // Number of historical data points
  elasticityReliability: number; // 0-1
  competitorDataAvailable: boolean;
  recentPriceChanges: number; // Number of recent price changes
  salesVariability: number; // Coefficient of variation
}): number {
  let score = 50; // Base score

  // More data points = higher confidence
  if (factors.dataPoints > 100) score += 20;
  else if (factors.dataPoints > 50) score += 15;
  else if (factors.dataPoints > 20) score += 10;
  else if (factors.dataPoints > 10) score += 5;

  // Elasticity reliability
  score += factors.elasticityReliability * 15;

  // Competitor data availability
  if (factors.competitorDataAvailable) score += 10;

  // Recent price changes (more = less confidence)
  if (factors.recentPriceChanges === 0) score += 5;
  else if (factors.recentPriceChanges > 3) score -= 10;

  // Sales variability (lower = higher confidence)
  if (factors.salesVariability < 0.2) score += 10;
  else if (factors.salesVariability > 0.5) score -= 10;

  return Math.max(0, Math.min(100, score));
}

/**
 * Detect seasonality in sales data
 */
export function detectSeasonality(
  data: { date: Date; value: number }[]
): {
  hasSeasonality: boolean;
  pattern: "weekly" | "monthly" | "quarterly" | "none";
  strength: number;
} {
  if (data.length < 14) {
    return { hasSeasonality: false, pattern: "none", strength: 0 };
  }

  // Group by day of week
  const dayOfWeekData: number[][] = Array(7)
    .fill(0)
    .map(() => []);
  data.forEach((d) => {
    const dayOfWeek = d.date.getDay();
    dayOfWeekData[dayOfWeek].push(d.value);
  });

  // Calculate variance between days
  const dayAverages = dayOfWeekData.map((days) =>
    days.length > 0 ? days.reduce((sum, v) => sum + v, 0) / days.length : 0
  );
  const overallAvg =
    dayAverages.reduce((sum, v) => sum + v, 0) / dayAverages.length;
  const variance =
    dayAverages.reduce((sum, v) => sum + Math.pow(v - overallAvg, 2), 0) / 7;
  const coefficientOfVariation = Math.sqrt(variance) / overallAvg;

  if (coefficientOfVariation > 0.3) {
    return {
      hasSeasonality: true,
      pattern: "weekly",
      strength: Math.min(100, coefficientOfVariation * 100),
    };
  }

  return { hasSeasonality: false, pattern: "none", strength: 0 };
}

/**
 * Calculate product performance score
 */
export function calculatePerformanceScore(metrics: {
  margin: number; // Profit margin %
  revenueGrowth: number; // % growth
  salesVolume: number; // Units sold
  priceCompetitiveness: number; // Price index
}): {
  score: number; // 0-100
  grade: "A" | "B" | "C" | "D" | "F";
  strengths: string[];
  weaknesses: string[];
} {
  let score = 0;
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  // Margin (30 points)
  if (metrics.margin > 50) {
    score += 30;
    strengths.push("Excellent profit margin");
  } else if (metrics.margin > 30) {
    score += 25;
    strengths.push("Good profit margin");
  } else if (metrics.margin > 20) {
    score += 20;
  } else if (metrics.margin > 10) {
    score += 10;
    weaknesses.push("Low profit margin");
  } else {
    weaknesses.push("Very low profit margin");
  }

  // Revenue growth (30 points)
  if (metrics.revenueGrowth > 20) {
    score += 30;
    strengths.push("Strong revenue growth");
  } else if (metrics.revenueGrowth > 10) {
    score += 25;
    strengths.push("Positive revenue growth");
  } else if (metrics.revenueGrowth > 0) {
    score += 15;
  } else if (metrics.revenueGrowth > -10) {
    score += 5;
    weaknesses.push("Declining revenue");
  } else {
    weaknesses.push("Significant revenue decline");
  }

  // Sales volume (20 points)
  if (metrics.salesVolume > 1000) {
    score += 20;
    strengths.push("High sales volume");
  } else if (metrics.salesVolume > 500) {
    score += 15;
  } else if (metrics.salesVolume > 100) {
    score += 10;
  } else if (metrics.salesVolume > 10) {
    score += 5;
  } else {
    weaknesses.push("Low sales volume");
  }

  // Price competitiveness (20 points)
  if (metrics.priceCompetitiveness >= 95 && metrics.priceCompetitiveness <= 105) {
    score += 20;
    strengths.push("Competitively priced");
  } else if (metrics.priceCompetitiveness >= 85 && metrics.priceCompetitiveness <= 115) {
    score += 15;
  } else if (metrics.priceCompetitiveness > 115) {
    score += 10;
    weaknesses.push("Priced above market");
  } else {
    score += 5;
    weaknesses.push("Priced below market");
  }

  let grade: "A" | "B" | "C" | "D" | "F";
  if (score >= 90) grade = "A";
  else if (score >= 80) grade = "B";
  else if (score >= 70) grade = "C";
  else if (score >= 60) grade = "D";
  else grade = "F";

  return { score, grade, strengths, weaknesses };
}

