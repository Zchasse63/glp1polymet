
import { useQuery } from "@tanstack/react-query";
import { Recommendation } from "@/types/insightTypes";
import { useInsightsContext } from "@/contexts/InsightsContext";

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
      // In a real app, this would be an API call to get personalized recommendations
      // based on the user's health data
      
      // For now, we'll simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Sample recommendations - in a real app, these would be dynamically generated
      // based on the user's health data and the selected time period
      return [
        {
          id: "rec-1",
          title: "Increase Protein Intake",
          description: "Based on your data from the past " + (days <= 30 ? "month" : "period") + ", increasing your protein intake by 15% could improve your weight loss rate by up to 20%.",
          type: "nutrition",
          iconType: "nutrition",
          color: "green",
          impact: "high",
          actionLabel: "View Meal Plans",
          actionLink: "/nutrition/meal-plans"
        },
        {
          id: "rec-2",
          title: "Maintain Medication Schedule",
          description: "Your medication adherence has been excellent! Continue taking your medication at the same time each day for optimal results.",
          type: "medication",
          iconType: "medication",
          color: "blue",
          impact: "high",
          actionLabel: "View Schedule",
          actionLink: "/medications"
        },
        {
          id: "rec-3",
          title: "Improve Sleep Quality",
          description: "Your sleep patterns show a correlation with weight loss success. Aim for 7-8 hours of uninterrupted sleep per night.",
          type: "sleep",
          iconType: "sleep",
          color: "purple",
          impact: "medium",
          actionLabel: "Sleep Tips",
          actionLink: "/health/sleep"
        },
        {
          id: "rec-4",
          title: "Reduce Evening Carbohydrates",
          description: "Your data shows that reducing carbohydrate intake after 6pm may improve your weight loss results.",
          type: "nutrition",
          iconType: "nutrition",
          color: "orange",
          impact: "medium",
          actionLabel: "Low-Carb Dinner Ideas",
          actionLink: "/nutrition/low-carb"
        },
        {
          id: "rec-5",
          title: "Increase Daily Steps",
          description: "Adding 2,000 more steps to your daily routine could accelerate your weight loss by 10% based on your current activity levels.",
          type: "activity",
          iconType: "activity",
          color: "green",
          impact: "medium",
          actionLabel: "Activity Suggestions",
          actionLink: "/health/activity"
        },
        {
          id: "rec-6",
          title: "Practice Stress Reduction",
          description: "Lower stress levels correlate with better weight loss outcomes. Consider adding 10 minutes of meditation to your daily routine.",
          type: "stress",
          iconType: "stress",
          color: "blue",
          impact: "low",
          actionLabel: "Stress Management",
          actionLink: "/health/stress"
        }
      ] as Recommendation[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
