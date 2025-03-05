
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

/**
 * Custom hook for managing bookmarked items using Supabase
 * 
 * Following CodeFarm Development principles:
 * - Holistic Development: Integrates with authentication and database
 * - Continuous Learning: Uses modern data fetching patterns
 * - Sustainable Code: Clear error handling and state management
 * 
 * @param storageKey - Fallback local storage key for unauthenticated users
 * @returns Object with bookmarked IDs and toggle functions
 */
export function useBookmarks(storageKey: string = 'bookmarked-recommendations') {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  // Load bookmarks from Supabase or localStorage
  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      
      try {
        if (isAuthenticated && user?.id) {
          // Fetch from Supabase if user is authenticated
          const { data, error } = await supabase
            .from('bookmarks')
            .select('recommendation_id')
            .eq('user_id', user.id);
            
          if (error) {
            console.error('Error fetching bookmarks:', error);
            // Fall back to localStorage if there was an error
            const savedBookmarks = localStorage.getItem(storageKey);
            setBookmarkedIds(savedBookmarks ? JSON.parse(savedBookmarks) : []);
          } else {
            // Set bookmarked IDs from Supabase data
            setBookmarkedIds(data.map(item => item.recommendation_id));
          }
        } else {
          // Use localStorage for unauthenticated users
          const savedBookmarks = localStorage.getItem(storageKey);
          setBookmarkedIds(savedBookmarks ? JSON.parse(savedBookmarks) : []);
        }
      } catch (error) {
        console.error('Error in useBookmarks:', error);
        // Fall back to empty array in case of error
        setBookmarkedIds([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookmarks();
  }, [isAuthenticated, user?.id, storageKey]);
  
  // Toggle bookmark function
  const toggleBookmark = async (id: string) => {
    try {
      const isCurrentlyBookmarked = bookmarkedIds.includes(id);
      
      if (isAuthenticated && user?.id) {
        // Handle in Supabase for authenticated users
        if (isCurrentlyBookmarked) {
          // Remove from Supabase
          const { error } = await supabase
            .from('bookmarks')
            .delete()
            .eq('user_id', user.id)
            .eq('recommendation_id', id);
            
          if (error) throw error;
        } else {
          // Add to Supabase
          const { error } = await supabase
            .from('bookmarks')
            .insert({
              user_id: user.id,
              recommendation_id: id
            });
            
          if (error) throw error;
        }
      } else {
        // Handle in localStorage for unauthenticated users
        const newBookmarks = isCurrentlyBookmarked
          ? bookmarkedIds.filter(item => item !== id)
          : [...bookmarkedIds, id];
          
        localStorage.setItem(storageKey, JSON.stringify(newBookmarks));
      }
      
      // Update local state immediately for better UX
      setBookmarkedIds(prev =>
        isCurrentlyBookmarked
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Bookmark Error",
        description: "There was an issue saving your bookmark. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Clear all bookmarks function
  const clearAllBookmarks = async () => {
    try {
      if (isAuthenticated && user?.id) {
        // Clear from Supabase
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      // Clear from localStorage as well
      localStorage.removeItem(storageKey);
      
      // Update local state
      setBookmarkedIds([]);
    } catch (error) {
      console.error('Error clearing bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to clear bookmarks. Please try again.",
        variant: "destructive"
      });
    }
  };

  return {
    bookmarkedIds,
    isBookmarked: (id: string) => bookmarkedIds.includes(id),
    toggleBookmark,
    clearAllBookmarks,
    isLoading
  };
}
