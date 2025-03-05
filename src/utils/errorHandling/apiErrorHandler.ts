
import { ErrorLogger, ErrorSeverity, ErrorGroup } from './index';
import { toast } from '@/hooks/use-toast';

/**
 * Types of API errors that can occur
 */
export enum ApiErrorType {
  NETWORK = 'network',
  TIMEOUT = 'timeout',
  SERVER = 'server',
  VALIDATION = 'validation',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  UNKNOWN = 'unknown'
}

/**
 * Interface for API error responses
 */
export interface ApiErrorResponse {
  status: number;
  type: ApiErrorType;
  message: string;
  details?: Record<string, any>;
}

/**
 * Map HTTP status codes to error types
 */
const mapStatusToErrorType = (status: number): ApiErrorType => {
  switch (status) {
    case 400:
      return ApiErrorType.VALIDATION;
    case 401:
      return ApiErrorType.UNAUTHORIZED;
    case 403:
      return ApiErrorType.FORBIDDEN;
    case 404:
      return ApiErrorType.NOT_FOUND;
    case 409:
      return ApiErrorType.CONFLICT;
    case 408:
      return ApiErrorType.TIMEOUT;
    case 500:
    case 502:
    case 503:
    case 504:
      return ApiErrorType.SERVER;
    default:
      return ApiErrorType.UNKNOWN;
  }
};

/**
 * Get a user-friendly error message based on the error type
 */
const getUserFriendlyMessage = (type: ApiErrorType, originalMessage?: string): string => {
  switch (type) {
    case ApiErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection.';
    case ApiErrorType.TIMEOUT:
      return 'The request timed out. Please try again.';
    case ApiErrorType.SERVER:
      return 'Something went wrong on our end. We\'re working to fix it.';
    case ApiErrorType.VALIDATION:
      return originalMessage || 'Invalid input. Please check your data and try again.';
    case ApiErrorType.UNAUTHORIZED:
      return 'You need to log in to access this resource.';
    case ApiErrorType.FORBIDDEN:
      return 'You don\'t have permission to access this resource.';
    case ApiErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
    case ApiErrorType.CONFLICT:
      return originalMessage || 'This operation conflicts with the current state.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Higher-order function to handle API errors
 * Fixed the return type to use Promise<ReturnType<T>>
 */
export function withApiErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: {
    showToast?: boolean;
    context?: Record<string, any>;
    errorMap?: Record<ApiErrorType, string>;
    onError?: (error: ApiErrorResponse) => void;
  } = {}
): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>> {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      return await fn(...args);
    } catch (error) {
      // Parse the error
      let apiError: ApiErrorResponse;
      
      if (error instanceof Response) {
        // Handle fetch Response error
        const status = error.status;
        let errorData: any = { message: error.statusText };
        
        try {
          errorData = await error.json();
        } catch (e) {
          // If we can't parse JSON, use statusText
        }
        
        apiError = {
          status,
          type: mapStatusToErrorType(status),
          message: errorData.message || error.statusText,
          details: errorData.details
        };
      } else if (error instanceof Error) {
        // Handle standard Error object
        apiError = {
          status: 0,
          type: error.name === 'AbortError' ? ApiErrorType.TIMEOUT : ApiErrorType.NETWORK,
          message: error.message
        };
      } else {
        // Handle unknown error format
        apiError = {
          status: 0,
          type: ApiErrorType.UNKNOWN,
          message: String(error)
        };
      }
      
      // Apply custom error messages if provided
      if (options.errorMap && options.errorMap[apiError.type]) {
        apiError.message = options.errorMap[apiError.type];
      }
      
      // Get user-friendly message
      const userMessage = getUserFriendlyMessage(apiError.type, apiError.message);
      
      // Log the error
      ErrorLogger.error(
        `API Error: ${apiError.message}`,
        `API_${apiError.type.toUpperCase()}`,
        {
          ...options.context,
          status: apiError.status,
          details: apiError.details
        },
        error,
        options.showToast !== false, // Default to true
        userMessage
      );
      
      // Show toast if enabled
      if (options.showToast !== false) {
        toast({
          variant: "destructive",
          title: "Error",
          description: userMessage,
        });
      }
      
      // Call the onError callback if provided
      if (options.onError) {
        options.onError(apiError);
      }
      
      throw apiError;
    }
  };
}

/**
 * Function to handle API errors for one-off API calls
 */
export function handleApiError(
  error: unknown,
  options: {
    showToast?: boolean;
    context?: Record<string, any>;
    errorMap?: Record<ApiErrorType, string>;
  } = {}
): ApiErrorResponse {
  const apiError = parseApiError(error);
  
  // Apply custom error messages if provided
  if (options.errorMap && options.errorMap[apiError.type]) {
    apiError.message = options.errorMap[apiError.type];
  }
  
  // Get user-friendly message
  const userMessage = getUserFriendlyMessage(apiError.type, apiError.message);
  
  // Log the error
  ErrorLogger.error(
    `API Error: ${apiError.message}`,
    `API_${apiError.type.toUpperCase()}`,
    {
      ...options.context,
      status: apiError.status,
      details: apiError.details
    },
    error,
    options.showToast !== false, // Default to true
    userMessage
  );
  
  // Show toast if enabled
  if (options.showToast !== false) {
    toast({
      variant: "destructive",
      title: "Error",
      description: userMessage,
    });
  }
  
  return apiError;
}

/**
 * Helper function to parse errors into a standard format
 */
function parseApiError(error: unknown): ApiErrorResponse {
  if (error instanceof Response) {
    // Handle fetch Response error
    const status = error.status;
    return {
      status,
      type: mapStatusToErrorType(status),
      message: error.statusText
    };
  } else if (error instanceof Error) {
    // Handle standard Error object
    return {
      status: 0,
      type: error.name === 'AbortError' ? ApiErrorType.TIMEOUT : ApiErrorType.NETWORK,
      message: error.message
    };
  } else {
    // Handle unknown error format
    return {
      status: 0,
      type: ApiErrorType.UNKNOWN,
      message: String(error)
    };
  }
}
