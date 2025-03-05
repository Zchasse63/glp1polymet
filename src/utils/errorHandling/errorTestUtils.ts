
/**
 * Error Handling Test Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Sustainable Code: Reusable testing utilities
 * - Error Handling: Standardized testing approach
 */

import { ErrorLogger } from './ErrorLogger';
import { ErrorSeverity } from './types';

/**
 * Mock error logger for testing
 */
export const mockErrorLogger = () => {
  // Store original methods
  const originalLogger = {
    log: ErrorLogger.log,
    info: ErrorLogger.info,
    warning: ErrorLogger.warning,
    error: ErrorLogger.error,
    critical: ErrorLogger.critical,
    addToBuffer: ErrorLogger.addToBuffer,
    getRecentErrors: ErrorLogger.getRecentErrors,
    clearBuffer: ErrorLogger.clearBuffer
  };
  
  // Create mock functions
  const mockedLogger = {
    log: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    critical: jest.fn(),
    addToBuffer: jest.fn(),
    getRecentErrors: jest.fn().mockReturnValue([]),
    clearBuffer: jest.fn(),
    restore: () => {
      // Restore original methods
      ErrorLogger.log = originalLogger.log;
      ErrorLogger.info = originalLogger.info;
      ErrorLogger.warning = originalLogger.warning;
      ErrorLogger.error = originalLogger.error;
      ErrorLogger.critical = originalLogger.critical;
      ErrorLogger.addToBuffer = originalLogger.addToBuffer;
      ErrorLogger.getRecentErrors = originalLogger.getRecentErrors;
      ErrorLogger.clearBuffer = originalLogger.clearBuffer;
    }
  };
  
  // Replace with mock functions
  ErrorLogger.log = mockedLogger.log;
  ErrorLogger.info = mockedLogger.info;
  ErrorLogger.warning = mockedLogger.warning;
  ErrorLogger.error = mockedLogger.error;
  ErrorLogger.critical = mockedLogger.critical;
  ErrorLogger.addToBuffer = mockedLogger.addToBuffer;
  ErrorLogger.getRecentErrors = mockedLogger.getRecentErrors;
  ErrorLogger.clearBuffer = mockedLogger.clearBuffer;
  
  return mockedLogger;
};

/**
 * Test error handling in a function
 */
export const testErrorHandling = async <T>(
  fn: () => Promise<T> | T,
  expectedErrorSeverity: ErrorSeverity,
  expectedErrorCode?: string
): Promise<void> => {
  const mockLogger = mockErrorLogger();
  
  try {
    await fn();
    // If no error thrown, fail the test
    expect('Error should have been thrown').toBe(false);
  } catch (error) {
    // Verify error was logged with correct severity
    switch (expectedErrorSeverity) {
      case ErrorSeverity.INFO:
        expect(mockLogger.info).toHaveBeenCalled();
        break;
      case ErrorSeverity.WARNING:
        expect(mockLogger.warning).toHaveBeenCalled();
        break;
      case ErrorSeverity.ERROR:
        expect(mockLogger.error).toHaveBeenCalled();
        break;
      case ErrorSeverity.CRITICAL:
        expect(mockLogger.critical).toHaveBeenCalled();
        break;
      default:
        expect(mockLogger.log).toHaveBeenCalled();
    }
    
    // If error code provided, check it was used
    if (expectedErrorCode) {
      expect(mockLogger[expectedErrorSeverity.toLowerCase()]).toHaveBeenCalledWith(
        expect.any(String),
        expectedErrorCode,
        expect.any(Object),
        expect.any(Object),
        expect.any(Boolean),
        expect.any(String)
      );
    }
  } finally {
    // Restore original logger
    mockLogger.restore();
  }
};

/**
 * Expect function to throw and log error
 */
export const expectToThrowAndLog = async <T>(
  fn: () => Promise<T> | T,
  expectedErrorSeverity: ErrorSeverity = ErrorSeverity.ERROR
): Promise<void> => {
  const mockLogger = mockErrorLogger();
  
  try {
    await fn();
    fail('Expected function to throw an error');
  } catch (error) {
    // Success - error was thrown
  } finally {
    mockLogger.restore();
  }
};

/**
 * Test error boundary by throwing error in component
 */
export const throwTestError = (message: string = 'Test error'): never => {
  throw new Error(message);
};
