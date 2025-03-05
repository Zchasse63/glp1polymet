
import React, { useEffect, useRef } from 'react';

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
