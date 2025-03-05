
/**
 * Error Display Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear error feedback
 * - Sustainable Code: Reusable error component
 */
import React from 'react';
import { ErrorSeverity } from './types';

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
      <h3 className={`text-lg font-medium ${colors.text}`}>{title}</h3>
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
