
import { useRef, useEffect } from 'react';
import PerformanceTracker from './PerformanceTracker';

// Fallback implementation in case the actual method doesn't exist
const trackComponentPerformanceFallback = (
  componentName: string, 
  phase: 'mount' | 'update' | 'unmount', 
  duration: number
) => {
  console.debug(`[Performance] ${componentName} ${phase}: ${duration}ms`);
};

/**
 * Hook to track component performance metrics
 * 
 * Measures component mount, update, and unmount times
 * Following CodeFarm Development Methodology:
 * - Continuous Learning: Gather performance data
 * - Monitoring: Track component performance
 */
export const useComponentPerformance = (componentName: string) => {
  const mountTimeRef = useRef<number>(0);
  const updateCountRef = useRef<number>(0);
  const lastUpdateTimeRef = useRef<number>(0);
  
  // Fallback function if the actual method doesn't exist
  const trackComponentPerformance = 
    (PerformanceTracker as any).trackComponentPerformance || 
    trackComponentPerformanceFallback;
  
  // Measure mount time
  useEffect(() => {
    const startTime = performance.now();
    mountTimeRef.current = startTime;
    
    return () => {
      const unmountTime = performance.now();
      const duration = unmountTime - mountTimeRef.current;
      
      // Track unmount time
      trackComponentPerformance(
        componentName,
        'unmount',
        duration
      );
    };
  }, [componentName]);
  
  // Measure update time
  useEffect(() => {
    // Skip the first render (mount)
    if (updateCountRef.current === 0) {
      updateCountRef.current++;
      return;
    }
    
    const updateTime = performance.now();
    
    // Only measure if we have a previous update time
    if (lastUpdateTimeRef.current > 0) {
      const duration = updateTime - lastUpdateTimeRef.current;
      
      // Track update time
      trackComponentPerformance(
        componentName,
        'update',
        duration
      );
    }
    
    lastUpdateTimeRef.current = updateTime;
    updateCountRef.current++;
  });
  
  // Provide a function to manually mark render complete
  // Useful for components with async operations
  const markRenderComplete = () => {
    const renderTime = performance.now();
    const duration = renderTime - mountTimeRef.current;
    
    // Track mount time
    trackComponentPerformance(
      componentName,
      'mount',
      duration
    );
  };
  
  // Call this at the end of your component render function
  // or in a useEffect with appropriate dependencies
  const trackRender = () => {
    if (updateCountRef.current <= 1) {
      // First render (mount)
      const renderTime = performance.now();
      const duration = renderTime - mountTimeRef.current;
      
      // Track mount time
      trackComponentPerformance(
        componentName,
        'mount',
        duration
      );
    } else {
      // Subsequent render (update)
      const renderTime = performance.now();
      const duration = renderTime - lastUpdateTimeRef.current;
      
      // Track update time
      trackComponentPerformance(
        componentName,
        'update',
        duration
      );
      
      lastUpdateTimeRef.current = renderTime;
    }
  };
  
  return { trackRender, markRenderComplete };
};
