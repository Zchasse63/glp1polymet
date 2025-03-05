
/**
 * CorrelationErrorState Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Provides clear error feedback with recovery options
 * - Error Containment: Isolates error UI from main component
 * - Accessibility: Properly structured for screen readers
 * - Sustainable Code: Reusable error component with consistent styling
 */
import React from 'react';
import { AlertTriangle, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ErrorSeverity } from '@/utils/errorHandling';
import { cn } from '@/lib/utils';

interface CorrelationErrorStateProps {
  /** The error that occurred */
  error: Error | null;
  /** Function to retry loading the data */
  onRetry: () => void;
  /** Optional custom error message */
  customMessage?: string;
  /** Error severity level */
  severity?: ErrorSeverity;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Displays an error state for correlation data with retry functionality
 * 
 * @param props Component properties
 * @returns React component
 */
const CorrelationErrorState: React.FC<CorrelationErrorStateProps> = ({
  error,
  onRetry,
  customMessage,
  severity = ErrorSeverity.ERROR,
  className
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
      } else if (error.message.includes('404')) {
        return "The requested data could not be found. Please try a different selection.";
      } else if (error.message.includes('429')) {
        return "Too many requests. Please wait a moment before trying again.";
      }
    }
    
    // Default message
    return "We couldn't load your correlation data. Please try again later.";
  };
  
  // Get error details for technical users
  const getErrorDetails = (): string | null => {
    if (!error) return null;
    
    return error.name && error.message 
      ? `${error.name}: ${error.message}` 
      : error.toString();
  };
  
  // Get icon based on severity
  const getIcon = () => {
    switch (severity) {
      case ErrorSeverity.WARNING:
        return <AlertCircle className={`h-6 w-6 ${classes.icon}`} />;
      case ErrorSeverity.INFO:
        return <Info className={`h-6 w-6 ${classes.icon}`} />;
      default:
        return <AlertTriangle className={`h-6 w-6 ${classes.icon}`} />;
    }
  };
  
  // Map severity to UI classes
  const getSeverityClasses = () => {
    switch (severity) {
      case ErrorSeverity.INFO:
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-800",
          icon: "text-blue-500 dark:text-blue-400",
          hoverBg: "hover:bg-blue-100 dark:hover:bg-blue-800/50"
        };
      case ErrorSeverity.WARNING:
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-800",
          icon: "text-yellow-500 dark:text-yellow-400",
          hoverBg: "hover:bg-yellow-100 dark:hover:bg-yellow-800/50"
        };
      case ErrorSeverity.CRITICAL:
        return {
          bg: "bg-red-100 dark:bg-red-900/30",
          border: "border-red-300 dark:border-red-800",
          icon: "text-red-600 dark:text-red-400",
          hoverBg: "hover:bg-red-200 dark:hover:bg-red-800/70"
        };
      default: // ERROR
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-800",
          icon: "text-red-500 dark:text-red-400",
          hoverBg: "hover:bg-red-100 dark:hover:bg-red-800/50"
        };
    }
  };
  
  const classes = getSeverityClasses();
  
  return (
    <div 
      className={cn(
        `rounded-lg ${classes.bg} ${classes.border} border p-4 flex flex-col items-center justify-center py-6 text-center`,
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className={`${classes.bg} p-3 rounded-full mb-3`}>
        {getIcon()}
      </div>
      
      <h3 className="text-lg font-medium mb-2">Data Loading Error</h3>
      <p className="text-muted-foreground mb-4">{getMessage()}</p>
      
      {getErrorDetails() && (
        <div className="text-xs text-muted-foreground bg-black/5 dark:bg-white/5 p-2 rounded mb-4 max-w-full overflow-auto">
          <code>{getErrorDetails()}</code>
        </div>
      )}
      
      <Button 
        onClick={onRetry} 
        variant="outline" 
        size="sm"
        className={`flex items-center gap-2 ${classes.hoverBg}`}
      >
        <RefreshCw className="h-4 w-4" />
        <span>Try again</span>
      </Button>
    </div>
  );
};

export default CorrelationErrorState;
