import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mb-2 inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
              <span className="text-xl font-bold text-white">B</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">BlumBlast</span>
          </div>
          <p className="text-xs text-gray-600">Multi-Channel Marketing & Lead Automation</p>
        </div>

        {children}

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>© 2026 BlumBlast. All rights reserved.</p>
          <div className="mt-1.5 flex items-center justify-center gap-3">
            <Link href="#" className="transition-colors hover:text-gray-700">
              Privacy
            </Link>
            <span>•</span>
            <Link href="#" className="transition-colors hover:text-gray-700">
              Terms
            </Link>
            <span>•</span>
            <Link href="#" className="transition-colors hover:text-gray-700">
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
