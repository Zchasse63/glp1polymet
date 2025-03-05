
import { useState, useEffect } from 'react';

/**
 * Hook to check screen reader detection 
 * Note: This is not 100% accurate, but can help provide guidance
 */
export function useScreenReaderDetection() {
  const [isProbablyUsingScreenReader, setIsProbablyUsingScreenReader] = useState(false);
  
  useEffect(() => {
    // Various indicators that might suggest screen reader usage
    const checkForScreenReader = () => {
      // Check for common screen reader JavaScript hooks
      const hasScreenReaderGlobals = 
        'NVDA' in window || 
        'FreedomScientific' in window || 
        'JAWS' in window;
        
      // Check for rapid focus movements (common in screen reader usage)
      let focusEvents = 0;
      const focusThreshold = 5;
      const focusTimeWindow = 2000; // 2 seconds
      
      const handleFocus = () => {
        focusEvents++;
        if (focusEvents >= focusThreshold) {
          setIsProbablyUsingScreenReader(true);
          cleanup();
        }
      };
      
      document.addEventListener('focus', handleFocus, true);
      
      // Check for aria-* attribute queries via JavaScript
      const originalGetAttribute = Element.prototype.getAttribute;
      let ariaAttributeQueries = 0;
      const ariaThreshold = 30;
      
      Element.prototype.getAttribute = function(name) {
        if (name && name.toString().startsWith('aria-')) {
          ariaAttributeQueries++;
          if (ariaAttributeQueries >= ariaThreshold) {
            setIsProbablyUsingScreenReader(true);
            cleanup();
          }
        }
        return originalGetAttribute.apply(this, arguments as any);
      };
      
      // Cleanup function to restore original behavior
      const cleanup = () => {
        document.removeEventListener('focus', handleFocus, true);
        Element.prototype.getAttribute = originalGetAttribute;
      };
      
      // Reset after time window
      setTimeout(() => {
        cleanup();
      }, focusTimeWindow);
      
      // Return initial detection
      return hasScreenReaderGlobals;
    };
    
    const initialDetection = checkForScreenReader();
    setIsProbablyUsingScreenReader(initialDetection);
    
    // Run detection when user interacts with page
    const delayedCheck = () => {
      setTimeout(checkForScreenReader, 1000);
    };
    
    document.addEventListener('keydown', delayedCheck);
    
    return () => {
      document.removeEventListener('keydown', delayedCheck);
    };
  }, []);
  
  return isProbablyUsingScreenReader;
}
