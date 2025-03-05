
/**
 * Error Display Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Provides clear error feedback
 * - Error Handling: Consistent error UI
 */
import React from 'react';
import { AlertCircle, RefreshCw, AlertTriangle, Info, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AppError, ErrorSeverity } from './types';

interface ErrorDisplayProps {
  error: AppError | Error;
  resetError?: () => void;
  variant?: 'inline' | 'card' | 'alert' | 'minimal';
  className?: string;
}

/**
 * Gets user-friendly error message based on error object
 */
const getUserFriendlyMessage = (error: AppError | Error): string => {
  if ('userMessage' in error && error.userMessage) {
    return error.userMessage;
  }
  
  if (error instanceof Error) {
    // Handle known error types with better messages
    if (error.name === 'NetworkError' || error.message.includes('network') || error.message.includes('fetch')) {
      return 'There was a problem connecting to the server. Please check your internet connection and try again.';
    }
    
    if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
      return 'The request took too long to complete. Please try again.';
    }
    
    if (error.name === 'ValidationError' || error.message.includes('validation')) {
      return 'The information provided is not valid. Please check your inputs and try again.';
    }
    
    // Default error message
    return 'Something went wrong. Please try again later.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Gets error severity based on error object
 */
const getErrorSeverity = (error: AppError | Error): ErrorSeverity => {
  if ('severity' in error && error.severity) {
    return error.severity;
  }
  
  return ErrorSeverity.ERROR;
};

/**
 * Error display component with multiple presentation options
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  resetError,
  variant = 'inline',
  className = ''
}) => {
  const message = getUserFriendlyMessage(error);
  const severity = getErrorSeverity(error);
  
  // Choose icon based on severity
  const getIcon = () => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return <Info className="h-5 w-5 text-blue-500" />;
      case ErrorSeverity.WARNING:
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case ErrorSeverity.CRITICAL:
        return <XCircle className="h-5 w-5 text-red-600" />;
      case ErrorSeverity.ERROR:
      default:
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };
  
  // Get appropriate color class based on severity
  const getSeverityColorClass = () => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      case ErrorSeverity.WARNING:
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case ErrorSeverity.CRITICAL:
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case ErrorSeverity.ERROR:
      default:
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
    }
  };
  
  // Render appropriate variant
  switch (variant) {
    case 'card':
      return (
        <Card className={`${className} border ${getSeverityColorClass()}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getIcon()}
              <span>
                {'userTitle' in error && error.userTitle ? error.userTitle : 'Error'}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{message}</p>
          </CardContent>
          {resetError && (
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetError}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try again</span>
              </Button>
            </CardFooter>
          )}
        </Card>
      );
      
    case 'alert':
      return (
        <Alert variant="destructive" className={className}>
          <div className="flex items-center gap-2">
            {getIcon()}
            <AlertTitle>
              {'userTitle' in error && error.userTitle ? error.userTitle : 'Error'}
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2">{message}</AlertDescription>
          {resetError && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetError}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try again</span>
              </Button>
            </div>
          )}
        </Alert>
      );
      
    case 'minimal':
      return (
        <div className={`text-sm flex items-center gap-1 text-red-600 dark:text-red-400 ${className}`}>
          <AlertCircle className="h-3 w-3" />
          <span>{message}</span>
        </div>
      );
      
    case 'inline':
    default:
      return (
        <div className={`rounded-lg border p-4 ${getSeverityColorClass()} ${className}`}>
          <div className="flex items-center gap-2">
            {getIcon()}
            <p className="font-medium">
              {'userTitle' in error && error.userTitle ? error.userTitle : 'Error'}
            </p>
          </div>
          <p className="mt-2 text-sm">{message}</p>
          {resetError && (
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetError}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try again</span>
              </Button>
            </div>
          )}
        </div>
      );
  }
};
