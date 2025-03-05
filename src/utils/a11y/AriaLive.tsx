
import React, { useEffect, useState } from 'react';

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
