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
