import { MainLayout } from "@/components/layout";
import ClientOnly from "@/components/ClientOnly";
import { LiveChat } from "@/components/LiveChat";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <MainLayout>{children}</MainLayout>
      <LiveChat />
    </ClientOnly>
  );
}
