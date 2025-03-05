
import { useRef, useCallback } from 'react';
import { PerformanceTracker } from './PerformanceTracker';

// Simplified performance tracker method if the real one isn't available yet
const trackPerformance = (data: any) => {
  console.log('[Performance]', data);
  // This is a fallback if the real PerformanceTracker isn't fully implemented
};

/**
 * Hook for tracking component-level performance metrics
 * 
 * @param componentName - The name of the component to track performance for
 * @returns Object with performance tracking methods
 */
export function useComponentPerformance(componentName: string) {
  // Store the start time so it doesn't get recreated on every render
  const startTimeRef = useRef<number>(0);
  const renderCountRef = useRef<number>(0);
  
  /**
   * Track component mount performance
   * Call this in useEffect with empty dependencies array
   * 
   * @returns Function to be called on component unmount
   */
  const trackMount = useCallback(() => {
    const mountTime = performance.now() - startTimeRef.current;
    
    // Track component mount time
    trackPerformance({
      componentName,
      metricName: 'mountTime',
      value: mountTime,
      renderCount: renderCountRef.current
    });
    
    // Return cleanup function for useEffect
    return () => {
      const lifetimeDuration = performance.now() - startTimeRef.current;
      
      // Track component lifetime
      trackPerformance({
        componentName,
        metricName: 'lifetime',
        value: lifetimeDuration,
        renderCount: renderCountRef.current
      });
    };
  }, [componentName]);
  
  /**
   * Track an operation within the component
   * Use this to measure specific actions like data loading or calculations
   * 
   * @param operationName - Name of the operation to track
   * @param fn - The function to measure
   * @returns Result of the function
   */
  const trackOperation = useCallback(<T>(operationName: string, fn: () => T): T => {
    const startTime = performance.now();
    const result = fn();
    const duration = performance.now() - startTime;
    
    // Track operation duration
    trackPerformance({
      componentName,
      metricName: `operation_${operationName}`,
      value: duration,
      renderCount: renderCountRef.current
    });
    
    return result;
  }, [componentName]);
  
  /**
   * Track an async operation within the component
   * Use this to measure async operations like API calls or data processing
   * 
   * @param operationName - Name of the operation to track
   * @param fn - The async function to measure
   * @returns Promise with the result of the function
   */
  const trackAsyncOperation = useCallback(async <T>(operationName: string, fn: () => Promise<T>): Promise<T> => {
    const startTime = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      // Track operation duration
      trackPerformance({
        componentName,
        metricName: `asyncOperation_${operationName}`,
        value: duration,
        renderCount: renderCountRef.current
      });
      
      return result;
    } catch (error) {
      // Track failed operations too, but mark them as errors
      const duration = performance.now() - startTime;
      
      trackPerformance({
        componentName,
        metricName: `asyncOperationError_${operationName}`,
        value: duration,
        renderCount: renderCountRef.current
      });
      
      throw error;
    }
  }, [componentName]);
  
  // Initialize on first render
  if (startTimeRef.current === 0) {
    startTimeRef.current = performance.now();
  }
  
  // Increment render count
  renderCountRef.current += 1;
  
  // Track render time if not the first render
  if (renderCountRef.current > 1) {
    trackPerformance({
      componentName,
      metricName: 'renderTime',
      value: performance.now() - startTimeRef.current,
      renderCount: renderCountRef.current
    });
  }
  
  return {
    trackMount,
    trackOperation,
    trackAsyncOperation,
    renderCount: renderCountRef.current
  };
}
