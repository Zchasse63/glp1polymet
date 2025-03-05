
import React, { useEffect } from 'react';

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
