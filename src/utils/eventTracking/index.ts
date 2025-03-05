
/**
 * Event Tracking System
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Track user interactions for better UX insights
 * - Continuous Learning: Gather data for iterative improvement
 * - Modular Architecture: Event system with pluggable providers
 */

// Export all types
export { EventCategory, EventPriority, type TrackingEvent, type AnalyticsProvider } from './types';

// Export helper functions
export { trackFeatureUsage, trackError, trackHealthMetricViewed, trackInsightViewed } from './eventHelpers';

// Export core analytics manager
import analytics from './AnalyticsManager';
export { analytics };

// Export providers
export { ConsoleAnalyticsProvider } from './providers/ConsoleProvider';

// Initialize with default provider in development
import { ConsoleAnalyticsProvider } from './providers/ConsoleProvider';

// Add the console provider by default in development
if (process.env.NODE_ENV === 'development') {
  analytics.addProvider(new ConsoleAnalyticsProvider());
}

// Initialize analytics on load
analytics.initialize();

// Export default for compatibility
export default analytics;
