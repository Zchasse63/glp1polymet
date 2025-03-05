
import React, { useState } from 'react';

interface SkipToContentProps {
  contentId: string;
  label?: string;
  className?: string;
}

/**
 * SkipToContent Component
 * 
 * Provides a skip link for keyboard users to bypass navigation
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Improves navigation for keyboard-only users
 */
export function SkipToContent({
  contentId,
  label = 'Skip to main content',
  className
}: SkipToContentProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const element = document.getElementById(contentId);
    if (element) {
      // Set tabindex to make the element focusable
      element.setAttribute('tabindex', '-1');
      element.focus();
      
      // Remove tabindex after focus to avoid interfering with normal tab order
      setTimeout(() => {
        element.removeAttribute('tabindex');
      }, 100);
    }
  };
  
  return (
    <a
      href={`#${contentId}`}
      onClick={handleClick}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={`
        fixed top-0 left-0 p-3 z-50 bg-primary text-primary-foreground
        rounded-br transform -translate-y-full transition-transform duration-200
        ${isFocused ? 'translate-y-0' : ''}
        ${className || ''}
      `}
    >
      {label}
    </a>
  );
}
