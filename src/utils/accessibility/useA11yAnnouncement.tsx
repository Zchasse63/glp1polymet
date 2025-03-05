
import { useCallback, useEffect, useRef } from 'react';

interface UseA11yAnnouncementOptions {
  /**
   * If true, announcement will interrupt current speech (assertive)
   * If false, announcement will wait until current speech completes (polite)
   */
  assertive?: boolean;
  
  /**
   * Controls automatic cleanup of announcement
   * Announcements are typically cleared after being read
   */
  clearAfter?: number;
  
  /**
   * Optional ID for the announcement element
   */
  id?: string;
}

/**
 * Hook for making screen reader announcements
 * Provides a function to announce messages to screen readers
 */
export function useA11yAnnouncement(options: UseA11yAnnouncementOptions = {}) {
  const {
    assertive = false,
    clearAfter = 5000,
    id = 'a11y-announcer'
  } = options;
  
  // Ref to track if we've already created the announcer element
  const announcerRef = useRef<HTMLElement | null>(null);
  
  // Create or get the announcer element
  const getAnnouncer = useCallback(() => {
    // If we already have a reference, return it
    if (announcerRef.current) return announcerRef.current;
    
    // Check if announcer already exists in the DOM
    let announcer = document.getElementById(id);
    
    // If not, create it
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = id;
      announcer.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    // Store reference and return
    announcerRef.current = announcer;
    return announcer;
  }, [assertive, id]);
  
  // Function to make announcements
  const announce = useCallback((message: string) => {
    const announcer = getAnnouncer();
    
    // Set a small timeout to ensure screen readers recognize the change
    setTimeout(() => {
      announcer.textContent = message;
      
      // Clear the announcement after specified time
      if (clearAfter > 0) {
        setTimeout(() => {
          // Only clear if the content hasn't changed
          if (announcer.textContent === message) {
            announcer.textContent = '';
          }
        }, clearAfter);
      }
    }, 100);
  }, [getAnnouncer, clearAfter]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // We don't remove the element as it might be used by other components
      // But we do clear any pending announcements from this hook
      if (announcerRef.current) {
        announcerRef.current.textContent = '';
      }
    };
  }, []);
  
  return { announce };
}
