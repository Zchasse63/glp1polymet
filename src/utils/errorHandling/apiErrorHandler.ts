
import { toast } from '@/hooks/use-toast';
import { ErrorLogger } from './ErrorLogger';
import { ErrorSeverity, ErrorGroup } from './types';

/**
 * Handles API errors consistently across the application
 * Following CodeFarm Development Methodology:
 * - Sustainable Code: Centralized error handling
 * - User-Centric Design: Appropriate user feedback
 */
export const handleApiError = (
  error: unknown,
  {
    fallbackMessage = 'An error occurred while communicating with the server',
    context = {},
    errorCode = 'API_ERROR',
    showToast = true,
  } = {}
) => {
  // Extract error message if available
  let errorMessage = fallbackMessage;
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
  }
  
  // Log the error with consistent structure
  ErrorLogger.error(
    errorMessage,
    errorCode,
    { ...context, originalError: error },
    error,
    showToast
  );

  // Show a toast notification if requested
  if (showToast) {
    toast({
      variant: "destructive",
      title: "Error",
      description: errorMessage,
    });
  }
  
  // Return the error message for possible display in the UI
  return errorMessage;
};

/**
 * Formats a validation error response for display
 */
export const formatValidationErrors = (errors: Record<string, string[]>) => {
  // Convert the errors object to a flat array of messages
  return Object.entries(errors)
    .map(([field, messages]) => {
      // Join multiple messages for the same field
      const fieldMessages = messages.join(', ');
      return `${field}: ${fieldMessages}`;
    })
    .join('\n');
};
