
import { useEffect } from 'react';

/**
 * A hook to set the document title
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Provides clear page identification
 * - Holistic Development: Ensures consistent title management
 * 
 * @param title - The title to set for the document
 */
export const useDocumentTitle = (title: string): void => {
  useEffect(() => {
    // Store the original title to restore it when unmounting
    const originalTitle = document.title;
    
    // Set the new title
    document.title = title;
    
    // Cleanup function to restore the original title when unmounting
    return () => {
      document.title = originalTitle;
    };
  }, [title]);
};
