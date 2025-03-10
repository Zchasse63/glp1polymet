
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRightIcon, HomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Breadcrumb Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear navigation path
 * - Accessibility: Proper ARIA attributes for navigation
 */
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  homeHref?: string;
  className?: string;
}

export function Breadcrumb({ 
  items, 
  homeHref = "/", 
  className 
}: BreadcrumbProps) {
  return (
    <nav 
      className={cn("flex", className)} 
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
        <li>
          <Link 
            to={homeHref}
            className="flex items-center hover:text-gray-900 dark:hover:text-white"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            {index === items.length - 1 || !item.href ? (
              <span className="font-medium text-gray-900 dark:text-white" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.href}
                className="hover:text-gray-900 dark:hover:text-white"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
