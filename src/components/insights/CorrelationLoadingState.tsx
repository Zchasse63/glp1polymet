
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CorrelationLoadingState: React.FC = () => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Weight Loss Correlations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Analyzing your data to find correlations...
        </p>
        <div className="space-y-4">
          <Skeleton className="h-[280px] w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CorrelationLoadingState;
