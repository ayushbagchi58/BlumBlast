# BlumBlast - Inbound Lead Capture System

## 🎉 **VERSION 3.0 - INBOUND LEAD CAPTURE!** ✨

**Complete transformation to multi-channel lead capture system!**  
**Capture inquiries from Email, SMS, and Social Media**  
**Automatic source tagging and intent tracking**  
**Built specifically for BusinessBlum's capital matching platform**

📋 [What Changed?](INBOUND_LEAD_CAPTURE_CHANGES.md) | 📚 [Full Documentation](DOCUMENTATION_INDEX.md)

---

## 🆕 What's New in v3.0 - Inbound Lead Capture

### Major Transformation
- ✅ **Multi-Channel Lead Capture** - Email, SMS, and social media inquiries
- ✅ **Automatic Source Tagging** - Every lead tagged with origin channel
- ✅ **Intent Data Collection** - Track what each lead is looking for
- ✅ **Channel Performance Tracking** - See which channels bring the best leads
- ✅ **Simplified CRM** - Focus on capturing and converting leads
- ✅ **BusinessBlum Integration** - Direct pipeline for capital matching platform

**[See all changes →](INBOUND_LEAD_CAPTURE_CHANGES.md)**

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

**An inbound lead capture system that collects inquiries from multiple channels (SMS, social media, email) for BusinessBlum's capital matching platform.**

## 🎯 What is BlumBlast?

BlumBlast is the lead intake system for BusinessBlum.com. It captures and organizes inbound inquiries from multiple communication channels into a centralized CRM.

### The Lead Journey

```
Inbound Inquiry (SMS/Social/Email)
        ↓
BlumBlast Capture System
        ↓
CRM with Source Tagging
        ↓
Lead Assignment & Qualification
        ↓
BusinessBlum Customer Conversion
```

## 🌐 Application Structure

### Internal Tool (After Login)
- **Dashboard** - Overview of incoming leads by channel
- **Leads** - View and manage all captured leads with source tags
- **Channel Capture** - Forms to manually log inbound inquiries
  - SMS Capture
  - Email Capture  
  - Social Media Capture
- **Opportunities** - Sales pipeline to BusinessBlum conversion
- **Analytics** - Channel performance and lead metrics
- **Settings** - Team management and configuration

## 🎯 Core Capabilities

### Lead Capture
- � **SMS Capture** - Log SMS inquiries with phone number and message
- 📧 **Email Capture** - Record email inquiries with full context
- 💬 **Social Media Capture** - Track DMs from Facebook, Instagram, Twitter, LinkedIn, WhatsApp
- 🏷️ **Automatic Source Tagging** - Every lead tagged with its origin channel
- 📊 **Intent Classification** - Categorize leads by funding type interest

### CRM Features
- 👁️ **Lead Dashboard** - View all leads with channel filters
- 🔍 **Search & Filter** - Find leads by source, intent, date
- 📋 **Lead Details** - Complete view of inquiry with original message
- 👥 **Assignment** - Assign leads to sales team members
- 🎯 **Pipeline Management** - Track conversion to BusinessBlum customers

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
