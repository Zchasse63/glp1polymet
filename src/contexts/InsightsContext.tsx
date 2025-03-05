
/**
 * InsightsContext
 * 
 * Context for managing insights-related state across components.
 * Following CodeFarm architecture principles:
 * - Separation of Concerns: State management separate from UI rendering
 * - Single Source of Truth: Centralized state for insights data
 * - Sustainable Code: Reusable context with clear responsibilities
 */
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';

interface InsightsContextType {
  /** Selected time period for insights data */
  timePeriod: TimePeriod;
  /** Function to update the selected time period */
  setTimePeriod: (period: TimePeriod) => void;
  /** Converts time period to days for data fetching */
  getDaysFromTimePeriod: (period?: TimePeriod) => number;
}

const InsightsContext = createContext<InsightsContextType | undefined>(undefined);

export const useInsightsContext = (): InsightsContextType => {
  const context = useContext(InsightsContext);
  if (!context) {
    throw new Error('useInsightsContext must be used within an InsightsProvider');
  }
  return context;
};

interface InsightsProviderProps {
  children: ReactNode;
}

export const InsightsProvider: React.FC<InsightsProviderProps> = ({ children }) => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('30days');

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

  const value = {
    timePeriod,
    setTimePeriod,
    getDaysFromTimePeriod
  };

  return (
    <InsightsContext.Provider value={value}>
      {children}
    </InsightsContext.Provider>
  );
};
