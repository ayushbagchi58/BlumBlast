# BlumBlast - Customer Acquisition Engine

## 🎉 **VERSION 2.0 RELEASED!** ✨

**All features successfully implemented with enhanced UX!**  
**New guided workflow with step-by-step navigation**  
**Live chat support integrated**  
**Industry-standard campaign flow implemented**

📋 [Quick Start Guide](SIMPLE_SUMMARY.md) | 📚 [Full Documentation](DOCUMENTATION_INDEX.md) | 🎯 [What Changed](README_CHANGES.md)

---

## 🆕 What's New in v2.0

### Major Improvements
- ✅ **Step-by-Step Guided Flow** - System guides you through every action
- ✅ **Success Messages with Next Actions** - Clear direction after each step  
- ✅ **Live Chat Support** - Instant help from any page
- ✅ **Simplified Campaign Creation** - 3 steps instead of 5
- ✅ **CSV-Only Lead Import** - Faster bulk imports
- ✅ **Next Steps Cards** - Always know what to do next
- ✅ **Better Empty States** - Educational content for new users

**[See all changes →](README_CHANGES.md)**

---

## 📚 Documentation

We've created comprehensive guides for every user level:

### Quick References
- 🚀 **[SIMPLE_SUMMARY.md](SIMPLE_SUMMARY.md)** - 5-minute overview (Start here!)
- 📊 **[README_CHANGES.md](README_CHANGES.md)** - What changed and why
- 📖 **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Find any document

### Detailed Guides
- 📘 **[WHAT_WE_CHANGED.md](WHAT_WE_CHANGED.md)** - User guide with examples
- 📙 **[FEATURES_SUMMARY.md](FEATURES_SUMMARY.md)** - Feature-by-feature breakdown
- 📕 **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Technical details

**Choose the right guide:** [Documentation Index →](DOCUMENTATION_INDEX.md)

---

**A centralized platform designed to ingest leads from email and SMS, engage them at scale using bulk messaging tools, and convert qualified prospects into BusinessBlum customers.**

## 🎯 What is BlumBlast?

BlumBlast is the customer acquisition engine for the BusinessBlum ecosystem. It's a dual-purpose application:

1. **Public Marketing Website** - Showcases BlumBlast's capabilities and drives user signups
2. **Internal CRM Tool** - Used by the BlumBlast team to manage the entire customer acquisition process

### The Customer Journey

```
Marketing Site (blumblast.com)
        ↓
Login / Register
        ↓
Internal Dashboard
        ↓
Lead Ingestion (Email/SMS) → Bulk Campaigns → Automation → Sales Pipeline
        ↓
BusinessBlum Customer Conversion
```

## 🌐 Application Structure

### Public-Facing (Marketing)
- **Homepage** - Hero, features, stats, pricing, testimonials
- **About Page** - Company story and mission  
- **Features Page** - Detailed product capabilities
- **Contact Page** - Get in touch with sales team

### Internal Tool (After Login)
- **Dashboard** - Command center with actionable insights
- **Leads** - Import from email/SMS, score, assign, manage
- **Campaigns** - Create bulk email/SMS campaigns at scale
- **Workflows** - Visual automation builder for lead nurturing
- **Opportunities** - Sales pipeline to BusinessBlum conversion
- **Analytics** - Performance metrics and reporting
- **Settings** - Team management, integrations, configuration

## 🎯 Core Capabilities

### New in v2.0 🆕
- 🗺️ **Guided Workflow** - GPS-like navigation through campaigns
- 💬 **Live Chat** - Instant support from bottom-right corner
- ✅ **Smart Success Messages** - Celebrate wins and show next steps
- 🎯 **Next Steps Cards** - Always know what to do next
- 📋 **Campaign-First Flow** - Create campaign → Import leads → Launch
- ⚡ **Faster Setup** - 3-step campaign creation (down from 5)

### Core Features
- 📥 **Lead Ingestion** - Capture leads from email, SMS, CSV import
- 📧 **Bulk Messaging** - Send personalized email and SMS campaigns at scale
- ⚡ **Workflow Automation** - Visual automation builder for lead nurturing sequences
- 🔥 **Lead Scoring** - Intelligent scoring to identify hot prospects (>80 score)
- 🎯 **Sales Pipeline** - Manage opportunities from qualification to BusinessBlum conversion
- 📊 **Analytics Dashboard** - Data-driven insights for campaign performance and lead quality
- 👥 **Team Collaboration** - Assign leads, share notes, track team activities
- 🔗 **BusinessBlum Integration** - Track conversions and attribute revenue to campaigns

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod
- **Data Tables:** TanStack Table
- **Charts:** Recharts
- **Drag & Drop:** DnD Kit (for workflow builder)
- **Notifications:** React Hot Toast
- **Icons:** Lucide React
- **Date Utilities:** date-fns

## 📦 Installation

```bash
# Navigate to project directory
cd blum-blast

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the internal tool.

## 🚀 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code quality with ESLint
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
npm run check-all    # Run all quality checks
```

## 📁 Project Structure

```
blum-blast/
├── app/
│   ├── (marketing)/         # Public marketing website
│   │   ├── page.tsx        # Homepage (Hero, Features, etc.)
│   │   ├── about/          # About BlumBlast
│   │   ├── features/       # Detailed feature showcase
│   │   ├── contact/        # Contact sales team
│   │   └── layout.tsx      # Marketing layout
│   ├── (auth)/             # Authentication pages
│   │   ├── login/          # User login
│   │   ├── register/       # User registration
│   │   └── forgot-password/
│   ├── (dashboard)/        # Internal CRM tool (requires auth)
│   │   ├── dashboard/      # Command center / home
│   │   ├── leads/          # Lead management & import
│   │   ├── campaigns/      # Bulk messaging campaigns
│   │   ├── workflows/      # Automation builder
│   │   ├── opportunities/  # Sales pipeline
│   │   ├── analytics/      # Reporting & insights
│   │   └── settings/       # Configuration
│   ├── page.tsx            # Root page (marketing homepage)
│   └── layout.tsx
├── components/
│   ├── marketing/          # Marketing website components
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Stats.tsx
│   │   ├── PricingSection.tsx
│   │   ├── CTA.tsx
│   │   ├── Testimonials.tsx
│   │   └── ...
│   ├── dashboard/          # Dashboard components
│   ├── leads/              # Lead management components
│   ├── campaigns/          # Campaign components
│   ├── workflows/          # Workflow builder components
│   ├── analytics/          # Chart components
│   ├── layout/             # Layout components (sidebar, header)
│   └── ui/                 # Reusable UI primitives
├── hooks/                  # Custom React hooks
├── lib/
│   ├── api/               # API client functions (for future backend)
│   ├── types/             # TypeScript type definitions
│   ├── mockData.ts        # Development data
│   ├── constants/         # App constants
│   └── utils/             # Utility functions
└── public/                # Static assets
```

## 🎨 Key Features

### Marketing Website
- **Professional Design** - Clean, modern UI showcasing BlumBlast capabilities
- **Hero Section** - Clear value proposition and call-to-action
- **Feature Showcase** - Detailed explanation of lead ingestion, campaigns, automation
- **Social Proof** - Stats, testimonials, trusted companies
- **Responsive** - Mobile-first design, works on all devices
- **SEO Optimized** - Proper metadata for search engine visibility

### Internal CRM Tool

#### Command Center Dashboard
- At-a-glance metrics: new leads, active campaigns, hot prospects
- Quick actions: create campaign, import leads, view hot leads
- Performance charts: campaign analytics, lead trends
- Hot leads table: prospects requiring immediate attention
- Activity feed: real-time system events

### Lead Management
- **Import:** CSV upload, email/SMS integration, manual entry
- **Search & Filter:** Full-text search, filter by source/status/score/tags
- **Bulk Actions:** Tag, assign, export, delete multiple leads
- **Lead Scoring:** 0-100 quality score based on engagement
- **Detail View:** Complete activity timeline, notes, quick actions

### Campaign Management
- **Multi-Channel:** Email and SMS campaigns
- **Visual Editor:** Rich email builder with drag-and-drop blocks
- **Personalization:** Dynamic tokens (firstName, company, etc.)
- **Segmentation:** Visual filter builder for targeting
- **Scheduling:** Send now or schedule for optimal timing
- **Analytics:** Open rates, click rates, link performance, geographic data

### Workflow Automation
- **Visual Builder:** Drag-and-drop canvas with zoom/minimap
- **Node Types:** Triggers, actions, conditions, waits, A/B splits
- **Templates:** Pre-built workflows (welcome series, re-engagement, etc.)
- **Testing:** Test mode with sample data
- **Analytics:** Enrollment, completion, drop-off tracking

### Sales Pipeline
- **Kanban View:** Drag-and-drop deal cards across stages
- **Deal Management:** Track value, probability, expected close
- **BusinessBlum Conversion:** Link to converted accounts
- **Activity Tracking:** Full interaction timeline
- **Revenue Attribution:** Track which campaigns drove revenue

### Analytics & Reporting
- **Lead Analytics:** Source breakdown, quality distribution, time-to-conversion
- **Campaign Analytics:** Performance comparison, channel analysis, optimal send times
- **Workflow Analytics:** Completion rates, drop-off points, conversion tracking
- **Date Ranges:** Flexible filtering with comparison to previous periods

## 🔧 Code Quality

- ✅ **TypeScript** - Strict mode, comprehensive type definitions
- ✅ **ESLint** - Zero errors, zero warnings
- ✅ **Prettier** - Consistent code formatting
- ✅ **Component Architecture** - Modular, reusable, well-documented

## 🎯 Development Phases

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed development roadmap.

See [FRONTEND_SPEC.md](./FRONTEND_SPEC.md) for complete design specifications.

## 🚀 Deployment

### Environment Variables

Create a `.env.local` file:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Future Backend API (when implemented)
NEXT_PUBLIC_API_URL=http://localhost:4000

# Feature Flags
NEXT_PUBLIC_ENABLE_EMAIL_INTEGRATION=false
NEXT_PUBLIC_ENABLE_SMS_INTEGRATION=false
```

### Production Build

```bash
npm run build
npm run start
```

## 📄 License

Internal tool for BlumBlast - Not for redistribution

## 🤝 Team

Built by the BlumBlast development team for internal customer acquisition

---

**Internal Tool v2.0 - Customer Acquisition Engine for BusinessBlum.com**
