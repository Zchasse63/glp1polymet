
/**
 * Event Tracking System
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Track user interactions for better UX insights
 * - Continuous Learning: Gather data for iterative improvement
 * - Modular Architecture: Event system with pluggable providers
 * 
 * This module provides a consistent interface for tracking events
 * across the application with support for multiple analytics providers.
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

/**
 * Console analytics provider for development
 * In production, this would be replaced with actual providers like
 * Google Analytics, Amplitude, Mixpanel, etc.
 */
class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = 'console';
  
  async initialize(): Promise<boolean> {
    console.log('[Analytics] Initialized console provider');
    return true;
  }
  
  trackEvent(event: TrackingEvent): void {
    console.log(`[Analytics] Event: ${event.name}`, {
      category: event.category,
      properties: event.properties,
      priority: event.priority || EventPriority.MEDIUM,
      timestamp: event.timestamp || Date.now()
    });
  }
  
  identify(userId: string, traits?: Record<string, any>): void {
    console.log(`[Analytics] Identified user: ${userId}`, traits);
  }
  
  setUserProperties(properties: Record<string, any>): void {
    console.log('[Analytics] Set user properties:', properties);
  }
  
  pageView(path: string, properties?: Record<string, any>): void {
    console.log(`[Analytics] Page view: ${path}`, properties);
  }
}

// Main analytics manager that handles all providers
class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private initialized = false;
  private userId: string | null = null;
  private userProperties: Record<string, any> = {};
  private queue: Array<() => void> = [];
  
  // Add a new analytics provider
  addProvider(provider: AnalyticsProvider): void {
    this.providers.push(provider);
  }
  
  // Initialize all providers
  async initialize(): Promise<boolean> {
    try {
      const results = await Promise.all(
        this.providers.map(provider => provider.initialize())
      );
      
      this.initialized = results.every(result => result);
      
      // Process queued events once initialized
      if (this.initialized && this.queue.length > 0) {
        this.queue.forEach(fn => fn());
        this.queue = [];
      }
      
      return this.initialized;
    } catch (error) {
      console.error('[Analytics] Failed to initialize providers:', error);
      return false;
    }
  }
  
  // Track an event across all providers
  trackEvent(event: TrackingEvent): void {
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      priority: event.priority || EventPriority.MEDIUM
    };
    
    if (!this.initialized) {
      this.queue.push(() => this.doTrackEvent(enrichedEvent));
      return;
    }
    
    this.doTrackEvent(enrichedEvent);
  }
  
  private doTrackEvent(event: TrackingEvent): void {
    this.providers.forEach(provider => {
      try {
        provider.trackEvent(event);
      } catch (error) {
        console.error(`[Analytics] Error tracking event with provider ${provider.name}:`, error);
      }
    });
  }
  
  // Identify a user across all providers
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;
    
    if (traits) {
      this.userProperties = { ...this.userProperties, ...traits };
    }
    
    if (!this.initialized) {
      this.queue.push(() => this.doIdentify());
      return;
    }
    
    this.doIdentify();
  }
  
  private doIdentify(): void {
    if (!this.userId) return;
    
    this.providers.forEach(provider => {
      try {
        provider.identify(this.userId!, this.userProperties);
      } catch (error) {
        console.error(`[Analytics] Error identifying user with provider ${provider.name}:`, error);
      }
    });
  }
  
  // Set user properties across all providers
  setUserProperties(properties: Record<string, any>): void {
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (!this.initialized) {
      this.queue.push(() => this.doSetUserProperties());
      return;
    }
    
    this.doSetUserProperties();
  }
  
  private doSetUserProperties(): void {
    this.providers.forEach(provider => {
      try {
        provider.setUserProperties(this.userProperties);
      } catch (error) {
        console.error(`[Analytics] Error setting user properties with provider ${provider.name}:`, error);
      }
    });
  }
  
  // Track page view across all providers
  pageView(path: string, properties?: Record<string, any>): void {
    if (!this.initialized) {
      this.queue.push(() => this.doPageView(path, properties));
      return;
    }
    
    this.doPageView(path, properties);
  }
  
  private doPageView(path: string, properties?: Record<string, any>): void {
    this.providers.forEach(provider => {
      try {
        provider.pageView(path, properties);
      } catch (error) {
        console.error(`[Analytics] Error tracking page view with provider ${provider.name}:`, error);
      }
    });
  }
}

// Create and configure the analytics manager
const analytics = new AnalyticsManager();

// Add the console provider by default in development
if (process.env.NODE_ENV === 'development') {
  analytics.addProvider(new ConsoleAnalyticsProvider());
}

// Initialize analytics on load
analytics.initialize();

// Export the analytics instance
export default analytics;

// Helper functions for common events
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

export const trackHealthMetricViewed = (metricType: string) => {
  analytics.trackEvent({
    name: 'health_metric_viewed',
    category: EventCategory.HEALTH,
    properties: {
      metricType
    }
  });
};

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
