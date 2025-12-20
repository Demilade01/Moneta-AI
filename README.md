# Moneta AI

[![Moneta AI](./public/screenshot.png)](https://moneta-ai-gamma.vercel.app/)

**Your Intelligent Pricing Analyst**

> Make confident, data-driven pricing decisions with AI-powered analysis, simulations, and explainable recommendations. No black boxes. Just clarity.

🌐 **Live Demo**: [https://moneta-ai-gamma.vercel.app/](https://moneta-ai-gamma.vercel.app/)

---

Moneta AI is an intelligent pricing analyst designed to help businesses make confident, data-driven pricing decisions. The system ingests internal pricing, cost, and sales data alongside external market and competitor signals, then analyzes historical patterns to understand how price changes impact demand, revenue, and margins.

## ✨ Key Features

- 🧠 **AI-Powered Analysis** - Advanced ML models analyze market dynamics and customer behavior
- 📊 **Revenue Simulation** - Test pricing strategies with accurate forecasting
- 🔍 **Explainable Decisions** - Full transparency with confidence scores
- ⚡ **Instant Insights** - Get recommendations in seconds, not weeks
- 📈 **Enterprise Intelligence** - Real-time dashboards for actionable insights
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

# Initialize database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🧪 Demo Credentials

The authentication is currently in **demo mode** for UI development:

- **Any email** and **any password** will work
- Sign in redirects to `/dashboard` (coming soon)
- Perfect for testing the UI/UX flow

Example:
```
Email: demo@monetaai.com
Password: demo123
```

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

## 🗺️ Roadmap

### ✅ Phase 1: Landing Page (Complete)
- [x] Premium glassmorphism design
- [x] Animated backgrounds
- [x] Hero section with stats
- [x] Features showcase
- [x] Analytics preview
- [x] Trust & credibility section
- [x] Authentication pages

### 🚧 Phase 2: Dashboard (In Progress)
- [ ] Dashboard layout with sidebar
- [ ] Overview page with key metrics
- [ ] Pricing analysis interface
- [ ] Data upload system
- [ ] Real-time charts with Recharts

### 📅 Phase 3: Core Features (Planned)
- [ ] Database schema with Prisma
- [ ] tRPC API layer
- [ ] AI agent system (LangChain + LangGraph)
- [ ] Simulation engine
- [ ] Recommendation system

### 🔮 Phase 4: Enterprise Features (Future)
- [ ] Full authentication system
- [ ] Multi-tenant support
- [ ] Audit logs
- [ ] Team collaboration
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
