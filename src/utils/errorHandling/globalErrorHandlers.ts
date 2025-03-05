
/**
 * Global Error Handlers
 * 
 * Following CodeFarm Development Methodology:
 * - Error Containment: Centralized error handling
 * - User-Centric Design: User-friendly error notifications
 */
import { toast } from '@/components/ui/use-toast';
import { ErrorLogger } from './ErrorLogger';

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
