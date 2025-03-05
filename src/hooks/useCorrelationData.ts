import { useState, useEffect } from 'react';
import { Correlation } from '@/utils/insights/types';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';
import { getMockCorrelationData } from '@/utils/insights/mockData';
import { ErrorLogger } from '@/utils/errorHandling';

interface CorrelationDataResult {
  data: Correlation[] | undefined;
  isLoading: boolean;
  error: Error | null;
  insight: string | null;
}

/**
 * Hook to fetch correlation data between health factors and weight loss
 * 
 * Following CodeFarm Development Methodology:
 * - Sustainable Code: Reusable data fetching logic
 * - Error Handling: Comprehensive error management
 * - Performance: Optimized data fetching with refresh control
 * 
 * @param timePeriod - The time period to fetch data for
 * @param refreshCounter - Incrementing this value will trigger a refresh
 * @returns Correlation data result with loading and error states
 */
export const useCorrelationData = (
  timePeriod: TimePeriod, 
  refreshCounter: number = 0
): CorrelationDataResult => {
  const [data, setData] = useState<Correlation[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Reset state for new fetch
      setIsLoading(true);
      setError(null);
      
      try {
        // Log the fetch attempt
        ErrorLogger.info(
          `Fetching correlation data for period: ${timePeriod}`,
          "CORRELATION_FETCH_START",
          { timePeriod, refreshCounter }
        );
        
        // In a real app, you would fetch from an API based on the time period
        // For now, we're using mock data and adding a delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 1200));
        
        // Simulate network errors occasionally for testing error handling
        const shouldSimulateError = Math.random() < 0.1; // 10% chance of error
        
        if (shouldSimulateError) {
          throw new Error("Network error: Failed to fetch correlation data");
        }
        
        // Get mock correlation data
        const correlationData = getMockCorrelationData(timePeriod);
        setData(correlationData);
        
        // Simulate an AI-generated insight about the correlations
        if (correlationData && correlationData.length > 0) {
          const strongestCorrelation = [...correlationData].sort((a, b) => 
            Math.abs(b.correlation) - Math.abs(a.correlation)
          )[0];
          
          let insightText = '';
          if (strongestCorrelation.correlation > 0) {
            insightText = `<strong>Key insight:</strong> Increasing your <strong>${strongestCorrelation.factor.toLowerCase()}</strong> shows the strongest positive correlation with weight loss success. Consider prioritizing this factor in your health plan.`;
          } else {
            insightText = `<strong>Key insight:</strong> Reducing your <strong>${strongestCorrelation.factor.toLowerCase()}</strong> shows the strongest correlation with weight loss success. Consider addressing this factor in your health plan.`;
          }
          
          setInsight(insightText);
        } else {
          setInsight(null);
        }
        
        // Log successful fetch
        ErrorLogger.info(
          "Successfully fetched correlation data",
          "CORRELATION_FETCH_SUCCESS",
          { timePeriod, dataPoints: correlationData?.length || 0 }
        );
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        const errorObj = err instanceof Error ? err : new Error('Failed to fetch correlation data');
        
        // Log error with detailed context
        ErrorLogger.error(
          'Error fetching correlation data',
          'CORRELATION_FETCH_ERROR',
          { 
            timePeriod,
            refreshCounter,
            errorMessage: errorObj.message
          },
          errorObj
        );
        
        setError(errorObj);
        setData(undefined);
        setInsight(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timePeriod, refreshCounter]);

  return { data, isLoading, error, insight };
};
