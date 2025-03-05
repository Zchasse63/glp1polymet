
/**
 * Component Performance Tracking
 * 
 * Utilities for measuring and optimizing React component performance
 */

import { useEffect, useRef } from 'react';
import { PerformanceEventType } from './types';
import { performanceTracker } from './PerformanceTracker';

// Measure component render time with proper cleanup
export function useComponentPerformance(componentName: string) {
  const metricsRef = useRef<string[]>([]);
  
  // Clean up metrics when component unmounts
  useEffect(() => {
    return () => {
      // End any metrics that weren't properly ended
      metricsRef.current.forEach(id => {
        try {
          performanceTracker.end(id);
        } catch (e) {
          // Ignore errors when ending metrics
        }
      });
      
      // Clear the metrics array
      metricsRef.current = [];
    };
  }, []);
  
  return {
    measureRender: (callback: () => void) => {
      const metricId = performanceTracker.start(componentName, PerformanceEventType.COMPONENT_RENDER);
      metricsRef.current.push(metricId);
      
      try {
        callback();
      } finally {
        performanceTracker.end(metricId);
        // Remove from tracking array once properly ended
        metricsRef.current = metricsRef.current.filter(id => id !== metricId);
      }
    },
    
    // Track component mount time
    trackMount: () => {
      const metricId = performanceTracker.start(`${componentName}_mount`, PerformanceEventType.COMPONENT_RENDER);
      metricsRef.current.push(metricId);
      
      return () => {
        performanceTracker.end(metricId);
        metricsRef.current = metricsRef.current.filter(id => id !== metricId);
      };
    },
    
    // Track component update time
    trackUpdate: () => {
      const metricId = performanceTracker.start(`${componentName}_update`, PerformanceEventType.COMPONENT_RENDER);
      metricsRef.current.push(metricId);
      
      return () => {
        performanceTracker.end(metricId);
        metricsRef.current = metricsRef.current.filter(id => id !== metricId);
      };
    }
  };
}
