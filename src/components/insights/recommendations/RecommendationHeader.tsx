
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";

/**
 * RecommendationHeader Component
 * 
 * Displays the header section for recommendations with a view all button
 */
const RecommendationHeader: React.FC = () => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">
        Personalized Recommendations
      </h2>
      <Button
        variant="ghost"
        size="sm"
        className="text-blue-600 dark:text-blue-400 flex items-center"
      >
        View all <ChevronRightIcon className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default RecommendationHeader;
