
import React, { useState, useEffect } from "react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationFilterType, RecommendationType } from "@/types/insightTypes";
import RecommendationsLoadingState from "./RecommendationsLoadingState";
import RecommendationFilters from "./recommendations/RecommendationFilters";
import { useBookmarks } from "@/hooks/useBookmarks";
import { ErrorLogger } from "@/utils/errorHandling";
import RecommendationHeader from "./recommendations/RecommendationHeader";
import { useComponentPerformance } from "@/utils/performance";
import RecommendationContainer from "./recommendations/RecommendationContainer";
import EmptyRecommendationState from "./recommendations/EmptyRecommendationState";
import { useAuth } from "@/contexts/AuthContext";

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
  const { isBookmarked, bookmarkedIds, isLoading: bookmarksLoading } = useBookmarks();
  const performance = useComponentPerformance('PersonalizedRecommendations');
  const { isAuthenticated } = useAuth();
  
  // Log any errors from recommendations fetch
  useEffect(() => {
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
  useEffect(() => {
    const endTracking = performance.trackMount();
    return endTracking;
  }, []);

  // Show loading state while data is being fetched
  if (isLoading || bookmarksLoading) {
    return <RecommendationsLoadingState />;
  }

  // Show empty state if there are no recommendations or if there was an error
  if ((recommendations.length === 0 && !isLoading) || error) {
    return (
      <EmptyRecommendationState 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    );
  }

  // Get unique recommendation types for filtering
  // Using type assertion to make TypeScript happy since we know these values will be valid RecommendationType
  const recommendationTypes = [...new Set(recommendations.map(rec => rec.type))] as RecommendationType[];
  
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

      <RecommendationContainer 
        filteredRecommendations={filteredRecommendations}
        noFilteredResults={noFilteredResults}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </div>
  );
};

export default PersonalizedRecommendations;
