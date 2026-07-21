import { MarketingHeader } from "@/components/marketing";
import WebsiteFooter from "@/components/layout/WebsiteFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">{children}</main>
      <WebsiteFooter />
    </div>
  );
}
