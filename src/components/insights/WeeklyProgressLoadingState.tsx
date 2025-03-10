
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * WeeklyProgressLoadingState Component
 * 
 * Displays a loading skeleton UI for weekly progress summary while data is being fetched
 */
const WeeklyProgressLoadingState: React.FC = () => {
  return (
    <Card
      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10 border-blue-100/50 dark:border-blue-800/50 overflow-hidden animate-pulse"
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
          <div className="w-full">
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md mb-4" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-36 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressLoadingState;
