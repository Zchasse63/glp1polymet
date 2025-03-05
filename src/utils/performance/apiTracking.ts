
/**
 * API Performance Tracking
 * 
 * Utilities for measuring and optimizing API request performance
 */

import { PerformanceEventType } from './types';
import { performanceTracker } from './PerformanceTracker';
import { ErrorLogger } from '../errorHandling';

// Measure API request time with improved error handling
export function measureApiCall<T>(
  apiName: string,
  apiCall: Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const metricId = performanceTracker.start(apiName, PerformanceEventType.API_REQUEST, metadata);
  
  return apiCall
    .then(result => {
      // Successfully completed API call
      performanceTracker.end(metricId);
      return result;
    })
    .catch(error => {
      // API call failed, but still need to end tracking
      const duration = performanceTracker.end(metricId);
      
      // Log the API error with context
      ErrorLogger.error(
        `API call to ${apiName} failed after ${duration?.toFixed(2)}ms`,
        'API_ERROR',
        {
          apiName,
          duration,
          metadata,
          errorMessage: error instanceof Error ? error.message : String(error)
        },
        error
      );
      
      // Re-throw the error for the caller to handle
      throw error;
    });
}

// Higher-order function to wrap API methods with performance tracking
export function withPerformanceTracking<T extends (...args: any[]) => Promise<any>>(
  apiName: string,
  apiMethod: T
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    return measureApiCall(apiName, apiMethod(...args), { args }) as ReturnType<T>;
  };
}
