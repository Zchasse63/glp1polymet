
/**
 * Analytics Manager
 * 
 * Core engine for tracking events across multiple providers
 * Following CodeFarm Development Methodology:
 * - Error Containment: Robust error handling
 * - Modularity: Provider-agnostic implementation
 */
import { 
  AnalyticsProvider, 
  TrackingEvent, 
  EventPriority, 
  AnalyticsConfig,
  ProviderStatus,
  EventCategory
} from './types';
import { ErrorLogger } from '../errorHandling';

class AnalyticsManager {
  private providers: AnalyticsProvider[] = [];
  private config: AnalyticsConfig = {
    enabled: true,
    debug: false,
    disabledProviders: [],
    respectDoNotTrack: true,
    samplingRate: 1.0, // 100% by default
    anonymizeIp: true
  };
  private userId: string | null = null;
  private userProperties: Record<string, any> = {};
  private initialized = false;
  
  // Add a new analytics provider
  addProvider(provider: AnalyticsProvider): void {
    // Check if provider already exists
    const existingProvider = this.providers.find(p => p.name === provider.name);
    if (existingProvider) {
      console.warn(`Provider ${provider.name} already exists. Skipping.`);
      return;
    }
    
    this.providers.push(provider);
    this.debug(`Provider ${provider.name} added`);
  }
  
  // Remove a provider by name
  removeProvider(providerName: string): boolean {
    const initialLength = this.providers.length;
    this.providers = this.providers.filter(p => p.name !== providerName);
    
    const removed = initialLength > this.providers.length;
    if (removed) {
      this.debug(`Provider ${providerName} removed`);
    }
    
    return removed;
  }
  
  // Get a provider by name
  getProvider(providerName: string): AnalyticsProvider | undefined {
    return this.providers.find(p => p.name === providerName);
  }
  
  // Initialize all providers
  async initialize(): Promise<boolean> {
    if (this.initialized) {
      return true;
    }
    
    // Skip if analytics is disabled
    if (!this.config.enabled) {
      this.debug('Analytics disabled, skipping initialization');
      return false;
    }
    
    // Respect Do Not Track browser setting
    if (this.config.respectDoNotTrack && this.isDoNotTrackEnabled()) {
      this.debug('Do Not Track enabled in browser, skipping initialization');
      return false;
    }
    
    // Initialize each provider
    const results = await Promise.all(
      this.providers.map(provider => this.initializeProvider(provider))
    );
    
    // Check if all providers initialized successfully
    this.initialized = results.every(result => result);
    
    if (this.initialized) {
      this.debug('All providers initialized successfully');
    } else {
      this.debug('Some providers failed to initialize');
    }
    
    return this.initialized;
  }
  
  // Initialize a single provider
  private async initializeProvider(provider: AnalyticsProvider): Promise<boolean> {
    // Skip if provider is disabled
    if (this.isProviderDisabled(provider.name)) {
      this.debug(`Provider ${provider.name} is disabled, skipping initialization`);
      return false;
    }
    
    try {
      // Initialize the provider
      const success = await provider.initialize();
      
      if (success) {
        this.debug(`Provider ${provider.name} initialized successfully`);
        
        // Set user ID and properties if already available
        if (this.userId) {
          this.doIdentify();
        }
        
        if (Object.keys(this.userProperties).length > 0) {
          this.doSetUserProperties();
        }
      } else {
        this.debug(`Provider ${provider.name} initialization failed`);
      }
      
      return success;
    } catch (error) {
      this.handleProviderError(provider.name, 'initialize', error);
      return false;
    }
  }
  
  // Configure analytics manager
  configure(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    this.debug('Configuration updated', this.config);
  }
  
  // Track an event across all providers
  trackEvent(event: TrackingEvent): void {
    // Skip if analytics is disabled
    if (!this.config.enabled) {
      return;
    }
    
    // Skip if event doesn't meet sampling rate
    if (Math.random() > this.config.samplingRate) {
      return;
    }
    
    this.doTrackEvent(event);
  }
  
  private doTrackEvent(event: TrackingEvent): void {
    // Track across all providers
    this.providers.forEach(provider => {
      // Skip if provider is disabled
      if (this.isProviderDisabled(provider.name) || provider.status !== ProviderStatus.INITIALIZED) {
        return;
      }
      
      try {
        provider.trackEvent(event);
        this.debug(`Event ${event.name} tracked with ${provider.name}`, event);
      } catch (error) {
        this.handleProviderError(provider.name, 'trackEvent', error, { event });
      }
    });
    
    // For critical errors, ensure they're also logged to our error system
    if (
      event.category === EventCategory.ERROR && 
      event.priority === EventPriority.CRITICAL &&
      event.properties?.message
    ) {
      // Fix: Remove the fourth argument which is causing the TS error
      ErrorLogger.error(
        String(event.properties.message),
        String(event.name),
        event.properties
      );
    }
  }
  
  // Identify a user across all providers
  identify(userId: string, traits?: Record<string, any>): void {
    if (!userId) return;
    
    this.userId = userId;
    
    if (traits) {
      this.userProperties = { ...this.userProperties, ...traits };
    }
    
    // Skip if analytics is disabled
    if (!this.config.enabled) {
      return;
    }
    
    this.doIdentify();
  }
  
  private doIdentify(): void {
    if (!this.userId) return;
    
    // Identify across all providers
    this.providers.forEach(provider => {
      // Skip if provider is disabled
      if (this.isProviderDisabled(provider.name) || provider.status !== ProviderStatus.INITIALIZED) {
        return;
      }
      
      try {
        provider.identify(this.userId!, this.userProperties);
        this.debug(`User ${this.userId} identified with ${provider.name}`);
      } catch (error) {
        this.handleProviderError(provider.name, 'identify', error);
      }
    });
  }
  
  // Set user properties across all providers
  setUserProperties(properties: Record<string, any>): void {
    if (!properties || Object.keys(properties).length === 0) return;
    
    this.userProperties = { ...this.userProperties, ...properties };
    
    // Skip if analytics is disabled
    if (!this.config.enabled) {
      return;
    }
    
    this.doSetUserProperties();
  }
  
  private doSetUserProperties(): void {
    // Skip if no user properties
    if (Object.keys(this.userProperties).length === 0) return;
    
    // Set user properties across all providers
    this.providers.forEach(provider => {
      // Skip if provider is disabled
      if (this.isProviderDisabled(provider.name) || provider.status !== ProviderStatus.INITIALIZED) {
        return;
      }
      
      try {
        if (provider.setUserProperties) {
          provider.setUserProperties(this.userProperties);
          this.debug(`User properties set with ${provider.name}`, this.userProperties);
        }
      } catch (error) {
        this.handleProviderError(provider.name, 'setUserProperties', error);
      }
    });
  }
  
  // Track page view across all providers
  pageView(path: string, properties?: Record<string, any>): void {
    if (!path) return;
    
    // Skip if analytics is disabled
    if (!this.config.enabled) {
      return;
    }
    
    this.doPageView(path, properties);
  }
  
  private doPageView(path: string, properties?: Record<string, any>): void {
    // Track page view across all providers
    this.providers.forEach(provider => {
      // Skip if provider is disabled
      if (this.isProviderDisabled(provider.name) || provider.status !== ProviderStatus.INITIALIZED) {
        return;
      }
      
      try {
        if (provider.pageView) {
          provider.pageView(path, properties);
          this.debug(`Page view tracked for ${path} with ${provider.name}`);
        } else {
          // Fall back to trackEvent if pageView not implemented
          provider.trackEvent({
            name: 'page_view',
            category: EventCategory.USER_JOURNEY,
            priority: EventPriority.MEDIUM,
            properties: {
              path,
              ...properties
            }
          });
        }
      } catch (error) {
        this.handleProviderError(provider.name, 'pageView', error, { path, properties });
      }
    });
  }
  
  // Check if Do Not Track is enabled in the browser
  private isDoNotTrackEnabled(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return false;
    }
    
    const dnt = navigator.doNotTrack || (window as any).doNotTrack;
    return dnt === '1' || dnt === 'yes' || dnt === true;
  }
  
  // Check if a provider is disabled in configuration
  private isProviderDisabled(providerName: string): boolean {
    return this.config.disabledProviders.includes(providerName);
  }
  
  // Handle provider errors consistently
  private handleProviderError(
    providerName: string, 
    operation: string, 
    error: unknown,
    context?: Record<string, any>
  ): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    console.error(`Error in ${providerName} provider during ${operation}: ${errorMessage}`, error);
    
    if (this.config.debug) {
      console.error('Context:', context);
    }
    
    // Log to error system
    ErrorLogger.warning(
      `Analytics error: ${errorMessage}`,
      `ANALYTICS_${operation.toUpperCase()}_ERROR`,
      {
        provider: providerName,
        operation,
        context
      }
    );
  }
  
  // Debug logging (only in development or when debug mode is enabled)
  private debug(message: string, data?: any): void {
    if (this.config.debug) {
      console.debug(`[Analytics] ${message}`, data);
    }
  }
}

// Create and export a singleton instance
const analytics = new AnalyticsManager();
export default analytics;
