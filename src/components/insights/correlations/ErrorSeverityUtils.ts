
import { ErrorSeverity } from "@/utils/errorHandling";

/**
 * Determine error severity based on error message
 */
export const getErrorSeverity = (err: Error | null): ErrorSeverity => {
  if (!err) return ErrorSeverity.ERROR;
  
  const message = err.message.toLowerCase();
  
  if (message.includes('network') || message.includes('connection')) {
    return ErrorSeverity.WARNING;
  }
  
  if (message.includes('timeout')) {
    return ErrorSeverity.WARNING;
  }
  
  if (message.includes('permission') || message.includes('forbidden') || message.includes('unauthorized')) {
    return ErrorSeverity.CRITICAL;
  }
  
  return ErrorSeverity.ERROR;
};
