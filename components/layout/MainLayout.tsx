"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardFooter from "./DashboardFooter";

interface MainLayoutProps {
  children: ReactNode;
}

const SidebarContext = createContext({
  isCollapsed: false,
  isMobileMenuOpen: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsCollapsed: (_value: boolean) => {},
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setIsMobileMenuOpen: (_value: boolean) => {},
  toggleMobileMenu: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export default function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        isMobileMenuOpen,
        setIsCollapsed,
        setIsMobileMenuOpen,
        toggleMobileMenu,
      }}
    >
      <div className="min-h-screen bg-gray-50">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <Sidebar />

        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main
          className={cn("pt-16 transition-all duration-300", isCollapsed ? "lg:ml-20" : "lg:ml-64")}
        >
          <div className="p-4 sm:p-6">{children}</div>
        </main>

        {/* Footer */}
        <div className={cn("transition-all duration-300", isCollapsed ? "lg:ml-20" : "lg:ml-64")}>
          <DashboardFooter />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
