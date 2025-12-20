# Moneta AI

**Intelligent Pricing Analyst for Data-Driven Decisions**

Moneta AI is an intelligent pricing analyst designed to help businesses make confident, data-driven pricing decisions. The system ingests internal pricing, cost, and sales data alongside external market and competitor signals, then analyzes historical patterns to understand how price changes impact demand, revenue, and margins.

## Features

- **Data Ingestion**: Import pricing, cost, sales, and competitor data from multiple sources
- **Historical Analysis**: Understand how past price changes impacted business metrics
- **What-If Simulations**: Test pricing scenarios before implementation
- **AI-Powered Recommendations**: Get explainable price recommendations with confidence scores
- **Risk Assessment**: Understand potential risks of pricing changes
- **Transparent Decisions**: Every recommendation backed by data and reasoning

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TailwindCSS 4, shadcn/ui, Radix UI
- **AI/Agents**: LangChain, LangGraph, OpenAI
- **API**: tRPC for type-safe APIs
- **Database**: Prisma ORM
- **Data Visualization**: Recharts
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation

## Getting Started

### Prerequisites

- Node.js 20+
- npm/yarn/pnpm

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
moneta-ai/
├── app/              # Next.js App Router pages
├── components/       # React components
│   └── ui/          # shadcn UI components
├── lib/             # Utilities and helpers
├── server/          # tRPC routers and server logic
├── prisma/          # Database schema
└── public/          # Static assets
```

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="your-database-url"

# OpenAI
OPENAI_API_KEY="your-openai-api-key"

# Optional: LangSmith (for debugging)
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY="your-langsmith-api-key"
```

## License

Private - All Rights Reserved
