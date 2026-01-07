# Moneta AI

[![Moneta AI](./public/screenshot.png)](https://moneta-ai-gamma.vercel.app/)

**Your Intelligent Pricing Analyst**

> Make confident, data-driven pricing decisions with AI-powered analysis, simulations, and explainable recommendations. No black boxes. Just clarity.

🌐 **Live Demo**: [https://moneta-ai-gamma.vercel.app/](https://moneta-ai-gamma.vercel.app/)

---

Moneta AI is an intelligent pricing analyst designed to help businesses make confident, data-driven pricing decisions. The system ingests internal pricing, cost, and sales data alongside external market and competitor signals, then analyzes historical patterns to understand how price changes impact demand, revenue, and margins.

## ✨ Key Features

- 🤖 **Multi-Agent AI System** - 4 specialized AI agents (Data Analyst, Market Analyst, Pricing Strategist, Recommendation Agent) work together using LangGraph
- 🧠 **GPT-4 Powered** - Advanced reasoning with OpenAI GPT-4o for intelligent pricing decisions
- 📊 **Pricing Analytics Engine** - Price elasticity, competitor analysis, revenue trends, and margin optimization
- 💡 **Smart Recommendations** - AI-generated pricing suggestions with confidence scores, impact projections, and clear reasoning
- 📈 **Interactive Dashboards** - Real-time visualizations with Recharts for revenue trends, category performance, and competitor comparison
- 📤 **Data Upload System** - Drag-and-drop CSV/Excel files with automatic column mapping and validation
- 🔍 **Explainable AI** - Full transparency with detailed reasoning for every recommendation
- 🛡️ **Full Auditability** - Every decision logged and traceable
- 👤 **User Profile Management** - Avatar upload, profile settings, and password management
- 🔐 **Secure Authentication** - JWT-based auth with HTTP-only cookies and protected routes

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **Styling**: TailwindCSS 4, shadcn/ui, Radix UI
- **Animations**: Framer Motion + GSAP
- **AI/Agents**: LangChain, LangGraph, OpenAI
- **API**: tRPC for type-safe APIs
- **Database**: Prisma ORM + PostgreSQL
- **Data Visualization**: Recharts + TanStack Table
- **State Management**: TanStack Query
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **File Parsing**: PapaParse (CSV) + xlsx (Excel)
- **Notifications**: Sonner (toast notifications)
- **Deployment**: Vercel

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

# Add required environment variables to .env:
# DATABASE_URL=your-postgres-connection-string
# JWT_SECRET=your-jwt-secret-key
# OPENAI_API_KEY=your-openai-api-key

# Initialize database
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database (dev)
# OR
npm run db:migrate     # Create migration (production)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key for AI agents | ✅ Yes |

**Get OpenAI API Key**: https://platform.openai.com/api-keys

### AI Setup

See [AI_SETUP.md](./AI_SETUP.md) for detailed information about:
- Multi-agent architecture
- How the AI workflow works
- Customization options
- Cost estimation
- Troubleshooting

## 🗄️ Database Schema

The application uses PostgreSQL with Prisma ORM. The schema includes 11 models:

### Core Models
- **User** - User accounts with authentication, roles, and profile (including avatar)
- **Product** - Product catalog with SKU, pricing, and categorization
- **PriceHistory** - Historical price changes tracking
- **SalesData** - Sales performance metrics by time period
- **CompetitorData** - Competitor pricing and market signals

### AI & Analytics Models
- **Recommendation** - AI-generated pricing recommendations with reasoning, confidence scores, and impact projections
- **Simulation** - Price simulation scenarios (what-if analysis)
- **SimulationItem** - Products included in a simulation
- **SimulationResult** - Projected outcomes from simulations
- **PricingInsight** - Automated insights and alerts

### Data Management
- **DataUpload** - File upload tracking and processing status

All models include proper indexing, relationships, and cascade deletion rules. See `prisma/schema.prisma` for full details.

## 📁 Project Structure

```
moneta-ai/
├── app/                           # Next.js App Router
│   ├── actions/                   # Server actions
│   │   └── auth.ts               # Authentication actions
│   ├── api/                       # API routes
│   │   └── trpc/                 # tRPC API endpoint
│   │       └── [trpc]/
│   │           └── route.ts
│   ├── auth/                      # Authentication pages
│   │   ├── login/                # Login page
│   │   └── signup/               # Sign up page
│   ├── dashboard/                 # Dashboard pages
│   │   ├── analytics/           # Analytics page
│   │   ├── data/                 # Data upload page
│   │   ├── pricing/              # Pricing analysis page
│   │   ├── recommendations/      # AI recommendations page
│   │   ├── settings/             # User settings page
│   │   ├── simulations/          # Price simulations page
│   │   ├── layout.tsx            # Dashboard layout
│   │   └── page.tsx              # Dashboard overview
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css                # Global styles
├── components/
│   ├── charts/                    # Chart components
│   │   ├── category-breakdown-chart.tsx
│   │   ├── competitor-comparison-chart.tsx
│   │   └── revenue-trend-chart.tsx
│   ├── dashboard/                 # Dashboard components
│   │   ├── header.tsx            # Dashboard header
│   │   └── sidebar.tsx           # Dashboard sidebar
│   ├── providers/                 # React providers
│   │   └── trpc-provider.tsx     # tRPC provider
│   ├── sections/                  # Landing page sections
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── how-it-works.tsx
│   │   ├── analytics-preview.tsx
│   │   ├── trust.tsx
│   │   ├── cta.tsx
│   │   ├── footer.tsx
│   │   └── animated-background.tsx
│   └── ui/                        # shadcn UI components
├── lib/
│   ├── client/                    # Client-side utilities
│   │   ├── auth.tsx              # Auth hooks and utilities
│   │   ├── trpc.ts               # tRPC client setup
│   │   └── trpc-usage-example.tsx
│   ├── generated/                 # Generated code
│   │   └── prisma/               # Generated Prisma client
│   ├── server/                    # Server-side code
│   │   ├── ai/                   # AI agent system
│   │   │   ├── openai-client.ts
│   │   │   ├── pricing-agent.ts  # Multi-agent pricing system
│   │   │   └── prompts.ts        # AI prompts
│   │   ├── routers/              # tRPC routers
│   │   │   ├── _app.ts          # Main app router
│   │   │   ├── analytics.ts     # Analytics router
│   │   │   ├── auth.ts          # Authentication router
│   │   │   ├── products.ts      # Products router
│   │   │   ├── recommendations.ts # Recommendations router
│   │   │   ├── simulations.ts   # Simulations router
│   │   │   └── upload.ts        # File upload router
│   │   ├── utils/                # Server utilities
│   │   │   ├── analytics.ts     # Analytics calculations
│   │   │   ├── data-validator.ts # Data validation
│   │   │   └── file-parser.ts   # CSV/Excel parsing
│   │   ├── auth.ts               # Auth utilities
│   │   ├── context.ts            # tRPC context
│   │   └── trpc.ts               # tRPC setup
│   ├── prisma.ts                  # Prisma client instance
│   └── utils.ts                   # Shared utilities
├── prisma/
│   └── schema.prisma              # Database schema
├── public/                        # Static assets
├── sample-data/                   # Sample CSV files for testing
│   ├── competitor-data.csv
│   ├── products.csv
│   └── sales-data.csv
├── middleware.ts                  # Next.js middleware
├── components.json                # shadcn/ui config
└── package.json                   # Dependencies
```

## 🎨 Design System

Moneta AI uses a premium **glassmorphism design language**:

- **Pure Black & White** color palette
- **Semi-transparent glass cards** with backdrop blur
- **Subtle animations** (slow, smooth, intentional)
- **Animated backgrounds** with gentle glows
- **Modern fintech aesthetic** - calm, confident, premium

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

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema changes (dev)
npm run db:migrate     # Create migration (production)
npm run db:studio      # Open Prisma Studio (database GUI)
```


## 🗺️ Roadmap

### ✅ Phase 1: UI & Design (Complete)
- [x] Premium glassmorphism design system
- [x] Landing page with 6 sections
- [x] Responsive mobile navigation
- [x] Authentication pages (login/signup)
- [x] Dashboard layout with sidebar
- [x] All priority 1 dashboard pages

### ✅ Phase 2: Backend & Database (Complete)
- [x] Prisma 7 schema with 11 models
- [x] PostgreSQL database setup
- [x] tRPC API layer with 6 routers
- [x] JWT authentication with HTTP-only cookies
- [x] Protected routes with middleware

### ✅ Phase 3: Data Management (Complete)
- [x] File upload system (CSV/Excel)
- [x] Automatic column mapping
- [x] Data validation with Zod
- [x] Upload history tracking
- [x] Database import functionality

### ✅ Phase 4: Analytics Engine (Complete)
- [x] Price elasticity calculation
- [x] Competitor price analysis
- [x] Revenue & margin analytics
- [x] Time-series trend analysis
- [x] Product performance metrics
- [x] Interactive charts (Recharts)

### ✅ Phase 5: AI Agent System (Complete)
- [x] Multi-agent workflow with LangGraph
- [x] 4 specialized AI agents (Data, Market, Pricing, Recommendation)
- [x] OpenAI GPT-4o integration
- [x] Structured output with function calling
- [x] Confidence scoring & impact projections
- [x] AI recommendations page with actions
- [x] Recommendation tracking & implementation

### ✅ Phase 6: User Experience Enhancements (Complete)
- [x] Enhanced error handling with field-specific messages
- [x] Password visibility toggles
- [x] Email autocomplete hints
- [x] Improved loading states
- [x] User avatar upload functionality
- [x] Profile settings with real-time updates
- [x] Password change functionality

### 📋 Phase 7: Advanced Features (Next)
- [ ] Batch recommendation generation
- [ ] Streaming AI responses for real-time feedback
- [ ] Custom business rules & constraints
- [ ] A/B testing integration
- [ ] Learning from past recommendation outcomes
- [ ] Multi-product optimization
- [ ] Seasonal adjustment factors
- [ ] Team collaboration features
- [ ] API access & webhooks
- [ ] Advanced simulation scenarios
- [ ] Multi-tenant support
- [ ] Integrations (Stripe, Salesforce, etc.)

## 📄 Metadata

```typescript
{
  title: "Moneta AI | Intelligent Pricing Analyst",
  description: "Make confident, data-driven pricing decisions with AI-powered analysis, simulations, and explainable recommendations."
}
```

## 🤝 Contributing

This is a private project. For any inquiries, please contact the development team.

## 📝 License

Private - All Rights Reserved

---

**Built with ❤️ using Next.js, React, and cutting-edge AI technology**
