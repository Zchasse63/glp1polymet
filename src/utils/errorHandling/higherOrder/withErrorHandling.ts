
/**
 * Error Handling Higher-Order Function
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Focused on wrapping functions with error handling
 * - Error Containment: Centralized error handling pattern
 */
import { ErrorLogger } from '../ErrorLogger';
import { AppError, ErrorSeverity, ErrorGroup } from '../types';

/**
 * Create a higher-order function to wrap any function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    errorCode?: string;
    severity?: ErrorSeverity;
    group?: ErrorGroup;
    shouldNotifyUser?: boolean;
    userMessage?: string;
    userTitle?: string;
    context?: Record<string, any> | ((...args: Parameters<T>) => Record<string, any>);
  } = {}
): (...args: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    try {
      return fn(...args);
    } catch (error) {
      // Prepare context
      const contextData = typeof options.context === 'function'
        ? options.context(...args)
        : options.context || {};
      
      // Log the error
      ErrorLogger.log({
        message: error instanceof Error ? error.message : String(error),
        code: options.errorCode || 'FUNCTION_ERROR',
        severity: options.severity || ErrorSeverity.ERROR,
        group: options.group || ErrorGroup.GENERAL,
        context: contextData,
        originalError: error,
        shouldNotifyUser: options.shouldNotifyUser !== false, // Default to true
        userMessage: options.userMessage,
        userTitle: options.userTitle
      });
      
      // Re-throw the error to maintain original behavior
      throw error;
    }
  };
}
