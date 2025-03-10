
import React from "react";
import { cn } from "@/lib/utils";

/**
 * PageHeader Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Consistent page header patterns
 * - Sustainable Code: Reusable component for all pages
 * - Holistic Development: Integrates with overall application design
 */
interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode[];
  className?: string;
}

export function PageHeader({ 
  title, 
  description, 
  actions = [],
  className 
}: PageHeaderProps) {
  return (
    <div className={cn("px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800", className)}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
        
        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
