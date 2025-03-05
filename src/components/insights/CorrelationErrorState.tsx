
/**
 * CorrelationErrorState Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Provides clear error feedback with recovery options
 * - Error Containment: Isolates error UI from main component
 * - Accessibility: Properly structured for screen readers
 */
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorSeverity } from '@/utils/errorHandling';

interface CorrelationErrorStateProps {
  /** The error that occurred */
  error: Error | null;
  /** Function to retry loading the data */
  onRetry: () => void;
  /** Optional custom error message */
  customMessage?: string;
  /** Error severity level */
  severity?: ErrorSeverity;
}

const CorrelationErrorState: React.FC<CorrelationErrorStateProps> = ({
  error,
  onRetry,
  customMessage,
  severity = ErrorSeverity.ERROR
}) => {
  // Get default message based on error
  const getMessage = (): string => {
    if (customMessage) return customMessage;
    
    // If we have an error object with message
    if (error?.message) {
      // Filter out technical details for user-facing message
      if (error.message.includes('network')) {
        return "We're having trouble connecting to the server. Please check your internet connection.";
      } else if (error.message.includes('timeout')) {
        return "The request took too long to complete. Please try again.";
      } else if (error.message.includes('permission')) {
        return "You don't have permission to access this data.";
      }
    }
    
    // Default message
    return "We couldn't load your correlation data. Please try again later.";
  };
  
  // Map severity to UI classes
  const getSeverityClasses = () => {
    switch (severity) {
      case ErrorSeverity.WARNING:
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: "text-yellow-500 dark:text-yellow-400"
        };
      case ErrorSeverity.CRITICAL:
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          border: "border-red-300 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400"
        };
      default: // ERROR
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          icon: "text-red-500 dark:text-red-400"
        };
    }
  };
  
  const classes = getSeverityClasses();
  
  return (
    <div 
      className={`rounded-lg ${classes.bg} ${classes.border} border p-4 flex flex-col items-center justify-center py-6 text-center`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${classes.bg} p-3 rounded-full mb-3`}>
        <AlertTriangle className={`h-6 w-6 ${classes.icon}`} />
      </div>
      
      <h3 className="text-lg font-medium mb-2">Data Loading Error</h3>
      <p className="text-muted-foreground mb-4">{getMessage()}</p>
      
      <Button 
        onClick={onRetry} 
        variant="outline" 
        size="sm"
        className="flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try again</span>
      </Button>
    </div>
  );
};

export default CorrelationErrorState;
