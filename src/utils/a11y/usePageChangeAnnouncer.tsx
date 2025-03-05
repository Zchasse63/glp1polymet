
import React, { useState, useEffect } from 'react';
import { AriaLive } from './AriaLive';

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
