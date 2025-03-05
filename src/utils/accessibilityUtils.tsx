
import React, { useEffect, useRef, useState } from 'react';

/**
 * Hook to trap focus within a container for modals and dialogs
 * Improves keyboard navigation for accessibility
 */
export function useFocusTrap(active: boolean = true) {
  const rootRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!active) return;
    
    const root = rootRef.current;
    if (!root) return;
    
    // Find all focusable elements
    const focusableElements = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Focus the first element on mount
    firstElement.focus();
    
    // Handle keydown events
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } 
      // Tab
      else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    // Add event listener
    root.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      root.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);
  
  return rootRef;
}

/**
 * Component that announces messages to screen readers
 * Important for dynamic content changes
 */
export function ScreenReaderAnnouncement({ 
  message, 
  assertive = false 
}: { 
  message: string; 
  assertive?: boolean;
}) {
  const [announcement, setAnnouncement] = useState(message);
  
  useEffect(() => {
    // Setting timeout to ensure screen readers register the change
    const timeoutId = setTimeout(() => {
      setAnnouncement(message);
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [message]);
  
  return (
    <div 
      role="status"
      aria-live={assertive ? "assertive" : "polite"}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

/**
 * Hook to manage skip link functionality for keyboard users
 * Allows keyboard users to skip navigation and jump to main content
 */
export function useSkipLink(contentId: string = 'main-content') {
  useEffect(() => {
    // Ensure the target element has tabIndex for focus
    const contentElement = document.getElementById(contentId);
    if (contentElement && contentElement.tabIndex === -1) {
      contentElement.tabIndex = -1;
    }
  }, [contentId]);
  
  return {
    skipLinkComponent: (
      <a 
        href={`#${contentId}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>
    )
  };
}

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

/**
 * Hook to detect and respond to user's motion preferences
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return prefersReducedMotion;
}
