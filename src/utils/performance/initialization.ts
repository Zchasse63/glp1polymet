
/**
 * Performance Monitoring Initialization
 * 
 * Setup and configuration for the performance monitoring system
 */

import { performanceTracker } from './PerformanceTracker';
import { trackAppLoad } from './appLoadTracking';

// Initialize performance monitoring
export function initPerformanceMonitoring(): void {
  // Track page navigation performance
  if (typeof window !== 'undefined') {
    // Track initial app load
    window.addEventListener('load', () => {
      setTimeout(() => trackAppLoad(), 0);
    });
    
    // Report performance metrics when page is hidden (user navigates away)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        // Force any pending metrics to be sent
        const metrics = performanceTracker.getAllMetrics();
        
        if (metrics.length > 0) {
          console.log('[Performance] Sending pending metrics on page hide', metrics.length);
        }
      }
    });
  }
}
