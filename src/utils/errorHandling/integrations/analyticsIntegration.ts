
/**
 * Error Analytics Integration
 * 
 * Following CodeFarm Development Methodology:
 * - Modular Architecture: Separated analytics concerns
 * - Continuous Learning: Integration with analytics for insights
 */
import analytics, { EventCategory, EventPriority } from '../../eventTracking';
import { AppError, ErrorSeverity } from '../types';

/**
 * Track error in analytics system
 */
export function trackErrorInAnalytics(error: AppError): void {
  // Only track high severity errors
  if (error.severity === ErrorSeverity.ERROR || error.severity === ErrorSeverity.CRITICAL) {
    analytics.trackEvent({
      name: 'error_occurred',
      category: EventCategory.ERROR,
      priority: error.severity === ErrorSeverity.CRITICAL ? EventPriority.CRITICAL : EventPriority.HIGH,
      properties: {
        errorCode: error.code,
        message: error.message,
        severity: error.severity,
        group: error.group,
        timestamp: new Date().toISOString(),
        // Don't include full context to avoid sensitive data
        url: typeof window !== 'undefined' ? window.location.href : undefined
      }
    });
  }
}
