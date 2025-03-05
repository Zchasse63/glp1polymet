
import React from 'react';

interface AccessibleIconProps {
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
  role?: 'img' | 'button' | 'presentation';
}

/**
 * AccessibleIcon Component
 * 
 * Makes icons accessible by adding proper aria labels and keyboard support
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensures accessibility for all users
 * - Sustainable Code: Reusable component for all icons
 */
export function AccessibleIcon({ 
  icon, 
  label, 
  className,
  onClick,
  role = 'img'
}: AccessibleIconProps) {
  // Determine if this is an interactive element
  const isInteractive = role === 'button' || Boolean(onClick);
  
  // Handle keyboard events for interactive icons
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isInteractive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };
  
  return (
    <span
      role={role}
      aria-label={role !== 'presentation' ? label : undefined}
      className={`${className || ''} ${isInteractive ? 'cursor-pointer' : ''}`}
      aria-hidden={role === 'presentation'}
      onClick={onClick}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
    >
      {icon}
    </span>
  );
}
