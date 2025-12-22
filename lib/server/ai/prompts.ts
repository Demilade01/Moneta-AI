/**
 * AI Prompt Templates
 * Structured prompts for each agent in the workflow
 */

export const SYSTEM_PROMPTS = {
  dataAnalyst: `You are a Data Analyst specializing in pricing analytics and e-commerce data.

Your role:
- Analyze historical sales data and pricing patterns
- Identify trends, seasonality, and anomalies
- Calculate price elasticity and demand patterns
- Provide data-driven insights

Be objective, precise, and focus on quantifiable metrics.`,

  marketAnalyst: `You are a Market Analyst specializing in competitive pricing and market positioning.

Your role:
- Analyze competitor pricing strategies
- Identify market positioning opportunities
- Assess price competitiveness
- Evaluate market trends and dynamics

Be strategic, consider market context, and identify competitive advantages.`,

  pricingStrategist: `You are a Pricing Strategist with expertise in revenue optimization and pricing psychology.

Your role:
- Recommend optimal pricing strategies
- Balance revenue, margin, and market position
- Consider psychological pricing factors
- Evaluate risk vs. reward

Be strategic, consider business goals, and provide actionable recommendations.`,

  recommendationAgent: `You are a Pricing Recommendation Agent that synthesizes insights from multiple analysts.

Your role:
- Combine insights from data, market, and pricing analysis
- Generate clear, actionable pricing recommendations
- Provide confidence scores and reasoning
- Assess risks and expected outcomes

Be clear, concise, and provide well-reasoned recommendations with quantifiable impacts.`,
};

/**
 * Generate data analysis prompt
 */
export function createDataAnalysisPrompt(data: {
  productName: string;
  currentPrice: number;
  costPrice: number;
  salesHistory: Array<{ date: string; quantity: number; revenue: number }>;
  priceHistory: Array<{ date: string; price: number }>;
  elasticity?: number;
}): string {
  return `Analyze the following product data:

Product: ${data.productName}
Current Price: $${data.currentPrice}
Cost Price: $${data.costPrice}
Current Margin: ${(((data.currentPrice - data.costPrice) / data.currentPrice) * 100).toFixed(1)}%

Sales History (last ${data.salesHistory.length} periods):
${data.salesHistory.slice(0, 10).map((s) => `- ${s.date}: ${s.quantity} units, $${s.revenue} revenue`).join("\n")}

Price History:
${data.priceHistory.slice(0, 5).map((p) => `- ${p.date}: $${p.price}`).join("\n")}

${data.elasticity ? `Price Elasticity: ${data.elasticity.toFixed(2)}` : ""}

Provide insights on:
1. Sales trends and patterns
2. Price sensitivity
3. Optimal price range based on historical data
4. Key observations and anomalies`;
}

/**
 * Generate market analysis prompt
 */
export function createMarketAnalysisPrompt(data: {
  productName: string;
  currentPrice: number;
  competitorPrices: Array<{ name: string; price: number }>;
  category: string;
}): string {
  const avgCompetitorPrice =
    data.competitorPrices.reduce((sum, c) => sum + c.price, 0) /
    data.competitorPrices.length;
  const priceIndex = (data.currentPrice / avgCompetitorPrice) * 100;

  return `Analyze the market positioning for this product:

Product: ${data.productName}
Category: ${data.category}
Your Price: $${data.currentPrice}

Competitor Prices:
${data.competitorPrices.map((c) => `- ${c.name}: $${c.price}`).join("\n")}

Average Competitor Price: $${avgCompetitorPrice.toFixed(2)}
Price Index: ${priceIndex.toFixed(0)} (100 = market average)

Provide insights on:
1. Market positioning (premium/competitive/discount)
2. Competitive advantages or disadvantages
3. Pricing opportunities
4. Market trends and recommendations`;
}

/**
 * Generate pricing strategy prompt
 */
export function createPricingStrategyPrompt(data: {
  productName: string;
  currentPrice: number;
  costPrice: number;
  dataInsights: string;
  marketInsights: string;
  businessGoals?: string;
}): string {
  return `Based on the following analysis, recommend a pricing strategy:

Product: ${data.productName}
Current Price: $${data.currentPrice}
Cost Price: $${data.costPrice}

Data Analyst Insights:
${data.dataInsights}

Market Analyst Insights:
${data.marketInsights}

Business Goals: ${data.businessGoals || "Maximize revenue while maintaining healthy margins"}

Recommend:
1. Optimal price point
2. Expected impact on revenue and margin
3. Pricing strategy rationale
4. Risk assessment
5. Implementation timeline`;
}

/**
 * Generate final recommendation prompt
 */
export function createRecommendationPrompt(data: {
  productName: string;
  currentPrice: number;
  dataInsights: string;
  marketInsights: string;
  strategyInsights: string;
}): string {
  return `Synthesize the following analysis into a clear pricing recommendation:

Product: ${data.productName}
Current Price: $${data.currentPrice}

Data Analysis:
${data.dataInsights}

Market Analysis:
${data.marketInsights}

Pricing Strategy:
${data.strategyInsights}

Generate a structured recommendation with:
1. Recommended price (specific number)
2. Confidence score (0-100)
3. Expected revenue impact (% change)
4. Expected margin impact (% change)
5. Clear reasoning (2-3 sentences)
6. Risk level (low/medium/high)
7. Implementation priority (low/medium/high)

Format your response as JSON.`;
}

/**
 * Recommendation schema for function calling
 */
export const RECOMMENDATION_SCHEMA = {
  name: "generate_pricing_recommendation",
  description: "Generate a structured pricing recommendation",
  parameters: {
    type: "object",
    properties: {
      recommendedPrice: {
        type: "number",
        description: "The recommended price for the product",
      },
      confidenceScore: {
        type: "number",
        description: "Confidence score from 0-100",
      },
      expectedRevenueImpact: {
        type: "number",
        description: "Expected revenue change in percentage",
      },
      expectedMarginImpact: {
        type: "number",
        description: "Expected margin change in percentage",
      },
      reasoning: {
        type: "string",
        description: "Clear explanation of the recommendation",
      },
      riskLevel: {
        type: "string",
        enum: ["low", "medium", "high"],
        description: "Risk level of implementing this recommendation",
      },
      priority: {
        type: "string",
        enum: ["low", "medium", "high"],
        description: "Implementation priority",
      },
    },
    required: [
      "recommendedPrice",
      "confidenceScore",
      "expectedRevenueImpact",
      "expectedMarginImpact",
      "reasoning",
      "riskLevel",
      "priority",
    ],
  },
};

