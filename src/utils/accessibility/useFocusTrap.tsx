import { useCallback, useRef } from 'react';

/**
 * useFocusTrap Hook
 * 
 * Manages focus within a specific container element
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Improves keyboard navigation for assistive technology users
 */
export function useFocusTrap() {
  // Keep track of the element that had focus before trapping
  const previousFocusRef = useRef<HTMLElement | null>(null);
  
  /**
   * Get all focusable elements within a container
   */
  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'a[href]:not([disabled])',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable]'
    ].join(',');
    
    const elements = Array.from(
      container.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
    
    // Filter out elements with display: none or visibility: hidden
    return elements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0';
    });
  };
  
  /**
   * Trap focus within the specified container
   */
  const trapFocus = useCallback((container: HTMLElement, autoFocus = true) => {
    // Save current active element to restore focus later
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    const focusableElements = getFocusableElements(container);
    
    if (focusableElements.length === 0) {
      // If no focusable elements, focus the container itself
      container.setAttribute('tabindex', '-1');
      container.focus();
      return;
    }
    
    // Focus the first element if autoFocus is true
    if (autoFocus) {
      focusableElements[0]?.focus();
    }
    
    // Handle tabbing
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Tab key
      if (event.key !== 'Tab') return;
      
      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) return;
      
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      
      // Shift + Tab from first element should wrap to last element
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // Tab from last element should wrap to first element
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    
    // Store the event listener for cleanup
    (container as any)._focusTrapKeydownListener = handleKeyDown;
  }, []);
  
  /**
   * Release the focus trap and restore previous focus
   */
  const releaseFocus = useCallback(() => {
    // Restore focus to the previously focused element
    if (previousFocusRef.current && previousFocusRef.current.focus) {
      try {
        previousFocusRef.current.focus();
      } catch (e) {
        console.error('Error restoring focus:', e);
      }
    }
    
    // Remove any event listeners added to handle tabbing
    document.querySelectorAll('[data-focus-trap="true"]').forEach(el => {
      const container = el as HTMLElement;
      const keydownListener = (container as any)._focusTrapKeydownListener;
      
      if (keydownListener) {
        container.removeEventListener('keydown', keydownListener);
        delete (container as any)._focusTrapKeydownListener;
      }
      
      container.removeAttribute('data-focus-trap');
    });
  }, []);
  
  return { trapFocus, releaseFocus };
}
