"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import {
  LayoutDashboard,
  Users,
  Mail,
  Workflow,
  Target,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSidebar } from "./MainLayout";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navigationItems: NavItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.DASHBOARD,
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Leads",
    href: ROUTES.LEADS,
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Campaigns",
    href: ROUTES.CAMPAIGNS,
    icon: <Mail className="h-5 w-5" />,
  },
  {
    label: "Workflows",
    href: ROUTES.WORKFLOWS,
    icon: <Workflow className="h-5 w-5" />,
  },
  {
    label: "Opportunities",
    href: ROUTES.OPPORTUNITIES,
    icon: <Target className="h-5 w-5" />,
  },
  {
    label: "Analytics",
    href: ROUTES.ANALYTICS,
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: ROUTES.SETTINGS,
    icon: <Settings className="h-5 w-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isCollapsed, isMobileMenuOpen, setIsCollapsed, setIsMobileMenuOpen } = useSidebar();

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const showFullSidebar = !isCollapsed;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 h-screen border-r border-gray-200 bg-white transition-all duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        "w-64",
        "lg:translate-x-0",
        isCollapsed ? "lg:w-20" : "lg:w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
        {/* Mobile: Always show full logo */}
        <Link
          href={ROUTES.DASHBOARD}
          className="flex items-center gap-2 lg:hidden"
          onClick={handleLinkClick}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">B</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gray-900">BlumBlast</span>
            <span className="text-[10px] leading-tight text-gray-500">
              Marketing & Lead Automation
            </span>
          </div>
        </Link>

        {/* Desktop: Show based on collapsed state */}
        {showFullSidebar && (
          <Link
            href={ROUTES.DASHBOARD}
            className="hidden items-center gap-2 lg:flex"
            onClick={handleLinkClick}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">BlumBlast</span>
              <span className="text-[10px] leading-tight text-gray-500">
                Marketing & Lead Automation
              </span>
            </div>
          </Link>
        )}

        {isCollapsed && (
          <Link
            href={ROUTES.DASHBOARD}
            className="mx-auto hidden lg:block"
            onClick={handleLinkClick}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">B</span>
            </div>
          </Link>
        )}
      </div>

      {/* Navigation */}
      <nav className="h-[calc(100vh-8rem)] flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-200",
                    "hover:bg-gray-50",
                    isActive
                      ? "bg-blue-50 font-medium text-blue-600"
                      : "text-gray-700 hover:text-gray-900"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  {item.icon}
                  {/* Mobile: Always show text */}
                  <span className="lg:hidden">{item.label}</span>
                  {/* Desktop: Show text only when not collapsed */}
                  {showFullSidebar && <span className="hidden lg:inline">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle Button - Desktop Only */}
      <div className="absolute bottom-6 left-0 right-0 hidden px-3 lg:block">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2",
            "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "transition-colors duration-200"
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
