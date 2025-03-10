
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * RecommendationsLoadingState Component
 * 
 * Displays a loading skeleton UI for recommendations while data is being fetched
 */
const RecommendationsLoadingState: React.FC = () => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="h-8 w-24" />
      </div>

      <div className="grid gap-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden border-l-4 border-l-gray-200 dark:border-l-gray-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                <div className="w-full">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full my-1" />
                  <Skeleton className="h-4 w-5/6 mb-2" />
                  <Skeleton className="h-4 w-40 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecommendationsLoadingState;
