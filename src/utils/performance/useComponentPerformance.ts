
import { useEffect, useState } from 'react';
import { PerformanceTracker } from "/dev-server/src/utils/performance/PerformanceTracker";

/**
 * Hook to track component performance metrics
 * @param componentName - Name of the component being tracked
 * @param options - Additional tracking options
 */
export const useComponentPerformance = (
  componentName: string,
  options?: {
    trackRender?: boolean;
    trackMount?: boolean;
    trackUnmount?: boolean;
  }
) => {
  const [mountTime, setMountTime] = useState<number | null>(null);
  const [renderCount, setRenderCount] = useState(0);
  
  // Default options
  const { trackRender = true, trackMount = true, trackUnmount = true } = options || {};
  
  // Track render
  useEffect(() => {
    if (trackRender) {
      // Increment render count
      setRenderCount(prev => prev + 1);
      
      // Track render performance
      try {
        PerformanceTracker.trackComponentRender(componentName);
      } catch (error) {
        console.error(`Error tracking component render: ${error}`);
      }
    }
  });
  
  // Track mount and unmount
  useEffect(() => {
    if (trackMount) {
      const startTime = performance.now();
      setMountTime(startTime);
      
      try {
        PerformanceTracker.trackComponentMount(componentName);
      } catch (error) {
        console.error(`Error tracking component mount: ${error}`);
      }
    }
    
    return () => {
      if (trackUnmount && mountTime) {
        const unmountTime = performance.now();
        const lifespan = unmountTime - mountTime;
        
        try {
          PerformanceTracker.trackComponentUnmount(componentName, lifespan);
        } catch (error) {
          console.error(`Error tracking component unmount: ${error}`);
        }
      }
    };
  }, [componentName, trackMount, trackUnmount, mountTime]);
  
  return {
    renderCount,
    mountTime
  };
};
