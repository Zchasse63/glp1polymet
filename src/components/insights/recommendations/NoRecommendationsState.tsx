
import React from "react";
import { Button } from "@/components/ui/button";
import { SearchXIcon } from "lucide-react";
import { formatRecType } from "./RecommendationCard";
import { RecommendationFilterType } from "@/types/insightTypes";

interface NoRecommendationsStateProps {
  isFiltered: boolean;
  activeFilter: RecommendationFilterType;
  resetFilter: () => void;
}

const NoRecommendationsState: React.FC<NoRecommendationsStateProps> = ({
  isFiltered,
  activeFilter,
  resetFilter
}) => {
  // Display message based on filter type
  let message = "No recommendations available";
  if (isFiltered) {
    if (activeFilter === 'bookmarked') {
      message = "You haven't bookmarked any recommendations yet";
    } else {
      message = `No ${formatRecType(activeFilter.toString())} recommendations available`;
    }
  }
  
  return (
    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-md">
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700">
        <SearchXIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      </div>
      <h3 className="mt-4 text-base font-medium text-gray-900 dark:text-gray-100">
        {message}
      </h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {isFiltered
          ? "Try a different filter or view all recommendations"
          : "Check back later for personalized recommendations based on your health data"}
      </p>
      {isFiltered && (
        <div className="mt-4">
          <Button onClick={resetFilter} variant="outline" size="sm">
            View All Recommendations
          </Button>
        </div>
      )}
    </div>
  );
};

export default NoRecommendationsState;
