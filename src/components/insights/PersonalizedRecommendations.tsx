
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationFilterType } from "@/types/insightTypes";
import RecommendationsLoadingState from "./RecommendationsLoadingState";
import { motion } from "framer-motion";
import RecommendationList from "./recommendations/RecommendationList";
import RecommendationFilters from "./recommendations/RecommendationFilters";
import NoRecommendationsState from "./recommendations/NoRecommendationsState";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ErrorLogger } from "@/utils/errorHandling";
import RecommendationHeader from "./recommendations/RecommendationHeader";
import { useComponentPerformance } from "@/utils/performance";

/**
 * PersonalizedRecommendations Component
 * 
 * Displays personalized health recommendations based on user data.
 * Following CodeFarm principles:
 * - Separation of concerns: Data fetching handled by custom hook
 * - Error handling: Graceful fallbacks and user notifications
 * - Documentation: Comprehensive JSDoc comments
 * - Single Responsibility: Orchestrates smaller focused components
 */
const PersonalizedRecommendations: React.FC = () => {
  const { data: recommendations = [], isLoading, error } = useRecommendations();
  const [activeFilter, setActiveFilter] = useState<RecommendationFilterType>('all');
  const { isBookmarked, bookmarkedIds } = useBookmarks();
  const performance = useComponentPerformance('PersonalizedRecommendations');
  
  // Log any errors from recommendations fetch
  React.useEffect(() => {
    if (error) {
      ErrorLogger.error(
        'Failed to load recommendations',
        'RECOMMENDATIONS_FETCH_ERROR',
        { error },
        error
      );
    }
  }, [error]);
  
  // Track component mount time
  React.useEffect(() => {
    const endTracking = performance.trackMount();
    return endTracking;
  }, []);

  // Show loading state while data is being fetched
  if (isLoading) {
    return <RecommendationsLoadingState />;
  }

  // Show empty state if there are no recommendations or if there was an error
  if ((recommendations.length === 0 && !isLoading) || error) {
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
  }

  // Get unique recommendation types for filtering
  const recommendationTypes = [...new Set(recommendations.map(rec => rec.type))];
  
  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === 'all' 
    ? recommendations 
    : activeFilter === 'bookmarked' 
      ? recommendations.filter(rec => isBookmarked(rec.id))
      : recommendations.filter(rec => rec.type === activeFilter);

  // Check if we have any bookmarks to determine whether to show the bookmark filter
  const hasBookmarks = bookmarkedIds.length > 0;
  
  // Check if there are no recommendations after filtering
  const noFilteredResults = filteredRecommendations.length === 0 && activeFilter !== 'all';

  return (
    <div className="space-y-4">
      <RecommendationHeader />
      
      {/* Recommendation Type Filters */}
      <RecommendationFilters 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        recommendationTypes={recommendationTypes}
        hasBookmarks={hasBookmarks}
      />

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
    </div>
  );
};

export default PersonalizedRecommendations;
