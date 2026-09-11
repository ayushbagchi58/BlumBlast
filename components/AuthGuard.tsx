"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Loader from "@/components/ui/Loader";

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * AuthGuard component to protect routes from unauthorized access
 * Wraps protected pages and redirects to login if not authenticated
 */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
      "/account/reset_password",
    ];

    // Check if current route is public
    const isPublicRoute = publicRoutes.some((route) => 
      pathname?.startsWith(route)
    );

    // If not a public route, check authentication
    if (!isPublicRoute) {
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        // Redirect to login with return URL
        router.push(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
      } else {
        setIsChecking(false);
      }
    } else {
      setIsChecking(false);
    }
  }, [pathname, router]);

  // Show loader while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
