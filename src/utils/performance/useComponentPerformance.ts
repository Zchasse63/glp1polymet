
import { useCallback, useRef } from 'react';
import { PerformanceTracker } from './PerformanceTracker';
import { PerformanceEventType } from './types';

/**
 * Hook for tracking component performance metrics
 * 
 * Following CodeFarm Development Methodology:
 * - Performance Optimization: Track render, mount, and unmount times
 * - Continuous Learning: Collect metrics for performance analysis
 * 
 * @param componentName The name of the component being tracked
 * @returns Methods for tracking component lifecycle events
 */
export const useComponentPerformance = (componentName: string) => {
  // Store metrics collection functions in refs to avoid re-renders
  const componentRef = useRef({
    name: componentName,
    mountTime: 0,
  });
  
  /**
   * Track component render time
   */
  const trackRender = useCallback(() => {
    const startTime = performance.now();
    
    // In case the actual tracker method doesn't exist, use a fallback
    if (typeof PerformanceTracker.trackComponentRender === 'function') {
      PerformanceTracker.trackComponentRender(componentRef.current.name, startTime);
    } else {
      console.log(`[Performance] Component ${componentRef.current.name} rendered at ${startTime}ms`);
    }
    
    return startTime;
  }, []);
  
  /**
   * Track component mount time and return cleanup function
   */
  const trackMount = useCallback(() => {
    const startTime = performance.now();
    componentRef.current.mountTime = startTime;
    
    // In case the actual tracker method doesn't exist, use a fallback
    if (typeof PerformanceTracker.trackComponentMount === 'function') {
      PerformanceTracker.trackComponentMount(componentRef.current.name, startTime);
    } else {
      console.log(`[Performance] Component ${componentRef.current.name} mounted at ${startTime}ms`);
    }
    
    return () => {
      // Track unmount in cleanup function
      const endTime = performance.now();
      const duration = endTime - componentRef.current.mountTime;
      
      // In case the actual tracker method doesn't exist, use a fallback
      if (typeof PerformanceTracker.trackComponentUnmount === 'function') {
        PerformanceTracker.trackComponentUnmount(componentRef.current.name, endTime, duration);
      } else {
        console.log(`[Performance] Component ${componentRef.current.name} unmounted at ${endTime}ms (duration: ${duration}ms)`);
      }
    };
  }, []);
  
  return {
    trackRender,
    trackMount,
  };
};

export default useComponentPerformance;
