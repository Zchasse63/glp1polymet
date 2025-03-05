
import React from 'react';
import { AccessibleLabel } from './AccessibleLabel';

interface AccessibleFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
  ariaLabelledby?: string;
  ariaDescribedby?: string;
}

/**
 * AccessibleForm Component
 * 
 * Creates an accessible form with proper ARIA attributes
 */
export function AccessibleForm({
  children,
  onSubmit,
  className,
  ariaLabelledby,
  ariaDescribedby
}: AccessibleFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className={className}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      noValidate
    >
      {children}
    </form>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  labelClassName?: string;
  children: React.ReactNode;
}

/**
 * FormField Component
 * 
 * Creates an accessible form field with label, error, and hint text
 */
export function FormField({
  id,
  label,
  required = false,
  error,
  hint,
  className,
  labelClassName,
  children
}: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  const hintId = hint ? `${id}-hint` : undefined;
  
  // Combine aria-describedby values
  const ariaDescribedby = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`form-field ${className || ''} ${error ? 'has-error' : ''}`}>
      <AccessibleLabel
        htmlFor={id}
        required={required}
        className={labelClassName}
      >
        {label}
      </AccessibleLabel>
      
      {hint && (
        <div id={hintId} className="text-sm text-muted-foreground mb-1">
          {hint}
        </div>
      )}
      
      {React.cloneElement(children as React.ReactElement, {
        id,
        'aria-invalid': error ? 'true' : undefined,
        'aria-describedby': ariaDescribedby,
        'aria-required': required ? 'true' : undefined
      })}
      
      {error && (
        <div id={errorId} className="text-sm text-destructive mt-1" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
