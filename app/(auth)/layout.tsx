import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2574&auto=format&fit=crop')",
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 via-indigo-700/65 to-purple-800/70" />
        {/* Animated Gradient Orbs */}
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/30 blur-3xl delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-2xl">
              <span className="text-2xl font-bold text-white">B</span>
            </div>
            <span className="text-3xl font-bold text-white drop-shadow-lg">BlumBlast</span>
          </div>
          <p className="text-sm font-medium text-white/90 drop-shadow">
            Multi-Channel Marketing & Lead Automation
          </p>
        </div>

        {children}

        <div className="mt-6 text-center text-xs text-white/80">
          <p className="drop-shadow">© 2026 BlumBlast. All rights reserved.</p>
          <div className="mt-2 flex items-center justify-center gap-3">
            <Link
              href="#"
              className="font-medium transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <span>•</span>
            <Link
              href="#"
              className="font-medium transition-colors hover:text-white"
            >
              Terms
            </Link>
            <span>•</span>
            <Link
              href="#"
              className="font-medium transition-colors hover:text-white"
            >
              Help
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
