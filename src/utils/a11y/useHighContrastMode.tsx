
import { useState, useEffect } from 'react';

/**
 * Hook to detect high contrast mode
 */
export function useHighContrastMode() {
  const [isHighContrastMode, setIsHighContrastMode] = useState(false);
  
  useEffect(() => {
    // Check for high contrast mode using forced-colors media query
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    setIsHighContrastMode(mediaQuery.matches);
    
    // Update when preference changes
    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrastMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  return isHighContrastMode;
}
