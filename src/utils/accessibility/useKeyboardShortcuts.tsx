
import { useEffect, useRef } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

interface KeyboardShortcut {
  key: string;
  handler: KeyHandler;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
}

/**
 * Hook for managing keyboard shortcuts
 * Registers global keyboard shortcuts and cleans up on unmount
 */
export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  // Store handlers in a ref to prevent unnecessary re-registration
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      shortcutsRef.current.forEach(shortcut => {
        const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatches = shortcut.ctrl ? event.ctrlKey : !event.ctrlKey || shortcut.ctrl === undefined;
        const altMatches = shortcut.alt ? event.altKey : !event.altKey || shortcut.alt === undefined;
        const shiftMatches = shortcut.shift ? event.shiftKey : !event.shiftKey || shortcut.shift === undefined;
        const metaMatches = shortcut.meta ? event.metaKey : !event.metaKey || shortcut.meta === undefined;
        
        if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
          if (shortcut.preventDefault) {
            event.preventDefault();
          }
          shortcut.handler(event);
        }
      });
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  return null;
}
