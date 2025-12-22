# AI Agent Setup Guide

## Overview

Moneta AI uses a multi-agent system powered by **LangGraph** and **OpenAI GPT-4** to generate intelligent pricing recommendations.

## Architecture

### Multi-Agent Workflow

The system uses 4 specialized AI agents that work **sequentially** in a pipeline:

```
Input → Data Analyst → Market Analyst → Pricing Strategist → Recommendation Agent → Output
```

Each agent receives the output from the previous agent and builds upon it, creating a comprehensive analysis.

#### 1. **Data Analyst Agent**
- Analyzes historical sales data and pricing patterns
- Calculates price elasticity and demand trends
- Identifies seasonality and anomalies
- Provides quantifiable insights

#### 2. **Market Analyst Agent**
- Evaluates competitor pricing strategies
- Assesses market positioning (premium/competitive/discount)
- Identifies competitive advantages
- Analyzes market dynamics

#### 3. **Pricing Strategist Agent**
- Recommends optimal pricing strategies
- Balances revenue, margin, and market position
- Considers psychological pricing factors
- Evaluates risk vs. reward

#### 4. **Recommendation Agent**
- Synthesizes insights from all analysts
- Generates structured pricing recommendations
- Provides confidence scores and reasoning
- Assesses expected outcomes and risks

## Setup Instructions

### 1. Install Dependencies

All required packages are already in `package.json`:

```bash
npm install
```

Key dependencies:
- `openai` - OpenAI API client
- `langchain` - LangChain core
- `@langchain/langgraph` - Multi-agent workflows
- `@langchain/openai` - OpenAI integration

### 2. Configure OpenAI API Key

Add your OpenAI API key to `.env`:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Get your API key:** https://platform.openai.com/api-keys

### 3. Database Requirements

The AI agent requires the following data to generate recommendations:

- **Sales Data**: At least 5 historical data points per product
- **Price History**: Historical price changes
- **Competitor Data**: Competitor pricing (optional but recommended)

Upload data via the **Data Upload** page in the dashboard.

## How It Works

### 1. Generate a Recommendation

From the **Recommendations** page:

1. Select a product from the dropdown
2. Click "Generate" button
3. AI agents analyze the data (takes 10-30 seconds)
4. Review the generated recommendation

### 2. Recommendation Output

Each recommendation includes:

- **Recommended Price**: Specific price point
- **Confidence Score**: 0-100 (higher = more confident)
- **Revenue Impact**: Expected % change in revenue
- **Margin Impact**: Expected % change in profit margin
- **Reasoning**: Clear explanation of the recommendation
- **Risk Level**: Low, Medium, or High
- **Priority**: Implementation priority

### 3. Take Action

- **Implement**: Apply the recommended price to the product
- **Accept**: Mark as accepted for later implementation
- **Reject**: Dismiss the recommendation

## Technical Details

### File Structure

```
lib/server/ai/
├── openai-client.ts      # OpenAI API configuration
├── prompts.ts            # Prompt templates for each agent
└── pricing-agent.ts      # LangGraph workflow definition
```

### API Endpoint

```typescript
// Generate recommendation
trpc.recommendations.generate.useMutation({
  productId: "product-id"
})

// Returns:
{
  recommendation: {
    recommendedPrice: number,
    confidenceScore: number,
    expectedRevenueImpact: number,
    expectedMarginImpact: number,
    reasoning: string,
    riskLevel: "low" | "medium" | "high",
    priority: "low" | "medium" | "high"
  },
  insights: {
    dataInsights: string,
    marketInsights: string,
    strategyInsights: string
  }
}
```

### State Management

The workflow uses a typed state object that flows through all agents:

```typescript
interface PricingAgentState {
  productId: string;
  productName: string;
  currentPrice: number;
  costPrice: number;
  salesHistory: Array<...>;
  priceHistory: Array<...>;
  competitorPrices: Array<...>;
  category: string;

  // Agent outputs
  dataInsights?: string;
  marketInsights?: string;
  strategyInsights?: string;
  recommendation?: {...};
}
```

## Customization

### Adjust AI Behavior

Edit `lib/server/ai/openai-client.ts`:

```typescript
export const AI_CONFIG = {
  model: "gpt-4o",        // Change model
  temperature: 0.7,       // 0 = deterministic, 1 = creative
  maxTokens: 2000,        // Response length
};
```

### Modify Prompts

Edit `lib/server/ai/prompts.ts` to customize how each agent thinks and responds.

### Add New Agents

Extend `lib/server/ai/pricing-agent.ts`:

1. Create a new agent node function
2. Add it to the workflow graph
3. Define edges to connect it

## Cost Estimation

**Per recommendation:**
- ~4 API calls (one per agent)
- ~3,000-5,000 tokens total
- **Cost**: ~$0.03-$0.05 per recommendation (GPT-4o)

**Monthly estimate:**
- 100 recommendations/month = ~$3-$5
- 1,000 recommendations/month = ~$30-$50

## Troubleshooting

### "Not enough sales data"

**Solution**: Upload at least 5 sales data points for the product.

### "Failed to generate recommendation"

**Possible causes:**
1. Invalid OpenAI API key
2. Insufficient API credits
3. Rate limiting

**Check:**
```bash
# Verify API key is set
echo $OPENAI_API_KEY

# Check server logs for detailed errors
npm run dev
```

### Slow generation

**Expected**: 10-30 seconds per recommendation
**Why**: 4 sequential AI calls with complex analysis

**Optimization**: Future versions will implement parallel processing where possible.

## Best Practices

1. **Data Quality**: More historical data = better recommendations
2. **Regular Updates**: Upload fresh sales/competitor data regularly
3. **Review Reasoning**: Always read the AI's reasoning before implementing
4. **Track Results**: Monitor actual outcomes vs. predicted impacts
5. **Iterate**: Reject recommendations that don't align with business goals

## Future Enhancements

- [ ] Streaming responses for real-time feedback
- [ ] Batch recommendation generation
- [ ] Custom business rules and constraints
- [ ] A/B testing integration
- [ ] Learning from past recommendation outcomes
- [ ] Multi-product optimization
- [ ] Seasonal adjustment factors

## Support

For issues or questions:
1. Check server logs for detailed error messages
2. Verify data requirements are met
3. Test with different products
4. Review OpenAI API status: https://status.openai.com/

---

**Built with:**
- OpenAI GPT-4o
- LangChain & LangGraph
- TypeScript
- tRPC

