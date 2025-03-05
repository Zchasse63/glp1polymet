/**
 * Correlation Analysis Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Data Analysis: Specialized utilities for correlation analysis
 * - Calculation Logic: Separated from data fetching
 */
import { UserHealthData, Correlation } from './types';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';

/**
 * Analyzes user health data to find correlations with weight loss
 * 
 * @param userData - The user health data to analyze
 * @param period - Time period to analyze
 * @returns Array of correlation data
 */
export const analyzeWeightLossCorrelations = (
  userData: UserHealthData,
  period: TimePeriod
): Correlation[] => {
  // This is a placeholder for actual correlation analysis logic
  // In a real implementation, you would:
  // 1. Extract weight measurements
  // 2. Calculate weight change over time
  // 3. Correlate with other health factors
  
  // For simplicity, we'll return some mock correlations
  const correlations: Correlation[] = [
    { 
      factor: "Sleep Duration", 
      correlation: calculateMockCorrelation(userData.sleepRecords.length > 0 ? 0.7 : 0.5),
      color: "#22c55e" 
    },
    { 
      factor: "Water Intake", 
      correlation: calculateMockCorrelation(0.5),
      color: "#22c55e" 
    },
    { 
      factor: "Step Count", 
      correlation: calculateMockCorrelation(0.45),
      color: "#22c55e" 
    },
    { 
      factor: "Processed Foods", 
      correlation: calculateMockCorrelation(-0.6),
      color: "#ef4444" 
    },
    { 
      factor: "Stress Level", 
      correlation: calculateMockCorrelation(-0.4),
      color: "#ef4444" 
    }
  ];
  
  return correlations;
};

/**
 * Helper function to generate slightly randomized correlation values
 * for demonstration purposes
 * 
 * @param baseValue - Base correlation value
 * @returns Slightly randomized correlation value
 */
const calculateMockCorrelation = (baseValue: number): number => {
  // Add a little randomization but keep within -1 to 1 range
  const randomFactor = (Math.random() * 0.2) - 0.1;
  return Math.max(-0.95, Math.min(0.95, baseValue + randomFactor));
};
