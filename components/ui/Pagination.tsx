"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const getVisiblePages = () => {
    if (totalPages <= 7) return pages;

    if (currentPage <= 4) {
      return [...pages.slice(0, 5), "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [1, "...", ...pages.slice(totalPages - 5)];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "rounded-lg border p-2 transition-colors",
          currentPage === 1
            ? "cursor-not-allowed border-gray-200 text-gray-400"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        )}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          );
        }

        return (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={cn(
              "rounded-lg border px-4 py-2 font-medium transition-colors",
              currentPage === page
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "rounded-lg border p-2 transition-colors",
          currentPage === totalPages
            ? "cursor-not-allowed border-gray-200 text-gray-400"
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        )}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
