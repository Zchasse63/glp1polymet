
/**
 * Error Handling Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Error Handling: Standardized error handling
 * - Sustainable Code: Reusable utilities
 */

import { ErrorLogger } from './ErrorLogger';
import { ErrorSeverity, ErrorGroup } from './types';

/**
 * Format error message from any error type
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unknown error occurred';
}

/**
 * Safely log an error with consistent formatting
 */
export function logError(
  message: string,
  error: unknown,
  context: Record<string, any> = {}
): void {
  const formattedMessage = `${message}: ${formatErrorMessage(error)}`;
  
  ErrorLogger.error(
    formattedMessage,
    'GENERAL_ERROR',
    context,
    error
  );
}

/**
 * Create a standardized error handler function
 */
export function createErrorHandler(
  operationName: string,
  errorCode: string,
  severity: ErrorSeverity = ErrorSeverity.ERROR,
  group: ErrorGroup = ErrorGroup.GENERAL,
  shouldNotifyUser: boolean = true
) {
  return (error: unknown, context: Record<string, any> = {}): void => {
    const message = `Error in ${operationName}: ${formatErrorMessage(error)}`;
    
    ErrorLogger.log({
      message,
      code: errorCode,
      severity,
      group,
      context,
      originalError: error,
      shouldNotifyUser
    });
  };
}

/**
 * Handle API errors with standardized approach
 */
export function handleApiError(
  apiName: string,
  error: unknown,
  context: Record<string, any> = {}
): void {
  logError(
    `API Error: ${apiName}`,
    error,
    context
  );
}

/**
 * Safe function execution with error handling
 */
export async function trySafe<T>(
  fn: () => Promise<T> | T,
  errorHandler?: (error: unknown) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      logError('Operation failed', error);
    }
    return null;
  }
}
