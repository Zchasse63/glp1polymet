
import React, { useEffect } from 'react';

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
