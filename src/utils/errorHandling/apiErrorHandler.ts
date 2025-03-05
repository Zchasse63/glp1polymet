
import { toast } from '@/components/ui/use-toast';
import { ErrorSeverity, ErrorGroup } from './types';
import { ErrorLogger } from './ErrorLogger';

/**
 * Handle API errors consistently across the application
 * 
 * @param error The error that occurred during the API call
 * @param context Additional context information to aid debugging
 * @param showToast Whether to show a user-facing toast notification
 * @returns The processed error message
 */
export const handleApiError = (
  error: unknown, 
  context: Record<string, any> = {},
  showToast = true
): string => {
  let errorMessage = 'An unexpected error occurred';
  let errorCode = 'API_ERROR';
  
  // Attempt to extract message and status from the error
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message);
    if ('code' in error) {
      errorCode = String((error as any).code);
    }
  }

  // Log the error with full context
  ErrorLogger.error(
    errorMessage,
    errorCode,
    { ...context, originalError: error },
    error,
    false,
    ErrorSeverity.ERROR,
    ErrorGroup.API
  );

  // Show a toast notification if requested
  if (showToast) {
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    });
  }

  return errorMessage;
};

/**
 * Wrap an API call with consistent error handling
 * 
 * @param apiCall The async API function to call
 * @param errorContext Context information for error reporting
 * @param showToast Whether to show a toast on error
 * @returns The result of the API call, or throws an error
 */
export async function withErrorHandling<T>(
  apiCall: () => Promise<T>,
  errorContext: Record<string, any> = {},
  showToast = true
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    handleApiError(error, errorContext, showToast);
    throw error;
  }
}
