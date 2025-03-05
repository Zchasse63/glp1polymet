
/**
 * Health Data Utilities
 * Following CodeFarm architecture principles:
 * - Single Responsibility: Each function does one thing well
 * - Pure Functions: Deterministic outputs based on inputs
 * - Error Handling: Robust error management
 * - Documentation: Comprehensive JSDoc comments
 */
import { TrendCalculationParams, TrendDirection } from "@/types/healthMetrics";

/**
 * Calculates the percent change between two values
 * @param startValue Initial value
 * @param endValue Final value
 * @returns Percentage change (positive for increase, negative for decrease)
 */
export const calculatePercentChange = (startValue: number, endValue: number): number => {
  if (startValue === 0) return 0; // Prevent division by zero
  return Math.round(((endValue - startValue) / Math.abs(startValue)) * 100);
};

/**
 * Determines if a trend is positive or negative based on the metric context
 * @param trend Numerical trend value
 * @param metricType Type of health metric (some metrics are better when decreasing)
 * @returns Boolean indicating if the trend is positive for health
 */
export const isTrendPositive = (trend: number, metricType: "weight" | "bloodPressure" | "glucose" | "heartRate" | "sleep" | "activity" | "hydration" | "calories"): boolean => {
  // For these metrics, a decrease is generally positive
  const decreaseIsPositive = ["weight", "bloodPressure", "glucose", "heartRate"];
  
  if (decreaseIsPositive.includes(metricType)) {
    return trend < 0;
  }
  
  // For other metrics like sleep, activity, hydration, an increase is positive
  return trend > 0;
};

/**
 * Calculate trend from array of data points
 * @param params Object containing data points and optional parameters
 * @returns Percentage change between first and last data point
 */
export const calculateTrend = ({ data, significanceThreshold = 0 }: TrendCalculationParams): number => {
  try {
    if (!data || data.length < 2) return 0;
    
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    const percentChange = calculatePercentChange(firstValue, lastValue);
    
    // If change is below significance threshold, return 0
    if (Math.abs(percentChange) < significanceThreshold) {
      return 0;
    }
    
    return percentChange;
  } catch (error) {
    console.error("Error calculating trend:", error);
    return 0;
  }
};

/**
 * Get CSS color class for trend display based on trend value and metric type
 * @param trend Numerical trend value
 * @param metricType Type of health metric
 * @returns CSS color class for the trend
 */
export const getTrendColor = (trend: number, metricType: "weight" | "bloodPressure" | "glucose" | "heartRate" | "sleep" | "activity" | "hydration" | "calories"): string => {
  if (trend === 0) return "text-gray-500 dark:text-gray-400";
  
  const isPositive = isTrendPositive(trend, metricType);
  return isPositive 
    ? "text-green-600 dark:text-green-400" 
    : "text-red-600 dark:text-red-400";
};
