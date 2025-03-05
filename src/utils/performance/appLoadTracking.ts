
/**
 * Application Load Performance Tracking
 * 
 * Utilities for measuring initial load and navigation performance
 */

import analytics, { EventCategory, EventPriority } from '../eventTracking';
import { PerformanceEventType } from './types';

// Track initial app load performance
export function trackAppLoad(): void {
  if (typeof window !== 'undefined' && window.performance) {
    try {
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigationEntry) {
        analytics.trackEvent({
          name: 'app_load_performance',
          category: EventCategory.PERFORMANCE,
          priority: EventPriority.LOW,
          properties: {
            loadTime: navigationEntry.loadEventEnd - navigationEntry.startTime,
            domInteractive: navigationEntry.domInteractive - navigationEntry.startTime,
            domContentLoaded: navigationEntry.domContentLoadedEventEnd - navigationEntry.startTime,
            firstPaint: getFirstPaintTime(),
            type: PerformanceEventType.APP_LOAD
          }
        });
      }
    } catch (e) {
      console.error('[Performance] Error tracking app load:', e);
    }
  }
}

// Get first paint time (will be 0 if not available)
function getFirstPaintTime(): number {
  if (typeof window === 'undefined' || !window.performance) return 0;
  
  const firstPaintEntry = performance.getEntriesByType('paint')
    .find(entry => entry.name === 'first-paint');
    
  return firstPaintEntry ? firstPaintEntry.startTime : 0;
}
