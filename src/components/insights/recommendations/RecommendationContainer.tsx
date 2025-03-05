
import React from "react";
import { motion } from "framer-motion";
import { RecommendationFilterType, Recommendation } from "@/types/insightTypes";
import NoRecommendationsState from "./NoRecommendationsState";
import RecommendationList from "./RecommendationList";

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
  return (
    <motion.div 
      className="grid gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
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
    </motion.div>
  );
};

export default RecommendationContainer;
