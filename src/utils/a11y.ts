
/**
 * Enhanced Accessibility Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensure application is accessible to all users
 * - Sustainable Code: Reusable accessibility components
 * - Continuous Learning: Implement best practices for accessibility
 * 
 * This module provides comprehensive accessibility utilities beyond
 * what's already in accessibilityUtils.tsx
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';

/**
 * ARIA Live Region Component
 * Creates an accessible live region for screen reader announcements
 */
interface AriaLiveProps {
  message: string;
  level?: 'polite' | 'assertive';
  clearAfter?: number;
}

export const AriaLive: React.FC<AriaLiveProps> = ({ 
  message, 
  level = 'polite',
  clearAfter
}) => {
  const [announcement, setAnnouncement] = useState(message);
  
  useEffect(() => {
    // Update announcement with a slight delay to ensure screen readers register the change
    const timeoutId = setTimeout(() => {
      setAnnouncement(message);
    }, 100);
    
    // Optional clearing of announcement after specified time
    let clearTimeoutId: number | undefined;
    if (clearAfter && message) {
      clearTimeoutId = window.setTimeout(() => {
        setAnnouncement('');
      }, clearAfter);
    }
    
    return () => {
      clearTimeout(timeoutId);
      if (clearTimeoutId) clearTimeout(clearTimeoutId);
    };
  }, [message, clearAfter]);

  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

/**
 * Hook to manage keyboard navigation for custom UI components
 */
interface KeyboardNavigationOptions {
  itemCount: number;
  initialIndex?: number;
  loop?: boolean;
  onSelect?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical' | 'both';
}

export function useKeyboardNavigation({
  itemCount,
  initialIndex = -1,
  loop = true,
  onSelect,
  orientation = 'vertical'
}: KeyboardNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (itemCount <= 0) return;
    
    let newIndex = activeIndex;
    const canNavigateHorizontally = orientation === 'horizontal' || orientation === 'both';
    const canNavigateVertically = orientation === 'vertical' || orientation === 'both';
    
    switch (event.key) {
      case 'ArrowUp':
        if (canNavigateVertically) {
          event.preventDefault();
          if (activeIndex <= 0) {
            newIndex = loop ? itemCount - 1 : 0;
          } else {
            newIndex = activeIndex - 1;
          }
        }
        break;
        
      case 'ArrowDown':
        if (canNavigateVertically) {
          event.preventDefault();
          if (activeIndex >= itemCount - 1 || activeIndex === -1) {
            newIndex = loop ? 0 : itemCount - 1;
          } else {
            newIndex = activeIndex + 1;
          }
        }
        break;
        
      case 'ArrowLeft':
        if (canNavigateHorizontally) {
          event.preventDefault();
          if (activeIndex <= 0) {
            newIndex = loop ? itemCount - 1 : 0;
          } else {
            newIndex = activeIndex - 1;
          }
        }
        break;
        
      case 'ArrowRight':
        if (canNavigateHorizontally) {
          event.preventDefault();
          if (activeIndex >= itemCount - 1 || activeIndex === -1) {
            newIndex = loop ? 0 : itemCount - 1;
          } else {
            newIndex = activeIndex + 1;
          }
        }
        break;
        
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        newIndex = itemCount - 1;
        break;
        
      case 'Enter':
      case ' ':
        if (activeIndex !== -1 && onSelect) {
          event.preventDefault();
          onSelect(activeIndex);
        }
        return;
        
      default:
        return;
    }
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, itemCount, loop, onSelect, orientation]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown
  };
}

/**
 * Hook to detect high contrast mode
 */
export function useHighContrastMode() {
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);
  
  useEffect(() => {
    // Check for high contrast mode using forced-colors media query
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    setIsHighContrastMode(mediaQuery.matches);
    
    // Update when preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrastMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return isHighContrastMode;
}

/**
 * Enhanced focus indicator component for keyboard navigation
 */
export function FocusRing({ 
  children, 
  active = true, 
  className = '',
}: { 
  children: React.ReactNode; 
  active?: boolean;
  className?: string;
}) {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  
  const handleFocus = () => {
    setIsFocusVisible(true);
  };
  
  const handleBlur = () => {
    setIsFocusVisible(false);
  };
  
  return (
    <div
      className={`focus-ring ${isFocusVisible && active ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-background outline-none' : ''} ${className}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
}

/**
 * Announce page changes for screen readers
 */
export function usePageChangeAnnouncer() {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  
  useEffect(() => {
    // Callback for when document title changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          setPageTitle(document.title);
        }
      });
    });
    
    // Observe document title changes
    observer.observe(document.querySelector('title')!, {
      subtree: true,
      characterData: true,
      childList: true
    });
    
    // Announcement on initial load
    setPageTitle(document.title);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  return (
    <AriaLive 
      message={pageTitle ? `Page changed to ${pageTitle}` : ''} 
      clearAfter={5000}
    />
  );
}

/**
 * Skip navigation link component
 */
export function SkipToContent({ contentId = 'main-content' }: { contentId?: string }) {
  useEffect(() => {
    // Ensure the target element has tabIndex for focus
    const contentElement = document.getElementById(contentId);
    if (contentElement && contentElement.tabIndex === -1) {
      contentElement.tabIndex = -1;
    }
  }, [contentId]);
  
  return (
    <a 
      href={`#${contentId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded focus:outline-2 focus:outline-offset-2"
    >
      Skip to main content
    </a>
  );
}

/**
 * Hook to provide form field accessibility attributes
 */
export function useAccessibleField(id: string, required: boolean = false) {
  return {
    inputProps: {
      id,
      'aria-required': required,
    },
    labelProps: {
      htmlFor: id,
      className: 'block text-sm font-medium mb-1'
    },
    getErrorProps: (error?: string) => ({
      id: `${id}-error`,
      role: 'alert',
      className: 'text-sm text-red-500 mt-1'
    }),
    getDescriptionProps: () => ({
      id: `${id}-description`,
      className: 'text-sm text-muted-foreground mt-1'
    })
  };
}

/**
 * Hook to check screen reader detection 
 * Note: This is not 100% accurate, but can help provide guidance
 */
export function useScreenReaderDetection() {
  const [isProbablyUsingScreenReader, setIsProbablyUsingScreenReader] = useState(false);
  
  useEffect(() => {
    // Various indicators that might suggest screen reader usage
    const checkForScreenReader = () => {
      // Check for common screen reader JavaScript hooks
      const hasScreenReaderGlobals = 
        'NVDA' in window || 
        'FreedomScientific' in window || 
        'JAWS' in window;
        
      // Check for rapid focus movements (common in screen reader usage)
      let focusEvents = 0;
      const focusThreshold = 5;
      const focusTimeWindow = 2000; // 2 seconds
      
      const handleFocus = () => {
        focusEvents++;
        if (focusEvents >= focusThreshold) {
          setIsProbablyUsingScreenReader(true);
          cleanup();
        }
      };
      
      document.addEventListener('focus', handleFocus, true);
      
      // Check for aria-* attribute queries via JavaScript
      const originalGetAttribute = Element.prototype.getAttribute;
      let ariaAttributeQueries = 0;
      const ariaThreshold = 30;
      
      Element.prototype.getAttribute = function(name) {
        if (name && name.toString().startsWith('aria-')) {
          ariaAttributeQueries++;
          if (ariaAttributeQueries >= ariaThreshold) {
            setIsProbablyUsingScreenReader(true);
            cleanup();
          }
        }
        return originalGetAttribute.apply(this, arguments as any);
      };
      
      // Cleanup function to restore original behavior
      const cleanup = () => {
        document.removeEventListener('focus', handleFocus, true);
        Element.prototype.getAttribute = originalGetAttribute;
      };
      
      // Reset after time window
      setTimeout(() => {
        cleanup();
      }, focusTimeWindow);
      
      // Return initial detection
      return hasScreenReaderGlobals;
    };
    
    const initialDetection = checkForScreenReader();
    setIsProbablyUsingScreenReader(initialDetection);
    
    // Run detection when user interacts with page
    const delayedCheck = () => {
      setTimeout(checkForScreenReader, 1000);
    };
    
    document.addEventListener('keydown', delayedCheck);
    
    return () => {
      document.removeEventListener('keydown', delayedCheck);
    };
  }, []);
  
  return isProbablyUsingScreenReader;
}
