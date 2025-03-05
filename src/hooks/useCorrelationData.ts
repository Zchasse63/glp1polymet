
/**
 * useCorrelationData Hook
 * 
 * Custom hook that manages fetching and processing correlation data
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: Data fetching separate from UI rendering
 * - Error Handling: Comprehensive error management
 * - Type Safety: Strong TypeScript typing
 */
import { useState, useEffect } from "react";
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

/**
 * Custom hook for fetching and processing correlation data
 * @returns Object containing correlation data, loading state, error state, and processed results
 */
export const useCorrelationData = (): CorrelationDataResult => {
  const [correlationData, setCorrelationData] = useState<CorrelationFactor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [insight, setInsight] = useState<string>("");
  const [dataSources, setDataSources] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = "demo-user"; // In production, this would come from auth context
        
        // Fetch correlation data
        const correlations = await analyzeWeightLossCorrelations(userId);
        setCorrelationData(correlations);
        
        // Generate insights based on correlations
        setInsight(generateKeyInsights(correlations));
        
        // Fetch user's connected data sources
        const integrations = await fetchUserIntegrations(userId);
        const activeIntegrations = integrations
          .filter(integration => integration.status === 'active')
          .map(integration => integration.provider);
          
        if (activeIntegrations.length > 0) {
          setDataSources(activeIntegrations);
        } else {
          setDataSources(['App Data']);
        }
      } catch (err) {
        console.error("Error fetching correlation data:", err);
        setError(err instanceof Error ? err : new Error("Unknown error occurred"));
        
        // Fallback to sample data
        setCorrelationData([
          { factor: "Medication Adherence", correlation: 0.85, color: "hsl(142, 76%, 36%)" },
          { factor: "Protein Intake", correlation: 0.72, color: "hsl(142, 76%, 36%)" },
          { factor: "Sleep Quality", correlation: 0.68, color: "hsl(142, 76%, 36%)" },
          { factor: "Step Count", correlation: 0.65, color: "hsl(142, 76%, 36%)" },
          { factor: "Stress Level", correlation: -0.58, color: "hsl(0, 84%, 60%)" },
          { factor: "Carb Intake", correlation: -0.45, color: "hsl(0, 84%, 60%)" },
        ]);
        
        setInsight("Your weight loss is most strongly correlated with <span class=\"font-semibold text-green-600 dark:text-green-400\"> medication adherence</span> and <span class=\"font-semibold text-green-600 dark:text-green-400\"> protein intake</span>. Focus on these areas for maximum results.");
        setDataSources(['Sample Data']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  return { correlationData, loading, error, insight, dataSources };
};
