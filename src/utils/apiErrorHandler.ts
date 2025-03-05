
/**
 * API Error Handler
 * 
 * Following CodeFarm Development Methodology:
 * - Error Handling: Consistent API error processing
 * - User-Centric Design: User-friendly error messages
 */
import { ErrorLogger } from './errorHandling';
import { ErrorGroup, ErrorSeverity } from './errorHandling/types';
import { toast } from '@/components/ui/use-toast';

interface ApiErrorHandlerOptions {
  endpoint: string;
  method?: string;
  notifyUser?: boolean;
  userMessage?: string;
  errorCode?: string;
  context?: Record<string, any>;
  severity?: ErrorSeverity;
  group?: ErrorGroup;
}

/**
 * Handle API errors consistently across the application
 * @param error The caught error
 * @param options Configuration options
 */
export function handleApiError(error: unknown, options: ApiErrorHandlerOptions): void {
  const {
    endpoint,
    method = 'GET',
    notifyUser = true,
    userMessage = 'There was a problem connecting to the server. Please try again.',
    errorCode = 'API_ERROR',
    context = {},
    severity = ErrorSeverity.ERROR,
    group = ErrorGroup.API
  } = options;
  
  // Extract useful information from the error
  let status: number | undefined;
  let errorMessage: string;
  
  if (error instanceof Response) {
    status = error.status;
    errorMessage = `HTTP Error ${error.status}: ${error.statusText}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    
    // Check for network errors
    if (
      error.message.includes('NetworkError') || 
      error.message.includes('network') ||
      error.message.includes('Failed to fetch')
    ) {
      errorMessage = 'Network error: Unable to connect to the server';
    }
    
    // Extract status from common error patterns
    const statusMatch = error.message.match(/(\d{3})/);
    if (statusMatch) {
      status = parseInt(statusMatch[1], 10);
    }
  } else {
    errorMessage = String(error);
  }
  
  // Log the error with appropriate severity
  const logMethod = severity === ErrorSeverity.CRITICAL 
    ? ErrorLogger.critical.bind(ErrorLogger)
    : severity === ErrorSeverity.WARNING
      ? ErrorLogger.warning.bind(ErrorLogger)
      : ErrorLogger.error.bind(ErrorLogger);
  
  logMethod(
    `API Error in ${method} ${endpoint}: ${errorMessage}`,
    errorCode,
    {
      ...context,
      endpoint,
      method,
      status,
      timestamp: new Date().toISOString()
    },
    error,
    notifyUser,
    userMessage
  );
  
  // Show user-friendly error notification if enabled
  if (notifyUser) {
    toast({
      variant: "destructive",
      title: "Error",
      description: userMessage
    });
  }
}

/**
 * Create appropriate user message based on HTTP status code
 * @param status HTTP status code
 * @returns User-friendly error message
 */
export function getErrorMessageForStatus(status?: number): string {
  if (!status) return 'There was a problem connecting to the server. Please try again.';
  
  switch (status) {
    case 400:
      return 'The request was invalid. Please check your information and try again.';
    case 401:
      return 'You need to log in to access this feature.';
    case 403:
      return 'You don\'t have permission to access this resource.';
    case 404:
      return 'The requested information could not be found.';
    case 408:
    case 504:
      return 'The request took too long to complete. Please try again.';
    case 409:
      return 'There was a conflict with your request. Please refresh and try again.';
    case 422:
      return 'The information provided was not valid. Please check your inputs.';
    case 429:
      return 'Too many requests. Please wait a moment and try again.';
    case 500:
    case 502:
    case 503:
      return 'The server encountered an error. Please try again later.';
    default:
      return status >= 400 && status < 500
        ? 'There was a problem with your request. Please try again.'
        : 'There was a server error. Please try again later.';
  }
}
