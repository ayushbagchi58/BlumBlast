import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export default function Breadcrumbs({ items, showHome = true, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm", className)}>
      {showHome && (
        <>
          <Link href="/" className="text-gray-500 transition-colors hover:text-gray-700">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </>
      )}

      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-500 transition-colors hover:text-gray-700"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "font-medium text-gray-900" : "text-gray-500")}>
                {item.label}
              </span>
            )}

            {!isLast && <ChevronRight className="h-4 w-4 text-gray-400" />}
          </div>
        );
      })}
    </nav>
  );
}
