
import React from "react";
import { cn } from "@/lib/utils";
import { InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * EmptyState Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear feedback for empty states
 * - Sustainable Code: Reusable component across pages
 */
interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  title = "No items found",
  description = "Get started by creating your first item.",
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50",
      className
    )}>
      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
        {icon || <InboxIcon className="w-6 h-6 text-gray-400 dark:text-gray-500" />}
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">
        {description}
      </p>
      
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
