
/**
 * useRecommendations Hook
 * 
 * Custom hook for fetching and processing personalized health recommendations
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: Data fetching logic separate from UI
 * - Error Handling: Comprehensive error management with React Query
 * - Type Safety: Strong TypeScript typing
 * - Caching: Efficient data caching through React Query
 */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Recommendation } from "@/types/insightTypes";
import { delay } from "@/lib/utils";

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
 * Fetches recommendations from API or returns mock data
 */
const fetchRecommendations = async (): Promise<Recommendation[]> => {
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
  
  return mockRecommendations;
};

/**
 * Mark a recommendation as viewed (API call)
 */
const markRecommendationAsViewed = async (id: string): Promise<void> => {
  // In production, this would be an API call to update the recommendation status
  console.log(`Marking recommendation ${id} as viewed`);
  await delay(300);
  // API call would go here
  return;
};

/**
 * Custom hook for fetching and managing personalized health recommendations
 * @returns Object containing recommendations data and utility functions
 */
export const useRecommendations = (): RecommendationsResult => {
  const queryClient = useQueryClient();

  // Query for fetching recommendations
  const { data = [], error, isLoading } = useQuery({
    queryKey: ['recommendations'],
    queryFn: fetchRecommendations,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
  
  // Mutation for marking a recommendation as viewed
  const { mutate } = useMutation({
    mutationFn: markRecommendationAsViewed,
    // When successful, update the recommendations in the cache
    onSuccess: (_, recommendationId) => {
      queryClient.setQueryData(['recommendations'], (old: Recommendation[] | undefined) => 
        old ? old.filter(rec => rec.id !== recommendationId) : []
      );
    },
  });

  const refreshRecommendations = async (): Promise<void> => {
    // Invalidate the cache to trigger a refetch
    await queryClient.invalidateQueries({ queryKey: ['recommendations'] });
  };

  return { 
    recommendations: data, 
    loading: isLoading, 
    error: error instanceof Error ? error : null, 
    refreshRecommendations,
    markAsViewed: (id: string) => mutate(id)
  };
};
