
import React from 'react';

/**
 * Enhancement for form labels to be fully accessible
 */
export function AccessibleLabel({
  htmlFor,
  children,
  required = false,
  className,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <label 
      htmlFor={htmlFor} 
      className={className || 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'}
    >
      {children}
      {required && (
        <span 
          className="text-red-500 ml-1" 
          aria-hidden="true"
        >
          *
        </span>
      )}
      {required && (
        <span className="sr-only">
          required
        </span>
      )}
    </label>
  );
}
