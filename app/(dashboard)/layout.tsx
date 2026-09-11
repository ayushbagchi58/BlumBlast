import { MainLayout } from "@/components/layout";
import ClientOnly from "@/components/ClientOnly";
import { LiveChat } from "@/components/LiveChat";
import AuthGuard from "@/components/AuthGuard";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <AuthGuard>
        <MainLayout>{children}</MainLayout>
        <LiveChat />
      </AuthGuard>
    </ClientOnly>
  );
}
