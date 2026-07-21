"use client";

import Link from "next/link";
import { Button } from "@/components/ui";
import { ROUTES } from "@/lib/constants";
import { useState } from "react";

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
                <span className="text-lg font-bold text-white">B</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold leading-tight text-gray-900">BlumBlast</span>
                <span className="mt-0.5 hidden text-[10px] font-medium leading-none text-gray-500 sm:block">
                  Marketing Automation
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="/features"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Features
            </Link>
            <Link
              href="/#pricing-section"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
            >
              Contact
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            <Link href={ROUTES.LOGIN}>
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-600">
                Log In
              </Button>
            </Link>
            <Link href={ROUTES.REGISTER}>
              <Button>Get Started Free</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <Link
                href="/features"
                className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#pricing-section"
                className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="font-medium text-gray-600 transition-colors duration-200 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 border-t border-gray-200 pt-4">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost" className="w-full hover:bg-blue-50 hover:text-blue-600">
                    Log In
                  </Button>
                </Link>
                <Link href={ROUTES.REGISTER}>
                  <Button className="w-full">Get Started Free</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
