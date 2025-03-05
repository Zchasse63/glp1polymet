
import { useState, useCallback } from 'react';

/**
 * Hook to manage keyboard navigation for custom UI components
 */
interface KeyboardNavigationOptions {
  itemCount: number;
  initialIndex?: number;
  loop?: boolean;
  onSelect?: (index: number) => void;
  orientation?: 'horizontal' | 'vertical' | 'both';
}

export function useKeyboardNavigation({
  itemCount,
  initialIndex = -1,
  loop = true,
  onSelect,
  orientation = 'vertical'
}: KeyboardNavigationOptions) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (itemCount <= 0) return;
    
    let newIndex = activeIndex;
    const canNavigateHorizontally = orientation === 'horizontal' || orientation === 'both';
    const canNavigateVertically = orientation === 'vertical' || orientation === 'both';
    
    switch (event.key) {
      case 'ArrowUp':
        if (canNavigateVertically) {
          event.preventDefault();
          if (activeIndex <= 0) {
            newIndex = loop ? itemCount - 1 : 0;
          } else {
            newIndex = activeIndex - 1;
          }
        }
        break;
        
      case 'ArrowDown':
        if (canNavigateVertically) {
          event.preventDefault();
          if (activeIndex >= itemCount - 1 || activeIndex === -1) {
            newIndex = loop ? 0 : itemCount - 1;
          } else {
            newIndex = activeIndex + 1;
          }
        }
        break;
        
      case 'ArrowLeft':
        if (canNavigateHorizontally) {
          event.preventDefault();
          if (activeIndex <= 0) {
            newIndex = loop ? itemCount - 1 : 0;
          } else {
            newIndex = activeIndex - 1;
          }
        }
        break;
        
      case 'ArrowRight':
        if (canNavigateHorizontally) {
          event.preventDefault();
          if (activeIndex >= itemCount - 1 || activeIndex === -1) {
            newIndex = loop ? 0 : itemCount - 1;
          } else {
            newIndex = activeIndex + 1;
          }
        }
        break;
        
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
        
      case 'End':
        event.preventDefault();
        newIndex = itemCount - 1;
        break;
        
      case 'Enter':
      case ' ':
        if (activeIndex !== -1 && onSelect) {
          event.preventDefault();
          onSelect(activeIndex);
        }
        return;
        
      default:
        return;
    }
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, itemCount, loop, onSelect, orientation]);

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown
  };
}
