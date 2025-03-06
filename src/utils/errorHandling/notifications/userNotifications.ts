
/**
 * User Notifications for Errors
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Focused on user communication
 * - Single Responsibility: Handling only error notifications
 */
import { toast } from '@/hooks/use-toast';
import { AppError, ErrorSeverity } from '../types';

/**
 * Show user-facing notifications for errors
 */
export function notifyUser(error: AppError): void {
  const variant = getSeverityVariant(error.severity);
  
  toast({
    variant,
    title: error.userTitle || getDefaultTitleForSeverity(error.severity),
    description: error.userMessage || error.message,
  });
}

/**
 * Map severity to toast variant
 */
export function getSeverityVariant(severity: ErrorSeverity): "default" | "destructive" {
  switch (severity) {
    case ErrorSeverity.ERROR:
    case ErrorSeverity.CRITICAL:
      return "destructive";
    default:
      return "default";
  }
}

/**
 * Get default title based on severity
 */
export function getDefaultTitleForSeverity(severity: ErrorSeverity): string {
  switch (severity) {
    case ErrorSeverity.INFO:
      return "Information";
    case ErrorSeverity.WARNING:
      return "Warning";
    case ErrorSeverity.ERROR:
      return "Error";
    case ErrorSeverity.CRITICAL:
      return "Critical Error";
    default:
      return "Notification";
  }
}
