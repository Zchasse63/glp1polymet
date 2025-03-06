
/**
 * Error Logger Service
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Orchestrate error logging components
 * - Modular Architecture: Delegates to specialized modules
 * - Error Handling: Centralized error reporting
 */
import { AppError, ErrorSeverity, ErrorGroup } from './types';
import { errorLoggerCore } from './core/ErrorLoggerCore';
import { notifyUser } from './notifications/userNotifications';
import { trackErrorInAnalytics } from './integrations/analyticsIntegration';
import { fromException } from './helpers/exceptionHelpers';
export { withErrorHandling } from './higherOrder/withErrorHandling';

/**
 * Centralized error logging service
 * In production, this would send errors to a monitoring service
 */
export const ErrorLogger = {
  // Central error logging function
  log(error: AppError): void {
    // Log through core logger
    errorLoggerCore.log(error);
    
    // Track in analytics
    trackErrorInAnalytics(error);
    
    // Show user-facing notification based on settings
    if (error.shouldNotifyUser) {
      notifyUser(error);
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
      shouldNotifyUser: shouldNotifyUser !== false, // Default to true
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
  
  // Utility method for creating error from caught exceptions
  fromException,
  
  // Get recent errors for debugging
  getRecentErrors(): AppError[] {
    return errorLoggerCore.getRecentErrors();
  },
  
  // Clear error buffer
  clearBuffer(): void {
    errorLoggerCore.clearBuffer();
  }
};
