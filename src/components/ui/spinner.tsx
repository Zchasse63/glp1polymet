
import React from 'react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'small' | 'medium' | 'large';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  'aria-label'?: string;
}

/**
 * Spinner Component
 * 
 * A loading indicator with accessibility support.
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensures loading state is correctly announced
 * - Sustainable Code: Reusable component
 */
export function Spinner({
  size = 'medium',
  className,
  'aria-label': ariaLabel = 'Loading',
  ...props
}: SpinnerProps) {
  // Size mappings
  const sizeMap: Record<SpinnerSize, string> = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };
  
  const sizeClass = sizeMap[size];
  
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={cn('flex items-center justify-center', className)}
      {...props}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-t-transparent border-primary',
          sizeClass
        )}
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}
