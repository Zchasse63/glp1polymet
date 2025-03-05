
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing bookmarked items
 * 
 * @param storageKey - Local storage key to use for saving bookmarks
 * @returns Object with bookmarked IDs and toggle function
 */
export function useBookmarks(storageKey: string = 'bookmarked-recommendations') {
  // Initialize state from localStorage
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    
    try {
      const savedBookmarks = localStorage.getItem(storageKey);
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever bookmarkedIds changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(bookmarkedIds));
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }, [bookmarkedIds, storageKey]);

  // Toggle bookmark function
  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prevIds => {
      if (prevIds.includes(id)) {
        return prevIds.filter(item => item !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  return {
    bookmarkedIds,
    isBookmarked: (id: string) => bookmarkedIds.includes(id),
    toggleBookmark,
    clearAllBookmarks: () => setBookmarkedIds([])
  };
}
