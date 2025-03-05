
/**
 * Health Data Service
 * 
 * Following CodeFarm Development Methodology:
 * - Separation of Concerns: Dedicated data fetching for health data
 * - Error Handling: Comprehensive error management
 */
import { TimePeriod } from '@/components/insights/TimePeriodSelector';
import { UserHealthData } from '../types';
import { generateMockHealthData } from '../mockData';
import { getDaysFromTimePeriod } from './timePeriodUtils';

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
