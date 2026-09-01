"use client";

import Link from "next/link";

export default function DashboardFooter() {
  const currentYear = 2026;

  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="px-6 py-4">
        <div className="flex flex-col items-center justify-between gap-3 text-sm text-gray-600 sm:flex-row">
          {/* Copyright */}
          <div className="flex items-center gap-1">
            <span>© {currentYear} BlumBlast.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            <Link href="#" className="transition-colors hover:text-blue-600">
              Help Center
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-600">
              Privacy
            </Link>
            <Link href="#" className="transition-colors hover:text-blue-600">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
