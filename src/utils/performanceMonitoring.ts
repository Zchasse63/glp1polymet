
/**
 * Performance Monitoring Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Performance Optimization: Measure to improve
 * - Continuous Learning: Gather performance metrics
 * - User-Centric Design: Ensure optimal user experience
 * 
 * This module provides utilities for monitoring application performance
 * including component render times, network requests, and user interactions.
 */

import { ErrorLogger, ErrorSeverity } from './errorHandling';
import analytics, { EventCategory, EventPriority } from './eventTracking';

// Performance event names
export enum PerformanceEventType {
  COMPONENT_RENDER = 'component_render',
  API_REQUEST = 'api_request',
  RESOURCE_LOAD = 'resource_load',
  USER_INTERACTION = 'user_interaction',
  ROUTE_CHANGE = 'route_change',
  APP_LOAD = 'app_load',
  APP_READY = 'app_ready'
}

// Interface for performance metrics
export interface PerformanceMetric {
  name: string;
  type: PerformanceEventType;
  startTime: number;
  duration?: number;
  metadata?: Record<string, any>;
}

// Class for tracking individual performance metrics
export class PerformanceTracker {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private thresholds: Map<string, number> = new Map();
  
  constructor() {
    // Set default thresholds (in milliseconds)
    this.setThreshold(PerformanceEventType.COMPONENT_RENDER, 100);
    this.setThreshold(PerformanceEventType.API_REQUEST, 2000);
    this.setThreshold(PerformanceEventType.RESOURCE_LOAD, 3000);
    this.setThreshold(PerformanceEventType.USER_INTERACTION, 100);
    this.setThreshold(PerformanceEventType.ROUTE_CHANGE, 300);
  }
  
  // Start tracking an event
  start(name: string, type: PerformanceEventType, metadata?: Record<string, any>): string {
    const id = `${type}_${name}_${Date.now()}`;
    
    this.metrics.set(id, {
      name,
      type,
      startTime: performance.now(),
      metadata
    });
    
    return id;
  }
  
  // End tracking an event and get the duration
  end(id: string): number | undefined {
    const metric = this.metrics.get(id);
    
    if (!metric) {
      console.warn(`[Performance] No metric found with ID: ${id}`);
      return undefined;
    }
    
    const endTime = performance.now();
    const duration = endTime - metric.startTime;
    
    // Update the metric with duration
    this.metrics.set(id, {
      ...metric,
      duration
    });
    
    // Check if duration exceeds threshold
    this.checkThreshold(metric.type, duration, metric);
    
    // Track the metric
    this.trackMetric(id);
    
    return duration;
  }
  
  // Set a threshold for a performance event type
  setThreshold(type: PerformanceEventType, milliseconds: number): void {
    this.thresholds.set(type, milliseconds);
  }
  
  // Check if a duration exceeds the threshold
  private checkThreshold(type: PerformanceEventType, duration: number, metric: PerformanceMetric): void {
    const threshold = this.thresholds.get(type);
    
    if (threshold && duration > threshold) {
      const message = `Performance threshold exceeded for ${type}: ${metric.name} took ${duration.toFixed(2)}ms (threshold: ${threshold}ms)`;
      
      // Log the performance issue
      ErrorLogger.warning(
        message,
        'PERFORMANCE_THRESHOLD_EXCEEDED',
        {
          type,
          name: metric.name,
          duration,
          threshold,
          metadata: metric.metadata
        }
      );
    }
  }
  
  // Track a performance metric in analytics
  private trackMetric(id: string): void {
    const metric = this.metrics.get(id);
    
    if (!metric || metric.duration === undefined) return;
    
    analytics.trackEvent({
      name: 'performance_metric',
      category: EventCategory.PERFORMANCE,
      priority: EventPriority.LOW,
      properties: {
        metricName: metric.name,
        metricType: metric.type,
        duration: metric.duration,
        metadata: metric.metadata
      }
    });
    
    // Clean up the tracked metric
    this.metrics.delete(id);
  }
  
  // Get all metrics (for debugging)
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }
}

// Create a singleton instance of the performance tracker
export const performanceTracker = new PerformanceTracker();

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
