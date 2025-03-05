
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, BookmarkIcon } from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { RecommendationType } from "@/types/insightTypes";
import RecommendationsLoadingState from "./RecommendationsLoadingState";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import RecommendationCard from "./recommendations/RecommendationCard";
import RecommendationFilters from "./recommendations/RecommendationFilters";
import NoRecommendationsState from "./recommendations/NoRecommendationsState";
import { useBookmarks } from "@/hooks/useBookmarks";

/**
 * PersonalizedRecommendations Component
 * 
 * Displays personalized health recommendations based on user data.
 * Following CodeFarm principles:
 * - Separation of concerns: Data fetching handled by custom hook
 * - Error handling: Graceful fallbacks and user notifications
 * - Documentation: Comprehensive JSDoc comments
 * - Single Responsibility: Each subcomponent has a focused purpose
 */
const PersonalizedRecommendations: React.FC = () => {
  const { data: recommendations = [], isLoading, error } = useRecommendations();
  const [activeFilter, setActiveFilter] = useState<RecommendationType | 'all' | 'bookmarked'>('all');
  const { isBookmarked, toggleBookmark, bookmarkedIds } = useBookmarks();

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

  // Handle recommendation click
  const handleRecommendationClick = (recommendationId: string, title: string) => {
    console.log(`Recommendation viewed: ${recommendationId}`);
    toast({
      title: title,
      description: "We've saved this recommendation to your activity feed.",
    });
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (recommendationId: string) => {
    toggleBookmark(recommendationId);
    const isNowBookmarked = !isBookmarked(recommendationId);
    
    toast({
      title: isNowBookmarked ? "Recommendation bookmarked" : "Bookmark removed",
      description: isNowBookmarked 
        ? "You can access your bookmarked recommendations anytime."
        : "The recommendation has been removed from your bookmarks.",
    });
  };

  // Check if we have any bookmarks to determine whether to show the bookmark filter
  const hasBookmarks = bookmarkedIds.length > 0;

  return (
    <div className="space-y-4">
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
        {filteredRecommendations.map((recommendation, index) => (
          <RecommendationCard
            key={recommendation.id}
            recommendation={recommendation}
            onActionClick={() => handleRecommendationClick(recommendation.id, recommendation.title)}
            index={index}
            isBookmarked={isBookmarked(recommendation.id)}
            onBookmarkToggle={handleBookmarkToggle}
          />
        ))}
        
        {filteredRecommendations.length === 0 && activeFilter !== 'all' && (
          <NoRecommendationsState 
            isFiltered={true} 
            activeFilter={activeFilter} 
            resetFilter={() => setActiveFilter('all')} 
          />
        )}
      </motion.div>
    </div>
  );
};

export default PersonalizedRecommendations;
