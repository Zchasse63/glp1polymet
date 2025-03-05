
/**
 * Enhanced Error Boundary Component
 * 
 * Following CodeFarm Development Methodology:
 * - Error Containment: Isolates component failures
 * - User-Centric Design: Provides clear error feedback
 */
import React, { ErrorInfo, PropsWithChildren } from 'react';
import { ErrorLogger } from './ErrorLogger';

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
