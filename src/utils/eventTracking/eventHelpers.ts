
/**
 * Event Tracking Helper Functions
 * 
 * Convenience functions for common tracking needs
 */
import analytics from './AnalyticsManager';
import { EventCategory, EventPriority, TrackingEvent } from './types';

// Track feature usage
export const trackFeatureUsage = (
  featureName: string,
  properties?: Record<string, any>
) => {
  analytics.trackEvent({
    name: 'feature_used',
    category: EventCategory.FEATURE,
    properties: {
      feature: featureName,
      ...properties
    }
  });
};

// Track errors
export const trackError = (
  error: Error,
  context?: Record<string, any>,
  priority: EventPriority = EventPriority.HIGH
) => {
  analytics.trackEvent({
    name: 'error_occurred',
    category: EventCategory.ERROR,
    priority,
    properties: {
      message: error.message,
      stack: error.stack,
      ...context
    }
  });
};

// Track health metric views
export const trackHealthMetricViewed = (metricType: string) => {
  analytics.trackEvent({
    name: 'health_metric_viewed',
    category: EventCategory.HEALTH,
    properties: {
      metricType
    }
  });
};

// Track insight views
export const trackInsightViewed = (insightType: string, timePeriod?: string) => {
  analytics.trackEvent({
    name: 'insight_viewed',
    category: EventCategory.ENGAGEMENT,
    properties: {
      insightType,
      timePeriod
    }
  });
};
