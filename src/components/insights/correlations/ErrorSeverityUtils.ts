
import { ErrorSeverity } from "@/utils/errorHandling";

/**
 * Determine error severity based on error message and type
 * 
 * Following CodeFarm principles:
 * - Error Handling: Categorize errors for appropriate UI treatment
 */
export const getErrorSeverity = (err: Error | null): ErrorSeverity => {
  if (!err) return ErrorSeverity.ERROR;
  
  const message = err.message.toLowerCase();
  
  // Network-related errors are generally recoverable
  if (
    message.includes('network') || 
    message.includes('connection') ||
    message.includes('offline') ||
    message.includes('internet') ||
    err.name === 'NetworkError' ||
    message.includes('failed to fetch')
  ) {
    return ErrorSeverity.WARNING;
  }
  
  // Timeout errors are often temporary
  if (
    message.includes('timeout') || 
    message.includes('timed out') ||
    err.name === 'TimeoutError'
  ) {
    return ErrorSeverity.WARNING;
  }
  
  // Authentication/permission errors are more serious
  if (
    message.includes('permission') || 
    message.includes('forbidden') || 
    message.includes('unauthorized') ||
    message.includes('authentication') ||
    message.includes('auth') ||
    err.name === 'AuthError'
  ) {
    return ErrorSeverity.CRITICAL;
  }
  
  // Data validation errors
  if (
    message.includes('validation') ||
    message.includes('invalid') ||
    message.includes('schema') ||
    err.name === 'ValidationError'
  ) {
    return ErrorSeverity.ERROR;
  }
  
  // Default to standard error
  return ErrorSeverity.ERROR;
};

/**
 * Get user-friendly error message based on error
 */
export const getUserFriendlyErrorMessage = (err: Error | null): string => {
  if (!err) return "An unknown error occurred";
  
  const message = err.message.toLowerCase();
  
  if (message.includes('network') || message.includes('connection') || message.includes('offline')) {
    return "Network connection error. Please check your internet connection.";
  }
  
  if (message.includes('timeout') || message.includes('timed out')) {
    return "The request timed out. Please try again.";
  }
  
  if (message.includes('permission') || message.includes('forbidden') || message.includes('unauthorized')) {
    return "You don't have permission to access this resource.";
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return "The requested data could not be found.";
  }
  
  // If no specific message matched, return the original error message
  // but make sure it's properly capitalized and has proper punctuation
  const originalMessage = err.message;
  if (!originalMessage) return "An error occurred";
  
  // Capitalize first letter and ensure it ends with period
  return originalMessage.charAt(0).toUpperCase() + 
         originalMessage.slice(1) + 
         (originalMessage.endsWith('.') ? '' : '.');
};

/**
 * Determine if an error is likely recoverable with a retry
 */
export const isRetryableError = (err: Error | null): boolean => {
  if (!err) return false;
  
  const message = err.message.toLowerCase();
  
  // These types of errors might resolve with a retry
  return (
    message.includes('network') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    message.includes('timed out') ||
    message.includes('server') ||
    message.includes('5') // 5xx errors
  );
};
