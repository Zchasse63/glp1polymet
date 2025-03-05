/**
 * Performance Tracker
 * 
 * Core class for tracking and measuring performance metrics
 * With enhancements for throttling and memory management
 */

import { ErrorLogger } from '../errorHandling';
import analytics, { EventCategory, EventPriority } from '../eventTracking';
import { PerformanceEventType, PerformanceMetric, ThrottleConfig } from './types';

// Class for tracking individual performance metrics
export class PerformanceTracker {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private thresholds: Map<string, number> = new Map();
  private throttleTimers: Map<string, number> = new Map();
  private throttleConfig: ThrottleConfig = {
    // Default throttling configuration (in milliseconds)
    [PerformanceEventType.COMPONENT_RENDER]: 2000,  // Only report every 2 seconds
    [PerformanceEventType.API_REQUEST]: 5000,       // Only report every 5 seconds
    [PerformanceEventType.RESOURCE_LOAD]: 10000,    // Only report every 10 seconds
    [PerformanceEventType.USER_INTERACTION]: 1000,  // Only report every 1 second
    [PerformanceEventType.ROUTE_CHANGE]: 0,         // No throttling for route changes
    [PerformanceEventType.APP_LOAD]: 0,             // No throttling for app load
    [PerformanceEventType.APP_READY]: 0,            // No throttling for app ready
  };
  private maxMetricsPerType: number = 100; // Maximum metrics to store per event type
  private isFlushPending: boolean = false;
  
  constructor() {
    // Set default thresholds (in milliseconds)
    this.setThreshold(PerformanceEventType.COMPONENT_RENDER, 100);
    this.setThreshold(PerformanceEventType.API_REQUEST, 2000);
    this.setThreshold(PerformanceEventType.RESOURCE_LOAD, 3000);
    this.setThreshold(PerformanceEventType.USER_INTERACTION, 100);
    this.setThreshold(PerformanceEventType.ROUTE_CHANGE, 300);
    
    // Setup periodic cleanup
    if (typeof window !== 'undefined') {
      this.setupAutoCleanup();
    }
  }
  
  // Set up automatic cleanup to prevent memory leaks
  private setupAutoCleanup(): void {
    // Cleanup metrics every minute
    const cleanupInterval = setInterval(() => {
      this.cleanupMetrics();
    }, 60000);
    
    // Clear interval when window is unloaded
    window.addEventListener('beforeunload', () => {
      clearInterval(cleanupInterval);
      this.flushMetrics();
    });
    
    // Also flush metrics when page is hidden (user navigates away)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushMetrics();
      }
    });
  }
  
  // Start tracking an event
  start(name: string, type: PerformanceEventType, metadata?: Record<string, any>): string {
    // Enforce limits for each event type to prevent memory issues
    this.enforceMetricLimits(type);
    
    const id = `${type}_${name}_${Date.now()}`;
    
    this.metrics.set(id, {
      name,
      type,
      startTime: performance.now(),
      metadata,
      createdAt: Date.now()
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
      duration,
      endTime
    });
    
    // Check if duration exceeds threshold
    this.checkThreshold(metric.type, duration, metric);
    
    // Track the metric (with throttling)
    this.throttledTrackMetric(id);
    
    return duration;
  }
  
  // Set a threshold for a performance event type
  setThreshold(type: PerformanceEventType, milliseconds: number): void {
    this.thresholds.set(type, milliseconds);
  }
  
  // Configure throttling for specific event types
  setThrottleConfig(config: Partial<ThrottleConfig>): void {
    this.throttleConfig = { ...this.throttleConfig, ...config };
  }
  
  // Set maximum metrics to keep per type
  setMaxMetricsPerType(max: number): void {
    this.maxMetricsPerType = max;
  }
  
  // Limit the number of metrics stored to prevent memory issues
  private enforceMetricLimits(type: PerformanceEventType): void {
    // Count metrics of this type
    let typeCount = 0;
    let oldestId: string | null = null;
    let oldestTime = Date.now();
    
    // Find oldest metric of this type
    for (const [id, metric] of this.metrics.entries()) {
      if (metric.type === type) {
        typeCount++;
        
        // Track oldest metric
        if (metric.createdAt && metric.createdAt < oldestTime) {
          oldestTime = metric.createdAt;
          oldestId = id;
        }
      }
    }
    
    // If we have too many metrics of this type, remove the oldest one
    if (typeCount >= this.maxMetricsPerType && oldestId) {
      this.metrics.delete(oldestId);
    }
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
  
  // Track a performance metric in analytics with throttling
  private throttledTrackMetric(id: string): void {
    const metric = this.metrics.get(id);
    
    if (!metric || metric.duration === undefined) return;
    
    // Check if we should throttle this event type
    const throttleTime = this.throttleConfig[metric.type] || 0;
    const throttleKey = `${metric.type}_${metric.name}`;
    const lastReportTime = this.throttleTimers.get(throttleKey) || 0;
    const currentTime = Date.now();
    
    // If we're within the throttle window, don't report
    if (throttleTime > 0 && (currentTime - lastReportTime) < throttleTime) {
      return;
    }
    
    // Update the last report time
    this.throttleTimers.set(throttleKey, currentTime);
    
    // Track the metric
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
  
  // Flush all completed metrics to analytics
  flushMetrics(): void {
    if (this.isFlushPending) return;
    
    this.isFlushPending = true;
    
    // Use requestIdleCallback or setTimeout to flush metrics when browser is idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        this.doFlushMetrics();
        this.isFlushPending = false;
      });
    } else {
      setTimeout(() => {
        this.doFlushMetrics();
        this.isFlushPending = false;
      }, 0);
    }
  }
  
  // Actually flush the metrics (internal implementation)
  private doFlushMetrics(): void {
    const completedMetrics: string[] = [];
    
    // Find completed metrics
    for (const [id, metric] of this.metrics.entries()) {
      if (metric.duration !== undefined) {
        // Track the metric immediately
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
        
        completedMetrics.push(id);
      }
    }
    
    // Delete the flushed metrics
    for (const id of completedMetrics) {
      this.metrics.delete(id);
    }
  }
  
  // Cleanup old incomplete metrics to prevent memory leaks
  cleanupMetrics(): void {
    const now = Date.now();
    const maxAge = 30 * 60 * 1000; // 30 minutes
    const expiredMetrics: string[] = [];
    
    // Find expired metrics
    for (const [id, metric] of this.metrics.entries()) {
      if (metric.createdAt && (now - metric.createdAt) > maxAge) {
        expiredMetrics.push(id);
      }
    }
    
    // Delete expired metrics
    for (const id of expiredMetrics) {
      this.metrics.delete(id);
    }
    
    // Log if we cleaned up any metrics
    if (expiredMetrics.length > 0) {
      console.log(`[Performance] Cleaned up ${expiredMetrics.length} expired metrics`);
    }
  }
  
  // Get all metrics (for debugging)
  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }
}

// Create a singleton instance of the performance tracker
export const performanceTracker = new PerformanceTracker();
