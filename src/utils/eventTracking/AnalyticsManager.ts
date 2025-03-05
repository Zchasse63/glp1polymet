
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
  private providers: Map<string, AnalyticsProvider> = new Map();
  private initialized = false;
  private initializing = false;
  private userId: string | null = null;
  private userProperties: Record<string, any> = {};
  private queue: Array<() => void> = [];
  private config: AnalyticsConfig = {
    enabled: true,
    debugMode: process.env.NODE_ENV === 'development'
  };
  
  // Add a new analytics provider
  addProvider(provider: AnalyticsProvider): void {
    if (this.providers.has(provider.name)) {
      this.debug(`Provider '${provider.name}' already exists. Replacing.`);
    }
    
    this.providers.set(provider.name, {
      ...provider,
      status: ProviderStatus.PENDING
    });
    
    // Auto-initialize if manager is already initialized
    if (this.initialized && !this.initializing) {
      this.initializeProvider(provider)
        .catch(err => {
          ErrorLogger.error(
            `Failed to initialize provider '${provider.name}'`,
            'ANALYTICS_PROVIDER_INIT_ERROR', 
            { providerName: provider.name },
            err
          );
        });
    }
  }
  
  // Remove a provider by name
  removeProvider(providerName: string): boolean {
    return this.providers.delete(providerName);
  }
  
  // Get a provider by name
  getProvider(providerName: string): AnalyticsProvider | undefined {
    return this.providers.get(providerName);
  }
  
  // Initialize all providers
  async initialize(): Promise<boolean> {
    if (this.initializing) {
      this.debug('Analytics initialization already in progress');
      return false;
    }
    
    if (!this.config.enabled) {
      this.debug('Analytics is disabled by configuration');
      return false;
    }
    
    this.initializing = true;
    
    try {
      if (this.providers.size === 0) {
        this.debug('No analytics providers registered');
        this.initialized = true;
        return true;
      }
      
      const initPromises = Array.from(this.providers.entries()).map(
        async ([name, provider]) => {
          try {
            return await this.initializeProvider(provider);
          } catch (error) {
            ErrorLogger.error(
              `Failed to initialize provider '${name}'`,
              'ANALYTICS_PROVIDER_INIT_ERROR', 
              { providerName: name },
              error
            );
            return false;
          }
        }
      );
      
      const results = await Promise.all(initPromises);
      this.initialized = results.some(result => result);
      
      // Process queued events once initialized
      if (this.initialized && this.queue.length > 0) {
        this.debug(`Processing ${this.queue.length} queued events`);
        this.queue.forEach(fn => fn());
        this.queue = [];
      }
      
      return this.initialized;
    } catch (error) {
      ErrorLogger.error(
        'Failed to initialize analytics providers',
        'ANALYTICS_INIT_ERROR', 
        {},
        error
      );
      return false;
    } finally {
      this.initializing = false;
    }
  }
  
  // Initialize a single provider
  private async initializeProvider(provider: AnalyticsProvider): Promise<boolean> {
    try {
      const result = await provider.initialize();
      
      // Update provider status
      this.providers.set(provider.name, {
        ...provider,
        status: result ? ProviderStatus.INITIALIZED : ProviderStatus.FAILED
      });
      
      return result;
    } catch (error) {
      // Update provider status to failed
      this.providers.set(provider.name, {
        ...provider,
        status: ProviderStatus.FAILED
      });
      
      throw error;
    }
  }
  
  // Configure analytics manager
  configure(config: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Apply immediate configuration changes
    if (config.userId !== undefined) {
      this.userId = config.userId;
      
      if (this.initialized) {
        this.doIdentify();
      }
    }
    
    this.debug(`Analytics configuration updated: ${JSON.stringify(config)}`);
  }
  
  // Track an event across all providers
  trackEvent(event: TrackingEvent): void {
    if (!this.config.enabled) return;
    
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      priority: event.priority || EventPriority.MEDIUM,
      userId: event.userId || this.userId || undefined
    };
    
    if (!this.initialized) {
      this.queue.push(() => this.doTrackEvent(enrichedEvent));
      return;
    }
    
    this.doTrackEvent(enrichedEvent);
  }
  
  private doTrackEvent(event: TrackingEvent): void {
    this.debug(`Tracking event: ${event.name}`, event);
    
    for (const [name, provider] of this.providers.entries()) {
      if (this.isProviderDisabled(name)) {
        continue;
      }
      
      try {
        provider.trackEvent(event);
      } catch (error) {
        this.handleProviderError(
          name, 
          'track event', 
          error,
          { eventName: event.name, category: event.category }
        );
      }
    }
    
    // For critical errors, ensure they're also logged to our error system
    if (
      event.category === EventCategory.ERROR && 
      event.priority === EventPriority.CRITICAL &&
      event.properties?.message
    ) {
      ErrorLogger.error(
        String(event.properties.message),
        String(event.name),
        event.properties
      );
    }
  }
  
  // Identify a user across all providers
  identify(userId: string, traits?: Record<string, any>): void {
    if (!this.config.enabled) return;
    
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
    
    this.debug(`Identifying user: ${this.userId}`, this.userProperties);
    
    for (const [name, provider] of this.providers.entries()) {
      if (this.isProviderDisabled(name)) {
        continue;
      }
      
      try {
        provider.identify(this.userId!, this.userProperties);
      } catch (error) {
        this.handleProviderError(
          name, 
          'identify user', 
          error
        );
      }
    }
  }
  
  // Set user properties across all providers
  setUserProperties(properties: Record<string, any>): void {
    if (!this.config.enabled) return;
    
    this.userProperties = { ...this.userProperties, ...properties };
    
    if (!this.initialized) {
      this.queue.push(() => this.doSetUserProperties());
      return;
    }
    
    this.doSetUserProperties();
  }
  
  private doSetUserProperties(): void {
    this.debug('Setting user properties', this.userProperties);
    
    for (const [name, provider] of this.providers.entries()) {
      if (this.isProviderDisabled(name)) {
        continue;
      }
      
      try {
        provider.setUserProperties(this.userProperties);
      } catch (error) {
        this.handleProviderError(
          name, 
          'set user properties', 
          error
        );
      }
    }
  }
  
  // Track page view across all providers
  pageView(path: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return;
    
    if (!this.initialized) {
      this.queue.push(() => this.doPageView(path, properties));
      return;
    }
    
    this.doPageView(path, properties);
  }
  
  private doPageView(path: string, properties?: Record<string, any>): void {
    this.debug(`Tracking page view: ${path}`, properties);
    
    for (const [name, provider] of this.providers.entries()) {
      if (this.isProviderDisabled(name)) {
        continue;
      }
      
      try {
        provider.pageView(path, properties);
      } catch (error) {
        this.handleProviderError(
          name, 
          'track page view', 
          error,
          { path }
        );
      }
    }
  }
  
  // Check if a provider is disabled in configuration
  private isProviderDisabled(providerName: string): boolean {
    const providerStatus = this.providers.get(providerName)?.status;
    
    // Provider is explicitly disabled in config or failed to initialize
    if (
      (this.config.providers && this.config.providers[providerName] === false) ||
      providerStatus === ProviderStatus.FAILED ||
      providerStatus === ProviderStatus.DISABLED
    ) {
      return true;
    }
    
    return false;
  }
  
  // Handle provider errors consistently
  private handleProviderError(
    providerName: string, 
    operation: string, 
    error: unknown,
    context?: Record<string, any>
  ): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    ErrorLogger.warning(
      `Analytics provider '${providerName}' failed to ${operation}: ${errorMessage}`,
      'ANALYTICS_PROVIDER_ERROR',
      {
        providerName,
        operation,
        ...context
      },
      error
    );
    
    this.debug(`Provider error (${providerName}): ${errorMessage}`, { error, context });
  }
  
  // Debug logging (only in development or when debug mode is enabled)
  private debug(message: string, data?: any): void {
    if (this.config.debugMode) {
      console.debug(`[Analytics] ${message}`, data !== undefined ? data : '');
    }
  }
}

// Create and export a singleton instance
const analytics = new AnalyticsManager();
export default analytics;
