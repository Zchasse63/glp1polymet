
/**
 * useRecommendations Hook
 * 
 * Custom hook for fetching and processing personalized health recommendations
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: Data fetching logic separate from UI
 * - Error Handling: Comprehensive error management
 * - Type Safety: Strong TypeScript typing
 */
import { useState, useEffect } from "react";
import { Recommendation } from "@/types/insightTypes";
import { delay, formatErrorMessage } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

interface RecommendationsResult {
  /** Array of personalized recommendations */
  recommendations: Recommendation[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Function to refresh recommendations */
  refreshRecommendations: () => Promise<void>;
  /** Function to mark a recommendation as viewed */
  markAsViewed: (id: string) => void;
}

/**
 * Custom hook for fetching and managing personalized health recommendations
 * @returns Object containing recommendations data and utility functions
 */
export const useRecommendations = (): RecommendationsResult => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchRecommendations = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, this would be an API call to your backend
      // For now, we'll simulate a delay and return mock data
      await delay(800);
      
      // Mock data for recommendations
      const mockRecommendations: Recommendation[] = [
        {
          id: "rec-1",
          title: "Increase Protein Intake",
          description: "Based on your data, increasing protein to 100g daily could accelerate your progress by 15%.",
          type: "nutrition",
          iconType: "nutrition",
          color: "green",
          impact: "high",
          actionLabel: "View meal suggestions",
          actionLink: "/nutrition/suggestions"
        },
        {
          id: "rec-2",
          title: "Optimize Medication Timing",
          description: "Taking your medication in the morning may improve effectiveness based on your activity patterns.",
          type: "medication",
          iconType: "medication",
          color: "blue",
          impact: "medium",
          actionLabel: "Adjust schedule",
          actionLink: "/medication/schedule"
        },
        {
          id: "rec-3",
          title: "Add Strength Training",
          description: "Users with similar profiles saw 20% better results when adding 2x weekly strength training.",
          type: "activity",
          iconType: "activity",
          color: "purple",
          impact: "high",
          actionLabel: "View workout plan",
          actionLink: "/activity/workouts"
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(err instanceof Error ? err : new Error(formatErrorMessage(err)));
      
      toast({
        title: "Failed to load recommendations",
        description: "Unable to load your personalized recommendations. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async (): Promise<void> => {
    await fetchRecommendations();
  };

  const markAsViewed = (id: string): void => {
    // In production, this would call an API to update the recommendation status
    console.log(`Marked recommendation ${id} as viewed`);
    
    // For now, we'll just remove it from the local state
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);
  
  return { 
    recommendations, 
    loading, 
    error, 
    refreshRecommendations, 
    markAsViewed 
  };
};
