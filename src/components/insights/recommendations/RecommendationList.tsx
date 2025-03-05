
import React from "react";
import { Recommendation } from "@/types/insightTypes";
import RecommendationCard from "./RecommendationCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toast } from "@/components/ui/use-toast";
import { ErrorLogger } from "@/utils/errorHandling";
import { useComponentPerformance } from "@/utils/performance";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

/**
 * RecommendationList Component
 * 
 * Renders a list of recommendation cards with bookmark functionality
 */
const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const performance = useComponentPerformance('RecommendationList');
  
  // Track component mount time
  React.useEffect(() => {
    const endTracking = performance.trackMount();
    return endTracking;
  }, []);

  // Handle recommendation click
  const handleRecommendationClick = (recommendationId: string, title: string) => {
    try {
      console.log(`Recommendation viewed: ${recommendationId}`);
      
      toast({
        title: title,
        description: "We've saved this recommendation to your activity feed.",
      });
    } catch (error) {
      ErrorLogger.error(
        "Failed to process recommendation click",
        "RECOMMENDATION_CLICK_ERROR",
        { recommendationId, title },
        error,
        true,
        "There was a problem saving this activity. Please try again."
      );
    }
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (recommendationId: string) => {
    try {
      toggleBookmark(recommendationId);
      const isNowBookmarked = !isBookmarked(recommendationId);
      
      toast({
        title: isNowBookmarked ? "Recommendation bookmarked" : "Bookmark removed",
        description: isNowBookmarked 
          ? "You can access your bookmarked recommendations anytime."
          : "The recommendation has been removed from your bookmarks.",
      });
    } catch (error) {
      ErrorLogger.error(
        "Failed to toggle bookmark",
        "BOOKMARK_TOGGLE_ERROR",
        { recommendationId },
        error,
        true,
        "There was a problem with your bookmark. Please try again."
      );
    }
  };

  return (
    <>
      {recommendations.map((recommendation, index) => (
        <RecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          onActionClick={() => handleRecommendationClick(recommendation.id, recommendation.title)}
          index={index}
          isBookmarked={isBookmarked(recommendation.id)}
          onBookmarkToggle={handleBookmarkToggle}
        />
      ))}
    </>
  );
};

export default RecommendationList;
