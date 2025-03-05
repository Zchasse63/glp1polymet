
import React from 'react';

/**
 * Button component with enhanced keyboard support
 * For non-button elements that should behave like buttons
 */
export function AccessibleButton({
  onClick,
  children,
  className,
  ariaLabel,
  ...props
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  [key: string]: any;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className={`${className || ''} cursor-pointer`}
      {...props}
    >
      {children}
    </div>
  );
}
