/**
 * Error Logger Service
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Focus on error logging
 * - Sustainable Code: Consistent error recording
 * - Error Handling: Centralized error reporting
 */
import { toast } from '@/components/ui/use-toast';
import analytics, { EventCategory, EventPriority } from '../eventTracking';
import { AppError, ErrorSeverity, ErrorGroup } from './types';

// Maximum number of errors to store in memory
const MAX_ERROR_BUFFER_SIZE = 50;

/**
 * Centralized error logging service
 * In production, this would send errors to a monitoring service
 */
export const ErrorLogger = {
  // In-memory buffer of recent errors for debugging
  errorBuffer: [] as AppError[],
  
  // Add error to buffer, maintaining max size
  addToBuffer(error: AppError): void {
    this.errorBuffer.unshift(error);
    
    // Keep buffer size under control
    if (this.errorBuffer.length > MAX_ERROR_BUFFER_SIZE) {
      this.errorBuffer.pop();
    }
  },
  
  // Central error logging function
  log(error: AppError): void {
    // Add to in-memory buffer
    this.addToBuffer(error);
    
    // Prepare context for logging
    const context = {
      ...(error.context || {}),
      timestamp: new Date().toISOString(),
      errorCode: error.code || 'UNKNOWN',
      severity: error.severity,
      group: error.group || ErrorGroup.GENERAL,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    };
    
    // Log to console with appropriate level
    switch (error.severity) {
      case ErrorSeverity.INFO:
        console.info(`[INFO] ${error.code || 'INFO'}: ${error.message}`, context);
        break;
      case ErrorSeverity.WARNING:
        console.warn(`[WARNING] ${error.code || 'WARN'}: ${error.message}`, context);
        break;
      case ErrorSeverity.ERROR:
        console.error(`[ERROR] ${error.code || 'ERROR'}: ${error.message}`, context, error.originalError);
        break;
      case ErrorSeverity.CRITICAL:
        console.error(`[CRITICAL] ${error.code || 'CRITICAL'}: ${error.message}`, context, error.originalError);
        break;
      default:
        console.error(`[${error.severity.toUpperCase()}] ${error.code || 'UNKNOWN'}: ${error.message}`, context);
    }
    
    // Track error in analytics for high-severity issues
    if (error.severity === ErrorSeverity.ERROR || error.severity === ErrorSeverity.CRITICAL) {
      analytics.trackEvent({
        name: 'error_occurred',
        category: EventCategory.ERROR,
        priority: error.severity === ErrorSeverity.CRITICAL ? EventPriority.CRITICAL : EventPriority.HIGH,
        properties: {
          errorCode: error.code,
          message: error.message,
          severity: error.severity,
          group: error.group,
          timestamp: new Date().toISOString(),
          // Don't include full context to avoid sensitive data
          url: context.url
        }
      });
    }
    
    // Show user-facing notification for critical errors if configured
    if (error.shouldNotifyUser && error.severity === ErrorSeverity.CRITICAL) {
      toast({
        variant: "destructive",
        title: error.userTitle || "Something went wrong",
        description: error.userMessage || "We're having trouble with this operation. Please try again later.",
      });
    }
  },
  
  // Helper methods for different severity levels
  info(message: string, code?: string, context?: Record<string, any>, shouldNotifyUser?: boolean, userMessage?: string): void {
    this.log({ 
      message, 
      code, 
      severity: ErrorSeverity.INFO, 
      context,
      shouldNotifyUser,
      userMessage
    });
  },
  
  warning(message: string, code?: string, context?: Record<string, any>, originalError?: unknown, shouldNotifyUser?: boolean, userMessage?: string): void {
    this.log({ 
      message, 
      code, 
      severity: ErrorSeverity.WARNING, 
      context, 
      originalError,
      shouldNotifyUser,
      userMessage
    });
  },
  
  error(message: string, code?: string, context?: Record<string, any>, originalError?: unknown, shouldNotifyUser?: boolean, userMessage?: string): void {
    this.log({ 
      message, 
      code, 
      severity: ErrorSeverity.ERROR, 
      context, 
      originalError,
      shouldNotifyUser,
      userMessage: userMessage || "An error occurred. Please try again."
    });
  },
  
  critical(message: string, code?: string, context?: Record<string, any>, originalError?: unknown, shouldNotifyUser: boolean = true, userMessage?: string, userTitle?: string): void {
    this.log({ 
      message, 
      code, 
      severity: ErrorSeverity.CRITICAL, 
      context, 
      originalError,
      shouldNotifyUser,
      userMessage: userMessage || "Something went wrong. Please try again later or contact support.",
      userTitle: userTitle || "Error"
    });
  },
  
  // Get recent errors for debugging
  getRecentErrors(): AppError[] {
    return [...this.errorBuffer];
  },
  
  // Clear error buffer
  clearBuffer(): void {
    this.errorBuffer = [];
  }
};
