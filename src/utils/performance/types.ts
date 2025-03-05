
/**
 * Performance Monitoring Types
 * 
 * Following CodeFarm Development Methodology:
 * - Performance Optimization: Measure to improve
 * - Continuous Learning: Gather performance metrics
 * - User-Centric Design: Ensure optimal user experience
 */

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
  endTime?: number;
  metadata?: Record<string, any>;
  createdAt?: number; // Timestamp when the metric was created (for cleanup)
}

// Throttle configuration for performance events
export interface ThrottleConfig {
  [PerformanceEventType.COMPONENT_RENDER]: number;
  [PerformanceEventType.API_REQUEST]: number;
  [PerformanceEventType.RESOURCE_LOAD]: number;
  [PerformanceEventType.USER_INTERACTION]: number;
  [PerformanceEventType.ROUTE_CHANGE]: number;
  [PerformanceEventType.APP_LOAD]: number;
  [PerformanceEventType.APP_READY]: number;
}
