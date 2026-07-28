import {
  Hero,
  Features,
  Stats,
  PricingSection,
  CTA,
  MarketingHeader,
  Testimonials,
  TrustedCompanies,
  TrustBadges,
} from "@/components/marketing";
import WebsiteFooter from "@/components/layout/WebsiteFooter";

/**
 * BlumBlast Marketing Homepage
 * 
 * Purpose: Showcase what BlumBlast does (customer acquisition engine)
 * After viewing this page, users can:
 * - Learn about BlumBlast's capabilities
 * - See how it helps drive BusinessBlum conversions
 * - Click "Get Started" or "Login" to access the internal tool
 */
export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <TrustBadges />
        <TrustedCompanies />
        <Stats />
        <Features />
        <Testimonials />
        <PricingSection />
        <CTA />
      </main>
      <WebsiteFooter />
    </div>
  );
}
