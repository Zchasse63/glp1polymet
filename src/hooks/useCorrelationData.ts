
/**
 * useCorrelationData Hook
 * 
 * Custom hook that manages fetching and processing correlation data using React Query
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: Data fetching separate from UI rendering
 * - Error Handling: Comprehensive error management with React Query
 * - Type Safety: Strong TypeScript typing
 * - Caching: Efficient data caching through React Query
 */
import { useQuery } from "@tanstack/react-query";
import { CorrelationFactor } from "@/types/insightTypes";
import { analyzeWeightLossCorrelations, generateKeyInsights } from "@/utils/insights/correlationAnalysis";
import { fetchUserIntegrations } from "@/utils/appIntegrations";

interface CorrelationDataResult {
  /** Array of correlation factors */
  correlationData: CorrelationFactor[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Generated insight text based on correlations */
  insight: string;
  /** Array of data source names */
  dataSources: string[];
}

const fetchCorrelationData = async (userId: string) => {
  // Fetch correlation data
  const correlations = await analyzeWeightLossCorrelations(userId);
  
  // Generate insights based on correlations
  const insight = generateKeyInsights(correlations);
  
  // Fetch user's connected data sources
  const integrations = await fetchUserIntegrations(userId);
  const activeIntegrations = integrations
    .filter(integration => integration.status === 'active')
    .map(integration => integration.provider);
    
  const dataSources = activeIntegrations.length > 0 ? activeIntegrations : ['App Data'];
  
  return { correlations, insight, dataSources };
};

/**
 * Custom hook for fetching and processing correlation data
 * @returns Object containing correlation data, loading state, error state, and processed results
 */
export const useCorrelationData = (): CorrelationDataResult => {
  const userId = "demo-user"; // In production, this would come from auth context
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['correlationData', userId],
    queryFn: () => fetchCorrelationData(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
  
  // If there's an error or no data yet, provide fallback data
  const correlationData = data?.correlations || [
    { factor: "Medication Adherence", correlation: 0.85, color: "hsl(142, 76%, 36%)" },
    { factor: "Protein Intake", correlation: 0.72, color: "hsl(142, 76%, 36%)" },
    { factor: "Sleep Quality", correlation: 0.68, color: "hsl(142, 76%, 36%)" },
    { factor: "Step Count", correlation: 0.65, color: "hsl(142, 76%, 36%)" },
    { factor: "Stress Level", correlation: -0.58, color: "hsl(0, 84%, 60%)" },
    { factor: "Carb Intake", correlation: -0.45, color: "hsl(0, 84%, 60%)" },
  ];
  
  const insight = data?.insight || "Your weight loss is most strongly correlated with <span class=\"font-semibold text-green-600 dark:text-green-400\"> medication adherence</span> and <span class=\"font-semibold text-green-600 dark:text-green-400\"> protein intake</span>. Focus on these areas for maximum results.";
  
  const dataSources = data?.dataSources || ['Sample Data'];
  
  return { 
    correlationData, 
    loading: isLoading, 
    error: error instanceof Error ? error : null, 
    insight, 
    dataSources 
  };
};
