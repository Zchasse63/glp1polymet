
import React from "react";
import { Button } from "@/components/ui/button";
import { ZapIcon } from "lucide-react";

const InsightsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">
        AI Insights
      </h1>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
      >
        <ZapIcon className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default InsightsHeader;
