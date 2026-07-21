"use client";

import { Bell, Search, User, LogOut, Settings, HelpCircle, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import { mockUsers } from "@/lib/mockData";
import { useSidebar } from "./MainLayout";

export default function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { isCollapsed, isMobileMenuOpen, toggleMobileMenu } = useSidebar();

  const currentUser = mockUsers[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mockNotifications = [
    { id: 1, text: "New lead: Alice Johnson", time: "5 min ago", unread: true },
    { id: 2, text: "Campaign completed successfully", time: "1 hour ago", unread: true },
    { id: 3, text: "New opportunity created", time: "2 hours ago", unread: false },
  ];

  const unreadCount = mockNotifications.filter((n) => n.unread).length;

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 h-16 border-b border-gray-200 bg-white transition-all duration-300",
        isCollapsed ? "lg:left-20" : "lg:left-64",
        "left-0"
      )}
    >
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        {/* Mobile Menu Button & Logo */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">B</span>
            </div>
            <span className="hidden text-lg font-bold text-gray-900 sm:block">BlumBlast</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="hidden max-w-xl flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search leads, campaigns, opportunities..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Mobile Search Button */}
        <button
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:hidden"
          title="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Help Button - Hidden on small mobile */}
          <button
            className="hidden rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 sm:block"
            title="Help & Support"
          >
            <HelpCircle className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white py-2 shadow-lg sm:w-96">
                <div className="border-b border-gray-200 px-4 py-2">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map((notification) => (
                    <button
                      key={notification.id}
                      className={cn(
                        "w-full border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-gray-50",
                        notification.unread && "bg-blue-50"
                      )}
                    >
                      <p className="text-sm text-gray-900">{notification.text}</p>
                      <p className="mt-1 text-xs text-gray-500">{notification.time}</p>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-200 px-4 py-2">
                  <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100 sm:gap-3"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-8 w-8 rounded-full"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="hidden text-left lg:block">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs capitalize text-gray-500">{currentUser.role}</p>
              </div>
            </button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
                <div className="border-b border-gray-200 px-4 py-2">
                  <p className="truncate font-medium text-gray-900">{currentUser.name}</p>
                  <p className="truncate text-sm text-gray-500">{currentUser.email}</p>
                </div>
                <Link
                  href={ROUTES.PROFILE}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  My Profile
                </Link>
                <Link
                  href={ROUTES.SETTINGS}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <hr className="my-2 border-gray-200" />
                <button
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    console.log("Logout clicked");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
