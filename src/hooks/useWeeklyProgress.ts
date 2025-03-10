
/**
 * useWeeklyProgress Hook
 * 
 * Custom hook for fetching and processing weekly progress summary data
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: Data fetching logic separate from UI
 * - Error Handling: Comprehensive error management
 * - Type Safety: Strong TypeScript typing
 * - Caching: Efficient data caching through React Query
 */
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { WeeklyProgressData } from "@/types/insightTypes";
import { delay } from "@/lib/utils";
import { useInsightsContext } from "@/contexts/InsightsContext";

interface WeeklyProgressResult {
  /** Weekly progress data */
  progressData: WeeklyProgressData | null;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Function to refresh progress data */
  refreshProgress: () => Promise<void>;
}

/**
 * Fetches weekly progress data from API or returns mock data
 */
const fetchProgressData = async (days: number): Promise<WeeklyProgressData> => {
  // In production, this would be an API call to your backend
  // For now, we'll simulate a delay and return mock data
  await delay(600);
  
  // Adjust the period text based on the selected time period
  let periodText: string;
  if (days <= 7) {
    periodText = "Last 7 days";
  } else if (days <= 30) {
    periodText = "Last 30 days";
  } else if (days <= 90) {
    periodText = "Last 90 days";
  } else if (days <= 180) {
    periodText = "Last 6 months";
  } else {
    periodText = "Last year";
  }
  
  // Adjust weight loss based on time period
  const weightLoss = (days / 30) * 2.3; // Simplified calculation
  
  // Adjust badges based on time period
  const badges = [
    { text: `-${weightLoss.toFixed(1)} lbs this ${days <= 30 ? "month" : "period"}`, colorTheme: "green" },
    { text: "100% medication adherence", colorTheme: "blue" },
    { text: `+${Math.round(12 * (days / 30))}% activity level`, colorTheme: "purple" }
  ];
  
  // Mock data for weekly progress
  const mockProgressData: WeeklyProgressData = {
    summaryText: "You're making excellent progress!",
    comparisonText: `Your weight loss is 15% faster than the average GLP-1 user at this stage.`,
    badges: badges,
    period: periodText,
    metadata: {
      startDate: "2023-09-01",
      endDate: "2023-09-07",
      comparisonGroup: "GLP-1 users, 3 months"
    }
  };
  
  return mockProgressData;
};

/**
 * Custom hook for fetching and managing weekly progress data
 * @returns Object containing progress data and status indicators
 */
export const useWeeklyProgress = (): WeeklyProgressResult => {
  const queryClient = useQueryClient();
  const { getDaysFromTimePeriod } = useInsightsContext();
  const days = getDaysFromTimePeriod();

  const { data, error, isLoading } = useQuery({
    queryKey: ['weeklyProgress', days],
    queryFn: () => fetchProgressData(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const refreshProgress = async (): Promise<void> => {
    // Invalidate the cache to trigger a refetch
    await queryClient.invalidateQueries({ queryKey: ['weeklyProgress'] });
  };
  
  return { 
    progressData: data || null, 
    loading: isLoading, 
    error: error instanceof Error ? error : null, 
    refreshProgress 
  };
};
