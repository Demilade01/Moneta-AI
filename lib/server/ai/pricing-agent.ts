/**
 * Pricing Agent Workflow
 * Multi-agent system for generating pricing recommendations using LangGraph
 */

import { StateGraph, END } from "@langchain/langgraph";
import { openai, extractStructuredData } from "./openai-client";
import {
  SYSTEM_PROMPTS,
  createDataAnalysisPrompt,
  createMarketAnalysisPrompt,
  createPricingStrategyPrompt,
  createRecommendationPrompt,
  RECOMMENDATION_SCHEMA,
} from "./prompts";

// Define the state structure
interface PricingAgentState {
  productId: string;
  productName: string;
  currentPrice: number;
  costPrice: number;
  salesHistory: Array<{ date: string; quantity: number; revenue: number }>;
  priceHistory: Array<{ date: string; price: number }>;
  competitorPrices: Array<{ name: string; price: number }>;
  category: string;
  elasticity?: number;

  // Agent outputs
  dataInsights?: string;
  marketInsights?: string;
  strategyInsights?: string;

  // Final recommendation
  recommendation?: {
    recommendedPrice: number;
    confidenceScore: number;
    expectedRevenueImpact: number;
    expectedMarginImpact: number;
    reasoning: string;
    riskLevel: "low" | "medium" | "high";
    priority: "low" | "medium" | "high";
  };

  error?: string;
}

/**
 * Data Analyst Agent Node
 */
async function dataAnalystNode(state: PricingAgentState): Promise<Partial<PricingAgentState>> {
  try {
    const prompt = createDataAnalysisPrompt({
      productName: state.productName,
      currentPrice: state.currentPrice,
      costPrice: state.costPrice,
      salesHistory: state.salesHistory,
      priceHistory: state.priceHistory,
      elasticity: state.elasticity,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.dataAnalyst },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const dataInsights = response.choices[0]?.message?.content || "";

    return { dataInsights };
  } catch (error: any) {
    console.error("Data Analyst error:", error?.message || error);
    if (error?.code === "invalid_api_key" || error?.status === 401) {
      return { error: "Invalid or missing OpenAI API key. Please add OPENAI_API_KEY to your .env file." };
    }
    return { error: `Failed to analyze data: ${error?.message || "Unknown error"}` };
  }
}

/**
 * Market Analyst Agent Node
 */
async function marketAnalystNode(state: PricingAgentState): Promise<Partial<PricingAgentState>> {
  try {
    const prompt = createMarketAnalysisPrompt({
      productName: state.productName,
      currentPrice: state.currentPrice,
      competitorPrices: state.competitorPrices,
      category: state.category,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.marketAnalyst },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const marketInsights = response.choices[0]?.message?.content || "";

    return { marketInsights };
  } catch (error) {
    console.error("Market Analyst error:", error);
    return { error: "Failed to analyze market" };
  }
}

/**
 * Pricing Strategist Agent Node
 */
async function pricingStrategistNode(state: PricingAgentState): Promise<Partial<PricingAgentState>> {
  try {
    if (!state.dataInsights || !state.marketInsights) {
      return { error: "Missing required insights" };
    }

    const prompt = createPricingStrategyPrompt({
      productName: state.productName,
      currentPrice: state.currentPrice,
      costPrice: state.costPrice,
      dataInsights: state.dataInsights,
      marketInsights: state.marketInsights,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.pricingStrategist },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const strategyInsights = response.choices[0]?.message?.content || "";

    return { strategyInsights };
  } catch (error) {
    console.error("Pricing Strategist error:", error);
    return { error: "Failed to generate strategy" };
  }
}

/**
 * Recommendation Agent Node
 */
async function recommendationNode(state: PricingAgentState): Promise<Partial<PricingAgentState>> {
  try {
    if (!state.dataInsights || !state.marketInsights || !state.strategyInsights) {
      return { error: "Missing required insights" };
    }

    const prompt = createRecommendationPrompt({
      productName: state.productName,
      currentPrice: state.currentPrice,
      dataInsights: state.dataInsights,
      marketInsights: state.marketInsights,
      strategyInsights: state.strategyInsights,
    });

    const recommendation = await extractStructuredData<{
      recommendedPrice: number;
      confidenceScore: number;
      expectedRevenueImpact: number;
      expectedMarginImpact: number;
      reasoning: string;
      riskLevel: "low" | "medium" | "high";
      priority: "low" | "medium" | "high";
    }>(prompt, RECOMMENDATION_SCHEMA);

    if (!recommendation) {
      return { error: "Failed to generate recommendation" };
    }

    return { recommendation };
  } catch (error) {
    console.error("Recommendation Agent error:", error);
    return { error: "Failed to generate recommendation" };
  }
}

/**
 * Create and execute the pricing agent workflow
 */
export async function generatePricingRecommendation(
  input: Omit<PricingAgentState, "dataInsights" | "marketInsights" | "strategyInsights" | "recommendation">
): Promise<PricingAgentState> {
  // Execute agents sequentially (simplified approach)
  let state: PricingAgentState = {
    ...input,
    dataInsights: undefined,
    marketInsights: undefined,
    strategyInsights: undefined,
    recommendation: undefined,
    error: undefined,
  };

  // Step 1: Data Analyst
  const dataResult = await dataAnalystNode(state);
  if (dataResult.error) {
    return { ...state, error: dataResult.error };
  }
  state = { ...state, ...dataResult };

  // Step 2: Market Analyst
  const marketResult = await marketAnalystNode(state);
  if (marketResult.error) {
    return { ...state, error: marketResult.error };
  }
  state = { ...state, ...marketResult };

  // Step 3: Pricing Strategist
  const strategyResult = await pricingStrategistNode(state);
  if (strategyResult.error) {
    return { ...state, error: strategyResult.error };
  }
  state = { ...state, ...strategyResult };

  // Step 4: Recommendation Agent
  const recommendationResult = await recommendationNode(state);
  if (recommendationResult.error) {
    return { ...state, error: recommendationResult.error };
  }
  state = { ...state, ...recommendationResult };

  return state;
}

