
import { ErrorLogger } from './ErrorLogger';
import { ErrorGroup, ErrorSeverity } from './types';

/**
 * Standardized API error handler for consistent error handling
 * Following CodeFarm Development Methodology:
 * - Error Handling: Consistent API error handling
 * - User-Centric Design: Appropriate user feedback
 */

/**
 * Handles API errors in a consistent way
 */
export async function handleApiError<T>(
  promise: Promise<T>,
  options: {
    operation: string;
    errorCode?: string;
    severity?: ErrorSeverity;
    context?: Record<string, any>;
    shouldNotifyUser?: boolean;
    userMessage?: string;
    userTitle?: string;
  }
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    // Default error code based on operation
    const errorCode = options.errorCode || `API_${options.operation.toUpperCase().replace(/\s+/g, '_')}_ERROR`;
    
    // Log the error
    ErrorLogger.log({
      message: error instanceof Error ? error.message : `API Error: ${options.operation}`,
      code: errorCode,
      severity: options.severity || ErrorSeverity.ERROR,
      group: ErrorGroup.API,
      context: {
        operation: options.operation,
        ...options.context
      },
      originalError: error,
      shouldNotifyUser: options.shouldNotifyUser !== false, // Default to true
      userMessage: options.userMessage || `There was a problem with ${options.operation.toLowerCase()}. Please try again.`,
      userTitle: options.userTitle || 'Error'
    });
    
    // Re-throw to allow caller to handle it
    throw error;
  }
}

/**
 * Wraps an API function with standardized error handling
 */
export function withApiErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    operation: string;
    errorCode?: string;
    severity?: ErrorSeverity;
    contextFromArgs?: (...args: Parameters<T>) => Record<string, any>;
    shouldNotifyUser?: boolean;
    userMessage?: string;
    userTitle?: string;
  }
): (...args: Parameters<T>) => ReturnType<T> {
  return async (...args: Parameters<T>): ReturnType<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Get context from args if provided
      const context = options.contextFromArgs ? options.contextFromArgs(...args) : {};
      
      // Log the error
      ErrorLogger.log({
        message: error instanceof Error ? error.message : `API Error: ${options.operation}`,
        code: options.errorCode || `API_${options.operation.toUpperCase().replace(/\s+/g, '_')}_ERROR`,
        severity: options.severity || ErrorSeverity.ERROR,
        group: ErrorGroup.API,
        context: {
          operation: options.operation,
          ...context
        },
        originalError: error,
        shouldNotifyUser: options.shouldNotifyUser !== false, // Default to true
        userMessage: options.userMessage || `There was a problem with ${options.operation.toLowerCase()}. Please try again.`,
        userTitle: options.userTitle || 'Error'
      });
      
      // Re-throw to allow caller to handle it
      throw error;
    }
  };
}
