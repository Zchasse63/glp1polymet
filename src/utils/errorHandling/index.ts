
/**
 * Error Handling Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Modular Architecture: Split functionality into focused modules
 * - Documentation: Clear documentation at module level
 */

// Export primary types
export { ErrorSeverity, ErrorGroup, type AppError } from './types';

// Export main error logger and related utilities
export { ErrorLogger, withErrorHandling } from './ErrorLogger';

// Export core functionality
export { errorLoggerCore } from './core/ErrorLoggerCore';

// Export helper functions
export { fromException } from './helpers/exceptionHelpers';

// Export other error handling utilities
export { setupGlobalErrorHandlers } from './globalErrorHandlers';
export { EnhancedErrorBoundary } from './EnhancedErrorBoundary';
export { ErrorDisplay } from './ErrorDisplay';
