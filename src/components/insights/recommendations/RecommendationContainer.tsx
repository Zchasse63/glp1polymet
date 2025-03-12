
import React from "react";
import { RecommendationFilterType, Recommendation } from "@/types/insightTypes";
import NoRecommendationsState from "./NoRecommendationsState";
import RecommendationList from "./RecommendationList";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";
import { cn } from "@/lib/utils";

interface RecommendationContainerProps {
  filteredRecommendations: Recommendation[];
  noFilteredResults: boolean;
  activeFilter: RecommendationFilterType;
  setActiveFilter: (filter: RecommendationFilterType) => void;
}

/**
 * RecommendationContainer Component
 * 
 * Displays the recommendation list or an empty state based on available recommendations
 */
const RecommendationContainer: React.FC<RecommendationContainerProps> = ({
  filteredRecommendations,
  noFilteredResults,
  activeFilter,
  setActiveFilter
}) => {
  const { getAnimationClass, getAnimationStyle } = useAnimationTransition();
  
  return (
    <div 
      className={cn(
        "grid gap-3",
        getAnimationClass('up')
      )}
      style={getAnimationStyle(true, 'up', 0)}
    >
      {noFilteredResults ? (
        <NoRecommendationsState 
          isFiltered={true} 
          activeFilter={activeFilter} 
          resetFilter={() => setActiveFilter('all')} 
        />
      ) : (
        <RecommendationList recommendations={filteredRecommendations} />
      )}
    </div>
  );
};

export default RecommendationContainer;
