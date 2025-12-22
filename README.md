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
npm run db:generate
npm run db:push

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

## 📁 Project Structure

```
moneta-ai/
├── app/                    # Next.js App Router
│   ├── auth/              # Authentication pages
│   │   ├── login/        # Login page
│   │   └── signup/       # Sign up page
│   ├── dashboard/         # Dashboard (coming soon)
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── sections/          # Landing page sections
│   │   ├── navbar.tsx
│   │   ├── hero.tsx
│   │   ├── features.tsx
│   │   ├── how-it-works.tsx
│   │   ├── analytics-preview.tsx
│   │   ├── trust.tsx
│   │   ├── cta.tsx
│   │   ├── footer.tsx
│   │   └── animated-background.tsx
│   └── ui/                # shadcn UI components
├── lib/                   # Utilities and helpers
├── public/                # Static assets
└── prisma/                # Database schema (coming soon)
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

### 📋 Phase 6: Advanced Features (Next)
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
