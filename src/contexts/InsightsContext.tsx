
/**
 * InsightsContext
 * 
 * Context for managing insights-related state across components.
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: State management separate from UI rendering
 * - Single Source of Truth: Centralized state for insights data
 * - Sustainable Code: Reusable context with clear responsibilities
 */
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';
import { Correlation } from '@/utils/insights/types';
import { useCorrelationData } from '@/hooks/useCorrelationData';
import { ErrorLogger } from '@/utils/errorHandling';

// Base context for time period selection
interface InsightsContextType {
  /** Selected time period for insights data */
  timePeriod: TimePeriod;
  /** Function to update the selected time period */
  setTimePeriod: (period: TimePeriod) => void;
  /** Converts time period to days for data fetching */
  getDaysFromTimePeriod: (period?: TimePeriod) => number;
}

// Extended context with correlation data
interface ExtendedInsightsContextType extends InsightsContextType {
  /** Correlation data for weight loss factors */
  correlationData: Correlation[] | undefined;
  /** Loading state for correlation data */
  isLoadingCorrelations: boolean;
  /** Error state for correlation data */
  correlationError: Error | null;
  /** AI-generated insight about correlations */
  correlationInsight: string | null;
  /** Function to manually refresh correlation data */
  refreshCorrelationData: () => void;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);
const ExtendedInsightsContext = createContext<ExtendedInsightsContextType | undefined>(undefined);

export const useInsightsContext = (): InsightsContextType => {
  const context = useContext(InsightsContext);
  if (!context) {
    throw new Error('useInsightsContext must be used within an InsightsProvider');
  }
  return context;
};

// New hook for accessing extended insights data including correlations
export const useInsights = (): ExtendedInsightsContextType => {
  const context = useContext(ExtendedInsightsContext);
  if (!context) {
    throw new Error('useInsights must be used within an InsightsProvider');
  }
  return context;
};

interface InsightsProviderProps {
  children: ReactNode;
}

export const InsightsProvider: React.FC<InsightsProviderProps> = ({ children }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');
  const [refreshCounter, setRefreshCounter] = useState(0);

  // Fetch correlation data using the custom hook
  const { 
    data: correlationData,
    isLoading: isLoadingCorrelations,
    error: correlationError,
    insight: correlationInsight
  } = useCorrelationData(timePeriod, refreshCounter);

  // Log any errors that occur when fetching correlation data
  useEffect(() => {
    if (correlationError) {
      ErrorLogger.error(
        "Error fetching correlation data", 
        "CORRELATION_FETCH_ERROR",
        { timePeriod, refreshCounter },
        correlationError
      );
    }
  }, [correlationError, timePeriod, refreshCounter]);

  /**
   * Converts a time period string to the equivalent number of days
   * @param period Time period string
   * @returns Number of days
   */
  const getDaysFromTimePeriod = (period?: TimePeriod): number => {
    const selectedPeriod = period || timePeriod;
    
    switch (selectedPeriod) {
      case '7days':
        return 7;
      case '30days':
        return 30;
      case '90days':
        return 90;
      case '6months':
        return 180;
      case '1year':
        return 365;
      default:
        return 30;
    }
  };

  /**
   * Manually refresh correlation data
   */
  const refreshCorrelationData = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  // Base context value
  const baseValue = {
    timePeriod,
    setTimePeriod,
    getDaysFromTimePeriod
  };

  // Extended context value with correlation data
  const extendedValue = {
    ...baseValue,
    correlationData,
    isLoadingCorrelations,
    correlationError,
    correlationInsight,
    refreshCorrelationData
  };

  return (
    <InsightsContext.Provider value={baseValue}>
      <ExtendedInsightsContext.Provider value={extendedValue}>
        {children}
      </ExtendedInsightsContext.Provider>
    </InsightsContext.Provider>
  );
};
