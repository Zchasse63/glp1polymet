
/**
 * Error Logger Service
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Focus on error logging
 * - Sustainable Code: Consistent error recording
 */
import { AppError, ErrorSeverity } from './types';

/**
 * Centralized error logging service
 * In production, this would send errors to a monitoring service
 */
export const ErrorLogger = {
  log(error: AppError): void {
    // In production, integrate with monitoring services like Sentry
    console.error(`[${error.severity.toUpperCase()}] ${error.code || 'UNKNOWN'}: ${error.message}`, {
      context: error.context,
      originalError: error.originalError
    });
  },
  
  // Helper methods for different severity levels
  info(message: string, code?: string, context?: Record<string, any>): void {
    this.log({ message, code, severity: ErrorSeverity.INFO, context });
  },
  
  warning(message: string, code?: string, context?: Record<string, any>): void {
    this.log({ message, code, severity: ErrorSeverity.WARNING, context });
  },
  
  error(message: string, code?: string, context?: Record<string, any>, originalError?: unknown): void {
    this.log({ message, code, severity: ErrorSeverity.ERROR, context, originalError });
  },
  
  critical(message: string, code?: string, context?: Record<string, any>, originalError?: unknown): void {
    this.log({ message, code, severity: ErrorSeverity.CRITICAL, context, originalError });
  }
};
