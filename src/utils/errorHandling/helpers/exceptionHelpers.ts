
/**
 * Exception Handling Helpers
 * 
 * Following CodeFarm Development Methodology:
 * - Error Containment: Standardized exception handling
 * - Sustainable Code: Consistent error generation
 */
import { AppError, ErrorSeverity, ErrorGroup } from '../types';

/**
 * Create a standardized AppError from a caught exception
 */
export function fromException(error: unknown, options: {
  code?: string;
  severity?: ErrorSeverity;
  group?: ErrorGroup;
  context?: Record<string, any>;
  shouldNotifyUser?: boolean;
  userMessage?: string;
  userTitle?: string;
} = {}): AppError {
  const message = error instanceof Error ? error.message : String(error);
  
  return {
    message,
    code: options.code || 'EXCEPTION',
    severity: options.severity || ErrorSeverity.ERROR,
    group: options.group || ErrorGroup.GENERAL,
    context: options.context,
    originalError: error,
    shouldNotifyUser: options.shouldNotifyUser !== false, // Default to true
    userMessage: options.userMessage,
    userTitle: options.userTitle
  };
}
