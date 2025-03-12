
import React from "react";
import { Recommendation } from "@/types/insightTypes";
import RecommendationCard from "./RecommendationCard";
import { useBookmarks } from "@/hooks/useBookmarks";
import { toast } from "@/hooks/use-toast";
import { ErrorLogger } from "@/utils/errorHandling";
import { useComponentPerformance } from "@/utils/performance";
import { AccessibleIcon } from "@/utils/accessibility";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";

interface RecommendationListProps {
  recommendations: Recommendation[];
}

/**
 * RecommendationList Component
 * 
 * Renders a list of recommendation cards with bookmark functionality
 * Following CodeFarm principles:
 * - Error Handling: Uses consistent error handling
 * - Accessibility: Uses accessible components
 * - Performance: Tracks component performance
 */
const RecommendationList: React.FC<RecommendationListProps> = ({ recommendations }) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const performance = useComponentPerformance('RecommendationList');
  const { prefersReducedMotion } = useAnimationTransition();
  
  // Track component mount time
  React.useEffect(() => {
    const endTracking = performance.trackMount();
    return endTracking;
  }, [performance]);

  // Handle recommendation click
  const handleRecommendationClick = async (recommendationId: string, title: string) => {
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
      
      // Use the updated bookmark status
      const bookmarkTitle = isNowBookmarked ? "Recommendation bookmarked" : "Bookmark removed";
      const bookmarkDescription = isNowBookmarked 
        ? "You can access your bookmarked recommendations anytime."
        : "The recommendation has been removed from your bookmarks.";
      
      toast({
        title: bookmarkTitle,
        description: bookmarkDescription,
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
    <div className="space-y-3">
      {recommendations.map((recommendation, index) => {
        const bookmarked = isBookmarked(recommendation.id);
        
        // Apply transition delay based on index
        const transitionDelay = `${index * 50}ms`;
        
        return (
          <div
            key={recommendation.id}
            className="animate-fade-slide-up"
            style={{ animationDelay: transitionDelay }}
          >
            <RecommendationCard
              recommendation={recommendation}
              onActionClick={() => handleRecommendationClick(recommendation.id, recommendation.title)}
              index={index}
              isBookmarked={bookmarked}
              onBookmarkToggle={() => handleBookmarkToggle(recommendation.id)}
              bookmarkIcon={
                <AccessibleIcon 
                  icon={<Bookmark className="h-5 w-5" />}
                  label={bookmarked ? "Remove bookmark" : "Bookmark recommendation"}
                  role="button"
                />
              }
              bookmarkFilledIcon={
                <AccessibleIcon 
                  icon={<BookmarkCheck className="h-5 w-5 text-yellow-500" />}
                  label="Remove bookmark"
                  role="button"
                />
              }
            />
          </div>
        );
      })}
    </div>
  );
};

export default RecommendationList;
