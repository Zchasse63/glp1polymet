
import { useState, useEffect } from 'react';

interface PageChangeInfo {
  pageTitle: string | null;
  pageAnnouncement: string;
}

/**
 * Announce page changes for screen readers
 */
export function usePageChangeAnnouncer(): PageChangeInfo {
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
    if (document.querySelector('title')) {
      observer.observe(document.querySelector('title')!, {
        subtree: true,
        characterData: true,
        childList: true
      });
    }
    
    // Announcement on initial load
    setPageTitle(document.title);
    
    return () => {
      observer.disconnect();
    };
  }, []);

  // Return structured page change info
  return {
    pageTitle: pageTitle,
    pageAnnouncement: pageTitle ? `Page changed to ${pageTitle}` : ''
  };
}
