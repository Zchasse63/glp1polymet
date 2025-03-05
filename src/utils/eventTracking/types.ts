
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
  HEALTH = 'health',
  SECURITY = 'security' // New category for security-related events
}

// Event priorities
export enum EventPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Provider status for better error handling
export enum ProviderStatus {
  INITIALIZED = 'initialized',
  FAILED = 'failed',
  PENDING = 'pending',
  DISABLED = 'disabled'
}

// Interface for event data structure
export interface TrackingEvent {
  name: string;
  category: EventCategory;
  properties?: Record<string, any>;
  priority?: EventPriority;
  timestamp?: number;
  userId?: string; // Optional user ID for user-specific events
}

// Interface for analytics providers
export interface AnalyticsProvider {
  name: string;
  status?: ProviderStatus;
  initialize(): Promise<boolean>;
  trackEvent(event: TrackingEvent): void;
  identify(userId: string, traits?: Record<string, any>): void;
  setUserProperties(properties: Record<string, any>): void;
  pageView(path: string, properties?: Record<string, any>): void;
}

// Configuration options for analytics providers
export interface AnalyticsConfig {
  enabled: boolean;
  userId?: string;
  debugMode?: boolean;
  anonymizeIp?: boolean;
  providers?: Record<string, boolean>;
}
