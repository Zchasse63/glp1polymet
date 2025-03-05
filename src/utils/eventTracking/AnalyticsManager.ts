
/**
 * Analytics Manager
 * 
 * Core engine for tracking events across multiple providers
 */
import { AnalyticsProvider, TrackingEvent, EventPriority } from './types';

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

// Create and export a singleton instance
const analytics = new AnalyticsManager();
export default analytics;
