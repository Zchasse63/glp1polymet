
/**
 * Error Handling Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Modular Architecture: Split functionality into focused modules
 * - Documentation: Clear documentation at module level
 */

// Re-export all error handling utilities
export { ErrorSeverity, ErrorGroup, type AppError } from './types';
export { ErrorLogger } from './ErrorLogger';
export { setupGlobalErrorHandlers } from './globalErrorHandlers';
export { EnhancedErrorBoundary } from './EnhancedErrorBoundary';
export { ErrorDisplay } from './ErrorDisplay';
