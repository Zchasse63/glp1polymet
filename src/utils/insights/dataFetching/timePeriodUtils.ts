
/**
 * Time Period Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Focus on time period conversions
 * - Reusability: Used across multiple insight data fetching functions
 */
import { TimePeriod } from '@/components/insights/TimePeriodSelector';

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
