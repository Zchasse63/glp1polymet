
/**
 * Console Analytics Provider
 * 
 * Simple provider that logs events to the console for development
 */
import { AnalyticsProvider, TrackingEvent, ProviderStatus } from '../types';

export class ConsoleAnalyticsProvider implements AnalyticsProvider {
  name = 'console';
  status = ProviderStatus.PENDING;
  private enabled = true;
  
  constructor(private options: { 
    colorized?: boolean;
    showTimestamp?: boolean;
    logLevel?: 'debug' | 'info' | 'log';
  } = {}) {
    this.options = {
      colorized: true,
      showTimestamp: true,
      logLevel: 'debug',
      ...options
    };
  }

  async initialize(): Promise<boolean> {
    console.debug('[Analytics:Console] Provider initialized');
    this.status = ProviderStatus.INITIALIZED;
    return true;
  }

  trackEvent(event: TrackingEvent): void {
    if (!this.enabled) return;

    const timestamp = this.options.showTimestamp 
      ? new Date(event.timestamp || Date.now()).toISOString() 
      : null;
    
    const logFunction = this.getLogFunction();
    
    if (this.options.colorized) {
      const categoryColor = this.getCategoryColor(event.category);
      const priorityColor = this.getPriorityColor(event.priority);
      
      logFunction(
        `%c[${event.category}]%c [${event.priority || 'medium'}]%c ${event.name}`,
        `color: ${categoryColor}; font-weight: bold;`,
        `color: ${priorityColor};`,
        'color: inherit;',
        {
          ...(timestamp ? { timestamp } : {}),
          ...event.properties
        }
      );
    } else {
      logFunction(
        `[${event.category}] [${event.priority || 'medium'}] ${event.name}`,
        {
          ...(timestamp ? { timestamp } : {}),
          ...event.properties
        }
      );
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    if (!this.enabled) return;
    
    const logFunction = this.getLogFunction();
    logFunction(
      '[Analytics:Console] User identified:',
      { userId, ...(traits || {}) }
    );
  }

  setUserProperties(properties: Record<string, any>): void {
    if (!this.enabled) return;
    
    const logFunction = this.getLogFunction();
    logFunction(
      '[Analytics:Console] User properties updated:',
      properties
    );
  }

  pageView(path: string, properties?: Record<string, any>): void {
    if (!this.enabled) return;
    
    const logFunction = this.getLogFunction();
    logFunction(
      '[Analytics:Console] Page view:',
      { path, ...(properties || {}) }
    );
  }

  // Enable or disable logging
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  private getLogFunction(): (message: string, ...args: any[]) => void {
    switch (this.options.logLevel) {
      case 'debug':
        return console.debug;
      case 'info':
        return console.info;
      case 'log':
      default:
        return console.log;
    }
  }

  private getCategoryColor(category: string): string {
    switch (category) {
      case 'user': return '#4CAF50'; // green
      case 'engagement': return '#2196F3'; // blue
      case 'feature': return '#9C27B0'; // purple
      case 'error': return '#F44336'; // red
      case 'performance': return '#FF9800'; // orange
      case 'health': return '#00BCD4'; // cyan
      case 'security': return '#E91E63'; // pink
      default: return '#757575'; // grey
    }
  }

  private getPriorityColor(priority?: string): string {
    switch (priority) {
      case 'critical': return '#FF0000'; // bright red
      case 'high': return '#F44336'; // red
      case 'medium': return '#FF9800'; // orange
      case 'low': return '#4CAF50'; // green
      default: return '#757575'; // grey
    }
  }
}
