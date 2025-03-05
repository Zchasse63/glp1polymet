
/**
 * Performance Tracker
 * 
 * Core class for tracking and measuring performance metrics
 */

import { ErrorLogger } from '../errorHandling';
import analytics, { EventCategory, EventPriority } from '../eventTracking';
import { PerformanceEventType, PerformanceMetric } from './types';

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
