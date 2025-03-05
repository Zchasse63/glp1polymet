
/**
 * Event Tracking System Types
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Track user interactions for better UX insights
 * - Continuous Learning: Gather data for iterative improvement
 * - Modular Architecture: Event system with pluggable providers
 */

// Event category types for better organization
export enum EventCategory {
  USER = 'user',
  ENGAGEMENT = 'engagement',
  FEATURE = 'feature',
  ERROR = 'error',
  PERFORMANCE = 'performance',
  HEALTH = 'health'
}

// Event priorities
export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Interface for event data structure
export interface TrackingEvent {
  name: string;
  category: EventCategory;
  properties?: Record<string, any>;
  priority?: EventPriority;
  timestamp?: number;
}

// Interface for analytics providers
export interface AnalyticsProvider {
  name: string;
  initialize(): Promise<boolean>;
  trackEvent(event: TrackingEvent): void;
  identify(userId: string, traits?: Record<string, any>): void;
  setUserProperties(properties: Record<string, any>): void;
  pageView(path: string, properties?: Record<string, any>): void;
}
