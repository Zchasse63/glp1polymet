/**
 * Error Logger Core
 * 
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Core error logging functionality
 * - Modular Architecture: Separated core logging logic
 */
import { AppError, ErrorSeverity, ErrorGroup } from '../types';
import { getErrorContext } from './errorContextUtils';

// Maximum number of errors to store in memory
const MAX_ERROR_BUFFER_SIZE = 50;

/**
 * Core error logging implementation
 */
export class ErrorLoggerCore {
  // In-memory buffer of recent errors for debugging
  private errorBuffer: AppError[] = [];
  
  // Add error to buffer, maintaining max size
  addToBuffer(error: AppError): void {
    this.errorBuffer.unshift(error);
    
    // Keep buffer size under control
    if (this.errorBuffer.length > MAX_ERROR_BUFFER_SIZE) {
      this.errorBuffer.pop();
    }
  }
  
  // Central error logging function
  log(error: AppError): void {
    // Add to in-memory buffer
    this.addToBuffer(error);
    
    // Prepare context for logging
    const context = getErrorContext(error);
    
    // Log to console with appropriate level
    this.logToConsole(error, context);
  }
  
  // Log to console based on severity
  private logToConsole(error: AppError, context: Record<string, any>): void {
    switch (error.severity) {
      case ErrorSeverity.INFO:
        console.info(`[INFO] ${error.code || 'INFO'}: ${error.message}`, context);
        break;
      case ErrorSeverity.WARNING:
        console.warn(`[WARNING] ${error.code || 'WARN'}: ${error.message}`, context);
        break;
      case ErrorSeverity.ERROR:
        console.error(`[ERROR] ${error.code || 'ERROR'}: ${error.message}`, context, error.originalError);
        break;
      case ErrorSeverity.CRITICAL:
        console.error(`[CRITICAL] ${error.code || 'CRITICAL'}: ${error.message}`, context, error.originalError);
        break;
      default:
        console.error(`[${error.severity}] ${error.code || 'UNKNOWN'}: ${error.message}`, context);
    }
  }
  
  // Get recent errors for debugging
  getRecentErrors(): AppError[] {
    return [...this.errorBuffer];
  }
  
  // Clear error buffer
  clearBuffer(): void {
    this.errorBuffer = [];
  }
}

// Create and export a singleton instance
export const errorLoggerCore = new ErrorLoggerCore();
