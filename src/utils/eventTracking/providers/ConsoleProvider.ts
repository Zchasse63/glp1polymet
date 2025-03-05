
/**
 * Console Analytics Provider
 * 
 * Development-friendly provider that logs events to the console
 */
import { AnalyticsProvider, TrackingEvent } from '../types';

export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = 'console';
  
  async initialize(): Promise<boolean> {
    console.log('[Analytics] Initialized console provider');
    return true;
  }
  
  trackEvent(event: TrackingEvent): void {
    console.log(`[Analytics] Event: ${event.name}`, {
      category: event.category,
      properties: event.properties,
      priority: event.priority || 'medium',
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
