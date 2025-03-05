
/**
 * Event Tracking System
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Track user interactions for better UX insights
 * - Continuous Learning: Gather data for iterative improvement
 * - Modular Architecture: Event system with pluggable providers
 */

// Export all types
export { 
  EventCategory, 
  EventPriority,
  ProviderStatus,
  type TrackingEvent, 
  type AnalyticsProvider,
  type AnalyticsConfig
} from './types';

// Export helper functions
export { 
  trackFeatureUsage, 
  trackError,
  trackSecurityEvent,
  trackHealthMetricViewed, 
  trackInsightViewed,
  trackEngagement,
  trackPerformance,
  measureFunction,
  measureAsyncFunction
} from './eventHelpers';

// Export core analytics manager
import analytics from './AnalyticsManager';
export { analytics };

// Export providers
export { ConsoleAnalyticsProvider } from './providers/ConsoleProvider';

// Initialize with default provider in development
import { ConsoleAnalyticsProvider } from './providers/ConsoleProvider';

// Add the console provider by default in development
if (process.env.NODE_ENV === 'development') {
  analytics.addProvider(new ConsoleAnalyticsProvider({
    colorized: true,
    showTimestamp: true,
    logLevel: 'debug'
  }));
}

// Initialize analytics on load
analytics.initialize()
  .then(initialized => {
    if (initialized && process.env.NODE_ENV === 'development') {
      console.debug('[Analytics] System initialized successfully');
    }
  })
  .catch(error => {
    console.error('[Analytics] Failed to initialize:', error);
  });

// Export default for compatibility
export default analytics;
