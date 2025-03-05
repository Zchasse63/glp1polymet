
/**
 * useWeeklyProgress Hook
 * 
 * Custom hook for fetching and processing weekly progress summary data
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: Data fetching logic separate from UI
 * - Error Handling: Comprehensive error management
 * - Type Safety: Strong TypeScript typing
 */
import { useState, useEffect } from "react";
import { WeeklyProgressData } from "@/types/insightTypes";
import { delay, formatErrorMessage } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

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
 * Custom hook for fetching and managing weekly progress data
 * @returns Object containing progress data and status indicators
 */
export const useWeeklyProgress = (): WeeklyProgressResult => {
  const [progressData, setProgressData] = useState<WeeklyProgressData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProgressData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // In production, this would be an API call to your backend
      // For now, we'll simulate a delay and return mock data
      await delay(600);
      
      // Mock data for weekly progress
      const mockProgressData: WeeklyProgressData = {
        summaryText: "You're making excellent progress!",
        comparisonText: "Your weight loss is 15% faster than the average GLP-1 user at this stage.",
        badges: [
          { text: "-2.3 lbs this week", colorTheme: "green" },
          { text: "100% medication adherence", colorTheme: "blue" },
          { text: "+12% activity level", colorTheme: "purple" }
        ],
        period: "Last 7 days",
        metadata: {
          startDate: "2023-09-01",
          endDate: "2023-09-07",
          comparisonGroup: "GLP-1 users, 3 months"
        }
      };
      
      setProgressData(mockProgressData);
    } catch (err) {
      console.error("Error fetching weekly progress data:", err);
      setError(err instanceof Error ? err : new Error(formatErrorMessage(err)));
      
      toast({
        title: "Failed to load progress summary",
        description: "Unable to load your weekly progress summary. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshProgress = async (): Promise<void> => {
    await fetchProgressData();
  };

  useEffect(() => {
    fetchProgressData();
  }, []);
  
  return { 
    progressData, 
    loading, 
    error, 
    refreshProgress 
  };
};
