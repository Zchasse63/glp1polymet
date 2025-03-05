
/**
 * Data Fetching Utilities for Insights
 * 
 * Following CodeFarm Development Methodology:
 * - Separation of Concerns: Dedicated data fetching layer
 * - Error Handling: Comprehensive error management
 * - Performance: Optimized data loading strategies
 */
import { TimePeriod } from '@/components/insights/TimePeriodSelector';
import { UserHealthData, Correlation } from './types';
import { generateMockHealthData, getMockCorrelationData } from './mockData';
import { analyzeWeightLossCorrelations } from './correlationAnalysis';

/**
 * Fetches health data for the specified user and time period
 * 
 * @param userId - The user ID to fetch data for
 * @param period - Time period to fetch data for
 * @returns Promise resolving to user health data
 */
export const fetchHealthData = async (
  userId: string,
  period: TimePeriod
): Promise<UserHealthData> => {
  try {
    // Convert time period to days
    const days = getDaysFromTimePeriod(period);
    
    // In a production app, this would be an API call to your backend
    // For now, simulate a network delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock health data
    return generateMockHealthData(userId, days);
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw new Error('Failed to fetch health data. Please try again later.');
  }
};

/**
 * Fetches and analyzes correlations between health factors and weight loss
 * 
 * @param userId - The user ID to fetch correlations for
 * @param period - Time period to analyze
 * @returns Promise resolving to correlation data
 */
export const fetchCorrelationData = async (
  userId: string,
  period: TimePeriod
): Promise<Correlation[]> => {
  try {
    // In a production app, this might either:
    // 1. Call an API endpoint that returns pre-calculated correlations
    // 2. Fetch raw data and calculate correlations client-side
    
    // For demonstration, we'll use the mock data generator
    // Add a delay to simulate network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Option 1: Get pre-calculated mock correlations
    return getMockCorrelationData(period);
    
    // Option 2: Calculate correlations from raw data (commented out)
    // const userData = await fetchHealthData(userId, period);
    // return analyzeWeightLossCorrelations(userData, period);
  } catch (error) {
    console.error('Error fetching correlation data:', error);
    throw new Error('Failed to analyze correlation data. Please try again later.');
  }
};

/**
 * Converts time period to number of days
 * 
 * @param period - Time period to convert
 * @returns Number of days
 */
export const getDaysFromTimePeriod = (period: TimePeriod): number => {
  switch (period) {
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
