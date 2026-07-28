import { MainLayout } from "@/components/layout";
import ClientOnly from "@/components/ClientOnly";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly>
      <MainLayout>{children}</MainLayout>
    </ClientOnly>
  );
}
