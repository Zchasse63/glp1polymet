
import { ErrorSeverity, ErrorContext } from "./types";
import { ErrorLogger } from "./ErrorLogger";

/**
 * Standard error handler function that can be used across the application
 * Provides a consistent way to log and display errors
 */
export const handleError = (
  message: string,
  code: string,
  context: ErrorContext,
  originalError: unknown,
  displayToUser: boolean = false,
  userMessage?: string,
  severity: ErrorSeverity = "error"
) => {
  // Log the error
  ErrorLogger.error(
    message,
    code,
    context,
    originalError,
    displayToUser,
    userMessage,
    severity
  );

  // Return a formatted error object that can be used by components
  return {
    message,
    code,
    userMessage: userMessage || message,
    severity,
    timestamp: new Date().toISOString()
  };
};

/**
 * Helper to determine if an error should be reported based on its severity
 */
export const shouldReportError = (severity: ErrorSeverity): boolean => {
  return ["error", "critical"].includes(severity);
};

/**
 * Format error message for display
 */
export const formatErrorForDisplay = (error: Error): string => {
  if (!error) return "An unknown error occurred";
  
  // Clean up common error messages
  let message = error.message;
  
  // Remove technical details that wouldn't be useful to users
  message = message.replace(/Error:?\s?/i, "");
  message = message.replace(/\[.*?\]:\s?/g, "");
  
  // Capitalize first letter
  message = message.charAt(0).toUpperCase() + message.slice(1);
  
  return message;
};
