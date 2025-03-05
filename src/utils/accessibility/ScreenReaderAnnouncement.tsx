
import React, { useEffect, useState } from 'react';

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
