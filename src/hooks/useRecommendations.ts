
import { useQuery } from "@tanstack/react-query";
import { Recommendation } from "@/types/insightTypes";
import { useInsightsContext } from "@/contexts/InsightsContext";
import { supabase } from "@/lib/supabase";

/**
 * Custom hook for fetching personalized recommendations based on user data
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: Data fetching logic separated from UI
 * - Error Handling: Comprehensive error management with React Query
 * - Type Safety: Strong TypeScript typing
 * - Caching: Efficient data caching through React Query
 * 
 * @returns Object containing recommendations data, loading state, and error state
 */
export const useRecommendations = () => {
  const userId = "demo-user"; // In a real app, this would come from auth context
  const { getDaysFromTimePeriod } = useInsightsContext();
  const days = getDaysFromTimePeriod();
  
  return useQuery({
    queryKey: ['recommendations', userId, days],
    queryFn: async () => {
      // Fetch recommendations from Supabase
      const { data, error } = await supabase
        .from('recommendations')
        .select('*');
      
      if (error) {
        throw new Error(`Error fetching recommendations: ${error.message}`);
      }
      
      // Transform the data to match our app's Recommendation type
      return data.map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.description.replace('month', days <= 30 ? "month" : "period"),
        type: item.type,
        iconType: item.icon_type,
        color: item.color,
        impact: item.impact,
        actionLabel: item.action_label,
        actionLink: item.action_link
      })) as Recommendation[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
