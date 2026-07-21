"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Heart, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const currentYear = 2026;

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <span className="text-lg font-bold text-white">B</span>
              </div>
              <div>
                <span className="block text-xl font-bold leading-tight text-gray-900">
                  BlumBlast
                </span>
                <span className="mt-0.5 block text-xs font-medium text-gray-500">
                  Marketing Automation
                </span>
              </div>
            </div>
            <p className="mb-4 text-sm text-gray-600">
              Multi-Channel Marketing & Lead Automation Platform. Streamline your campaigns and
              maximize conversions.
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@blumblast.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={ROUTES.DASHBOARD}
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.LEADS}
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Leads
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CAMPAIGNS}
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Campaigns
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ANALYTICS}
                  className="text-gray-600 transition-colors hover:text-blue-600"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                  API Reference
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-600">
              © {currentYear} BlumBlast. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>Made with</span>
              <Heart className="h-4 w-4 fill-current text-red-500" />
              <span>for growth</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 transition-colors hover:text-blue-600">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
