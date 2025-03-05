
/**
 * Error handling types
 * 
 * Following CodeFarm Development Methodology:
 * - Modular Architecture: Separated type definitions
 * - Documentation: Clear documentation at module level
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
 * Standardized error object for consistent handling
 */
export interface AppError {
  message: string;
  code?: string;
  severity: ErrorSeverity;
  context?: Record<string, any>;
  originalError?: unknown;
}
