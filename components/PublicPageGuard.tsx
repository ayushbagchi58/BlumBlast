"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import Loader from "@/components/ui/Loader";

interface PublicPageGuardProps {
  children: React.ReactNode;
}

/**
 * PublicPageGuard component to prevent authenticated users from accessing public pages
 * Redirects logged-in users to dashboard if they try to access login/register/etc
 */
export default function PublicPageGuard({ children }: PublicPageGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const authenticated = isAuthenticated();
    
    if (authenticated) {
      // User is logged in, redirect to dashboard
      router.push("/dashboard");
    } else {
      // User is not logged in, allow access to public page
      setIsChecking(false);
    }
  }, [router]);

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
