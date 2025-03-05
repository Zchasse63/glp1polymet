
/**
 * Error handling types
 * 
 * Following CodeFarm Development Methodology:
 * - Modular Architecture: Separated type definitions
 * - Documentation: Clear documentation at module level
 * - Error Categorization: Standardized error types
 */

/**
 * Error severity levels for logging and UI treatment
 */
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Error groups for categorizing errors
 */
export enum ErrorGroup {
  GENERAL = 'general',
  API = 'api',
  UI = 'ui',
  DATA = 'data',
  AUTH = 'auth',
  VALIDATION = 'validation',
  NETWORK = 'network',
  PERFORMANCE = 'performance',
  SECURITY = 'security'
}

/**
 * Standardized error object for consistent handling
 */
export interface AppError {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  group?: ErrorGroup;
  context?: Record<string, any>;
  originalError?: unknown;
  shouldNotifyUser?: boolean; // Whether to show a user-facing notification
  userMessage?: string; // User-friendly message to display
  userTitle?: string; // Title for user-facing error notification
  retryable?: boolean; // Whether the operation can be retried
}

/**
 * Error handling strategy options
 */
export enum ErrorHandlingStrategy {
  LOG_ONLY = 'log_only',
  NOTIFY_USER = 'notify_user',
  RETRY = 'retry',
  FALLBACK = 'fallback'
}

/**
 * API Error response structure
 */
export interface ApiErrorResponse {
  status: number;
  code?: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * Error boundary fallback props
 */
export interface ErrorBoundaryFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}
