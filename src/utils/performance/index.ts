
/**
 * Performance Monitoring Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Performance Optimization: Measure to improve
 * - Continuous Learning: Gather performance metrics
 * - User-Centric Design: Ensure optimal user experience
 */

// Export types
export { PerformanceEventType, type PerformanceMetric } from './types';

// Export core performance tracker
export { performanceTracker } from './PerformanceTracker';

// Export component tracking utilities
export { useComponentPerformance } from './componentTracking';

// Export API tracking utilities
export { measureApiCall } from './apiTracking';

// Export app load tracking utilities
export { trackAppLoad } from './appLoadTracking';

// Export initialization function
export { initPerformanceMonitoring } from './initialization';
