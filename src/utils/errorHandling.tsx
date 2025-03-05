
import React, { ErrorInfo, PropsWithChildren } from 'react';
import { toast } from '@/components/ui/use-toast';

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

/**
 * Global error handler for uncaught exceptions
 */
export function setupGlobalErrorHandlers(): void {
  window.addEventListener('error', (event) => {
    ErrorLogger.critical('Uncaught exception', 'UNCAUGHT_EXCEPTION', {
      fileName: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno
    }, event.error);
    
    // Show user-friendly error notification
    toast({
      variant: "destructive",
      title: "An unexpected error occurred",
      description: "We're sorry for the inconvenience. The application might not work correctly."
    });
    
    return false; // Let the error propagate
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    ErrorLogger.critical('Unhandled promise rejection', 'UNHANDLED_REJECTION', {}, event.reason);
    
    // Show user-friendly error notification
    toast({
      variant: "destructive",
      title: "Background operation failed",
      description: "Something went wrong. Please try again or reload the page."
    });
    
    return false; // Let the error propagate
  });
}

/**
 * Enhanced error boundary component with consistent error UI
 */
export class EnhancedErrorBoundary extends React.Component<
  PropsWithChildren<{
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    errorComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
  }>,
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error
    ErrorLogger.error(
      error.message || 'Component error',
      'COMPONENT_ERROR',
      { componentStack: errorInfo.componentStack },
      error
    );
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      // Use custom error component if provided
      if (this.props.errorComponent && this.state.error) {
        const ErrorComponent = this.props.errorComponent;
        return <ErrorComponent error={this.state.error} reset={this.resetErrorBoundary} />;
      }
      
      // Use provided fallback if available
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Default error UI
      return (
        <div className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 my-4">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Something went wrong</h3>
          <p className="text-red-700 dark:text-red-400 mt-1">
            We're having trouble displaying this content. Please try reloading the page.
          </p>
          <button
            onClick={this.resetErrorBoundary}
            className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-100 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Default error display component
 */
export const ErrorDisplay: React.FC<{ 
  title?: string;
  message?: string;
  retry?: () => void;
  severity?: ErrorSeverity;
}> = ({ 
  title = "An error occurred", 
  message = "We're having trouble completing this action", 
  retry,
  severity = ErrorSeverity.ERROR
}) => {
  // Map severity to UI treatment
  const getColorClasses = () => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          text: "text-blue-800 dark:text-blue-300",
          description: "text-blue-700 dark:text-blue-400"
        };
      case ErrorSeverity.WARNING:
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          text: "text-yellow-800 dark:text-yellow-300",
          description: "text-yellow-700 dark:text-yellow-400"
        };
      case ErrorSeverity.CRITICAL:
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          border: "border-red-300 dark:border-red-800",
          text: "text-red-900 dark:text-red-200",
          description: "text-red-800 dark:text-red-300"
        };
      default: // ERROR
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          text: "text-red-800 dark:text-red-300",
          description: "text-red-700 dark:text-red-400"
        };
    }
  };
  
  const colors = getColorClasses();
  
  return (
    <div className={`p-4 rounded-md ${colors.bg} border ${colors.border} my-4`}>
      <h3 className={`text-lg font-semibold ${colors.text}`}>{title}</h3>
      <p className={`${colors.description} mt-1`}>{message}</p>
      {retry && (
        <button
          onClick={retry}
          className={`mt-3 px-4 py-2 ${colors.bg} ${colors.text} rounded-md hover:opacity-90 transition-colors`}
        >
          Try again
        </button>
      )}
    </div>
  );
};
