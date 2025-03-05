
/**
 * API Performance Tracking
 * 
 * Utilities for measuring and optimizing API request performance
 */

import { PerformanceEventType } from './types';
import { performanceTracker } from './PerformanceTracker';

// Measure API request time
export function measureApiCall<T>(
  apiName: string,
  apiCall: Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const metricId = performanceTracker.start(apiName, PerformanceEventType.API_REQUEST, metadata);
  
  return apiCall
    .then(result => {
      performanceTracker.end(metricId);
      return result;
    })
    .catch(error => {
      performanceTracker.end(metricId);
      throw error;
    });
}
