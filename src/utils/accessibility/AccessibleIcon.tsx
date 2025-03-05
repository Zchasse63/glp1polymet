
import React from 'react';

interface AccessibleIconProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
}

/**
 * AccessibleIcon Component
 * 
 * Makes icons accessible by adding proper aria labels
 */
export function AccessibleIcon({ icon, label, className }: AccessibleIconProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={className}
      aria-hidden={false}
    >
      {icon}
    </span>
  );
}
