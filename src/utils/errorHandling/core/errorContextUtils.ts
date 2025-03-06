
/**
 * Error Context Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Focused on error context preparation
 * - Sustainable Code: Consistent context generation
 */
import { AppError, ErrorGroup } from '../types';

/**
 * Prepare standardized context for error logging
 */
export function getErrorContext(error: AppError): Record<string, any> {
  return {
    ...(error.context || {}),
    timestamp: new Date().toISOString(),
    errorCode: error.code || 'UNKNOWN',
    severity: error.severity,
    group: error.group || ErrorGroup.GENERAL,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
  };
}
