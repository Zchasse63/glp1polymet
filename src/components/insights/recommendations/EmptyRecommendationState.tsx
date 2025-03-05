
import React from "react";
import { RecommendationFilterType } from "@/types/insightTypes";
import NoRecommendationsState from "./NoRecommendationsState";

interface EmptyRecommendationStateProps {
  activeFilter: RecommendationFilterType;
  setActiveFilter: (filter: RecommendationFilterType) => void;
}

/**
 * EmptyRecommendationState Component
 * 
 * Displays when there are no recommendations available or an error occurred
 */
const EmptyRecommendationState: React.FC<EmptyRecommendationStateProps> = ({
  activeFilter,
  setActiveFilter
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">
        Personalized Recommendations
      </h2>
      <NoRecommendationsState 
        isFiltered={false} 
        activeFilter={activeFilter} 
        resetFilter={() => setActiveFilter('all')} 
      />
    </div>
  );
};

export default EmptyRecommendationState;
