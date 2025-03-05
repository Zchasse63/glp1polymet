
/**
 * Component Performance Tracking
 * 
 * Utilities for measuring and optimizing React component performance
 */

import { PerformanceEventType } from './types';
import { performanceTracker } from './PerformanceTracker';

// Measure component render time
export function useComponentPerformance(componentName: string) {
  return {
    measureRender: (callback: () => void) => {
      const metricId = performanceTracker.start(componentName, PerformanceEventType.COMPONENT_RENDER);
      
      try {
        callback();
      } finally {
        performanceTracker.end(metricId);
      }
    }
  };
}
