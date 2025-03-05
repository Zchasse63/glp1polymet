
/**
 * Event Tracking Helper Functions
 * 
 * Convenience functions for common tracking needs
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Capture meaningful user interactions
 * - Error Containment: Graceful error handling
 */
import analytics from './AnalyticsManager';
import { EventCategory, EventPriority, TrackingEvent } from './types';

// Track feature usage
export const trackFeatureUsage = (
  featureName: string,
  properties?: Record<string, any>
): void => {
  try {
    analytics.trackEvent({
      name: 'feature_used',
      category: EventCategory.FEATURE,
      properties: {
        feature: featureName,
        ...properties
      }
    });
  } catch (error) {
    console.error('[Analytics] Failed to track feature usage:', error);
  }
};

// Track errors
export const trackError = (
  error: Error | string,
  context?: Record<string, any>,
  priority: EventPriority = EventPriority.HIGH
): void => {
  try {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    analytics.trackEvent({
      name: 'error_occurred',
      category: EventCategory.ERROR,
      priority,
      properties: {
        message: errorMessage,
        stack: errorStack,
        ...context
      }
    });
  } catch (innerError) {
    console.error('[Analytics] Failed to track error:', innerError);
  }
};

// Track security events
export const trackSecurityEvent = (
  eventName: string,
  properties?: Record<string, any>,
  priority: EventPriority = EventPriority.HIGH
): void => {
  try {
    analytics.trackEvent({
      name: eventName,
      category: EventCategory.SECURITY,
      priority,
      properties
    });
  } catch (error) {
    console.error('[Analytics] Failed to track security event:', error);
  }
};

// Track health metric views
export const trackHealthMetricViewed = (
  metricType: string,
  properties?: Record<string, any>
): void => {
  try {
    analytics.trackEvent({
      name: 'health_metric_viewed',
      category: EventCategory.HEALTH,
      properties: {
        metricType,
        ...properties
      }
    });
  } catch (error) {
    console.error('[Analytics] Failed to track health metric view:', error);
  }
};

// Track insight views
export const trackInsightViewed = (
  insightType: string, 
  timePeriod?: string,
  properties?: Record<string, any>
): void => {
  try {
    analytics.trackEvent({
      name: 'insight_viewed',
      category: EventCategory.ENGAGEMENT,
      properties: {
        insightType,
        timePeriod,
        ...properties
      }
    });
  } catch (error) {
    console.error('[Analytics] Failed to track insight view:', error);
  }
};

// Track user engagement
export const trackEngagement = (
  action: string,
  properties?: Record<string, any>
): void => {
  try {
    analytics.trackEvent({
      name: 'user_engagement',
      category: EventCategory.ENGAGEMENT,
      properties: {
        action,
        ...properties
      }
    });
  } catch (error) {
    console.error('[Analytics] Failed to track engagement:', error);
  }
};

// Track performance metrics
export const trackPerformance = (
  metricName: string,
  duration: number,
  properties?: Record<string, any>
): void => {
  try {
    analytics.trackEvent({
      name: 'performance_metric',
      category: EventCategory.PERFORMANCE,
      priority: EventPriority.LOW,
      properties: {
        metric: metricName,
        duration,
        ...properties
      }
    });
  } catch (error) {
    console.error('[Analytics] Failed to track performance metric:', error);
  }
};

// Measure and track function execution time
export const measureFunction = <T>(
  functionName: string,
  fn: () => T,
  properties?: Record<string, any>
): T => {
  const startTime = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - startTime;
    trackPerformance(functionName, duration, properties);
  }
};

// Measure and track async function execution time
export const measureAsyncFunction = async <T>(
  functionName: string,
  fn: () => Promise<T>,
  properties?: Record<string, any>
): Promise<T> => {
  const startTime = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - startTime;
    trackPerformance(functionName, duration, properties);
  }
};
