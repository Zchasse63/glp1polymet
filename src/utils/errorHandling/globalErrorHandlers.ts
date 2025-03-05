
/**
 * Global Error Handlers
 * 
 * Following CodeFarm Development Methodology:
 * - Error Containment: Centralized error handling
 * - User-Centric Design: User-friendly error notifications
 */
import { toast } from '@/components/ui/use-toast';
import { ErrorLogger } from './ErrorLogger';
import { ErrorGroup, ErrorSeverity } from './types';
import analytics, { EventCategory, EventPriority } from '../eventTracking';

// Track unique errors to prevent flooding
const errorTracker = {
  recentErrors: new Map<string, { count: number, timestamp: number }>(),
  
  // Check if an error should be throttled
  shouldThrottle(errorKey: string): boolean {
    const now = Date.now();
    const errorData = this.recentErrors.get(errorKey);
    
    // If we've seen this error recently
    if (errorData) {
      // Check if we're within the 5-minute window
      if (now - errorData.timestamp < 5 * 60 * 1000) {
        // Increment the count
        errorData.count++;
        this.recentErrors.set(errorKey, errorData);
        
        // Throttle if we've seen it 3+ times
        return errorData.count >= 3;
      } else {
        // Reset if it's been more than 5 minutes
        this.recentErrors.set(errorKey, { count: 1, timestamp: now });
        return false;
      }
    } else {
      // First time seeing this error
      this.recentErrors.set(errorKey, { count: 1, timestamp: now });
      return false;
    }
  },
  
  // Clean up old error entries
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, data] of this.recentErrors.entries()) {
      if (now - data.timestamp > 30 * 60 * 1000) { // 30 minutes
        this.recentErrors.delete(key);
      }
    }
  }
};

// Clean up the error tracker periodically
if (typeof window !== 'undefined') {
  setInterval(() => errorTracker.cleanup(), 15 * 60 * 1000); // Every 15 minutes
}

/**
 * Global error handler for uncaught exceptions
 */
export function setupGlobalErrorHandlers(): void {
  // Handle unhandled errors
  window.addEventListener('error', (event) => {
    const errorKey = `${event.filename}:${event.lineno}:${event.message}`;
    const throttled = errorTracker.shouldThrottle(errorKey);
    
    if (!throttled) {
      ErrorLogger.critical(
        'Uncaught exception', 
        'UNCAUGHT_EXCEPTION', 
        {
          fileName: event.filename,
          lineNumber: event.lineno,
          columnNumber: event.colno
        }, 
        event.error,
        true,
        "We're sorry, something went wrong. You may need to refresh the page."
      );
      
      // Show user-friendly error notification
      toast({
        variant: "destructive",
        title: "An unexpected error occurred",
        description: "We're sorry for the inconvenience. The application might not work correctly."
      });
    }
    
    return false; // Let the error propagate
  });
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason;
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorKey = `unhandledrejection:${errorMessage}`;
    const throttled = errorTracker.shouldThrottle(errorKey);
    
    if (!throttled) {
      ErrorLogger.critical(
        'Unhandled promise rejection', 
        'UNHANDLED_REJECTION', 
        {
          reason: errorMessage
        }, 
        event.reason,
        true,
        "A background operation failed. Please try again or reload the page."
      );
      
      // Show user-friendly error notification
      toast({
        variant: "destructive",
        title: "Background operation failed",
        description: "Something went wrong. Please try again or reload the page."
      });
    }
    
    return false; // Let the error propagate
  });
  
  // Monitor network status
  if (typeof window !== 'undefined' && 'navigator' in window) {
    window.addEventListener('online', () => {
      ErrorLogger.info('Network connection restored', 'NETWORK_ONLINE');
      
      toast({
        title: "You're back online",
        description: "Your network connection has been restored."
      });
      
      // Track in analytics
      analytics.trackEvent({
        name: 'network_status_changed',
        category: EventCategory.HEALTH,
        priority: EventPriority.LOW,
        properties: {
          status: 'online'
        }
      });
    });
    
    window.addEventListener('offline', () => {
      ErrorLogger.warning(
        'Network connection lost', 
        'NETWORK_OFFLINE', 
        {},
        undefined,
        true,
        "You're offline. Some features may not work until your connection is restored."
      );
      
      // Track in analytics
      analytics.trackEvent({
        name: 'network_status_changed',
        category: EventCategory.HEALTH,
        priority: EventPriority.MEDIUM,
        properties: {
          status: 'offline'
        }
      });
    });
  }
}
