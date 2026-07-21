# BlumBlast - Marketing Automation Platform

A modern, full-stack marketing automation platform built with Next.js 16, TypeScript, and Tailwind CSS. Transform your marketing with intelligent automation, multi-channel campaigns, and powerful lead management.

## ✨ Features

- 🚀 **Marketing Pages** - Professional homepage, about, contact, and features pages
- 🔐 **Authentication** - Complete auth system (login, register, forgot password)
- 📊 **Dashboard** - Comprehensive analytics and metrics visualization
- 📧 **Campaign Management** - Create and manage multi-channel marketing campaigns
- 👥 **Lead Management** - Track and nurture leads through the sales funnel
- 🎯 **Opportunities** - Manage sales opportunities with pipeline tracking
- ⚡ **Workflow Automation** - Visual workflow builder for marketing automation
- 📈 **Analytics** - Real-time analytics and performance metrics
- ⚙️ **Settings** - User profile and account management

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Code Quality:** ESLint + Prettier
- **Icons:** Lucide React
- **Image Optimization:** Next.js Image (AVIF/WebP)
- **Performance:** GPU-accelerated animations, React.memo optimization

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/blumblast.git

# Navigate to project directory
cd blumblast

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

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
blumblast/
├── app/
│   ├── (auth)/              # Authentication pages
│   ├── (dashboard)/         # Dashboard pages
│   ├── (marketing)/         # Marketing website pages
│   └── layout.tsx           # Root layout
├── components/
│   ├── layout/              # Layout components
│   ├── marketing/           # Marketing components
│   └── ui/                  # Reusable UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utility functions and constants
└── types/                   # TypeScript type definitions
```

## 🎨 Key Features

### Marketing Pages

- **Professional Design** - Clean, modern UI inspired by industry leaders
- **Responsive** - Mobile-first design, works on all devices
- **Animated** - Smooth GPU-accelerated animations
- **Optimized Images** - AVIF/WebP with responsive sizing
- **SEO Ready** - Enhanced metadata and OpenGraph tags

### Dashboard

- **Analytics Dashboard** - Real-time metrics and charts
- **Campaign Management** - Create, edit, and track campaigns
- **Lead Tracking** - Import, export, and manage leads
- **Opportunities** - Sales pipeline management
- **Workflows** - Visual automation builder
- **Settings** - User profile and preferences

## 🔧 Code Quality

- ✅ **ESLint** - Zero errors, zero warnings
- ✅ **Prettier** - 100% formatted
- ✅ **TypeScript** - Strict mode, zero errors
- ✅ **Performance** - React.memo, intersection observer optimization
- ✅ **Build** - Successful production build (8.9s)

## 🎯 Performance

- **Lighthouse Score Target:** 95+
- **Build Time:** ~9 seconds
- **Animation Performance:** 60fps
- **Component Re-renders:** Optimized with React.memo
- **Bundle Size:** Optimized with Next.js

## 📸 Screenshots

### Marketing Pages

- Homepage with hero section and features
- About page with company story and team
- Contact page with form and office locations
- Features page with detailed product information

### Dashboard

- Analytics overview with key metrics
- Campaign management interface
- Lead tracking and management
- Workflow automation builder

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please open an issue or reach out at [your-email@example.com]

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)

---

**Built with ❤️ using Next.js 16 and TypeScript**
