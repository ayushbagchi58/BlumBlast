"use client";

import { useEffect, useState } from "react";

/**
 * ClientOnly component
 * 
 * Prevents hydration mismatches by only rendering children on the client side
 * after the initial mount. Useful for components that use Date, Math.random(),
 * or other non-deterministic values.
 */
export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
}
