
import { useState, useEffect } from 'react';
import { Correlation } from '@/utils/insights/types';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';
import { getMockCorrelationData } from '@/utils/insights/mockData';

interface CorrelationDataResult {
  data: Correlation[] | undefined;
  isLoading: boolean;
  error: Error | null;
  insight: string | null;
}

export const useCorrelationData = (timePeriod: TimePeriod): CorrelationDataResult => {
  const [data, setData] = useState<Correlation[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [insight, setInsight] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real app, you would fetch from an API based on the time period
        // For now, we're using mock data and adding a delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 1200));
        
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
      } catch (err) {
        console.error('Error fetching correlation data:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch correlation data'));
        setData(undefined);
        setInsight(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timePeriod]);

  return { data, isLoading, error, insight };
};
