
/**
 * Enhanced Error Boundary Component
 * 
 * Following CodeFarm Development Methodology:
 * - Error Containment: Isolates component failures
 * - User-Centric Design: Provides clear error feedback
 */
import React, { ErrorInfo, PropsWithChildren } from 'react';
import { ErrorLogger } from './ErrorLogger';
import { ErrorDisplay } from './ErrorDisplay';
import { AppError, ErrorSeverity, ErrorGroup } from './types';
import analytics, { EventCategory, EventPriority } from '../eventTracking';

/**
 * Enhanced error boundary component with consistent error UI
 */
export class EnhancedErrorBoundary extends React.Component<
  PropsWithChildren<{
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    errorComponent?: React.ComponentType<{ error: Error; reset: () => void }>;
    name?: string; // Boundary name for better error identification
    group?: ErrorGroup; // Error group for categorization
    silent?: boolean; // Whether to silence analytics tracking
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
    // Create AppError from caught error
    const appError: AppError = {
      message: error.message || 'Component error',
      severity: ErrorSeverity.ERROR,
      group: this.props.group || ErrorGroup.UI,
      context: { 
        componentStack: errorInfo.componentStack,
        boundaryName: this.props.name || 'unnamed',
      },
      originalError: error,
    };
    
    // Log the error
    ErrorLogger.log(appError);
    
    // Track error in analytics (unless silent)
    if (!this.props.silent) {
      analytics.trackEvent({
        name: 'error_boundary_triggered',
        category: EventCategory.ERROR,
        priority: EventPriority.HIGH,
        properties: {
          errorMessage: error.message,
          componentStack: errorInfo.componentStack.split('\n')[1]?.trim() || 'Unknown component',
          boundaryName: this.props.name || 'unnamed',
        }
      });
    }
    
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
      
      // Default error UI using ErrorDisplay
      return (
        <ErrorDisplay 
          error={this.state.error || new Error("Unknown error")} 
          resetError={this.resetErrorBoundary}
          variant="card"
          className="my-4"
        />
      );
    }

    return this.props.children;
  }
}
