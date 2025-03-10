
import React from "react";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Pagination Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear navigation for paginated content
 * - Accessibility: Keyboard navigable and screen reader friendly
 */
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onChange,
  siblingCount = 1,
  className,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    const totalButtons = Math.min(totalNumbers, totalPages);

    if (totalPages <= totalButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftRange = Array.from(
        { length: totalButtons - 1 },
        (_, i) => i + 1
      );
      return [...leftRange, -1, totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightRange = Array.from(
        { length: totalButtons - 1 },
        (_, i) => totalPages - (totalButtons - 2) + i
      );
      return [1, -1, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, -1, ...middleRange, -2, totalPages];
    }
  };

  const pages = getPageNumbers();

  if (totalPages <= 1) return null;

  return (
    <nav 
      className={cn("flex justify-center items-center space-x-1", className)}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(1)}
        disabled={currentPage === 1}
        aria-label="Go to first page"
      >
        <ChevronsLeftIcon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>
      
      {pages?.map((page, index) => {
        if (page === -1 || page === -2) {
          return (
            <Button
              key={`ellipsis-${index}`}
              variant="outline"
              size="icon"
              disabled
              className="cursor-default"
            >
              ...
            </Button>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onChange(page)}
            aria-current={currentPage === page ? "page" : undefined}
            aria-label={`Page ${page}`}
          >
            {page}
          </Button>
        );
      })}
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Go to last page"
      >
        <ChevronsRightIcon className="h-4 w-4" />
      </Button>
    </nav>
  );
}
