
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";

type AnimationType = 
  | 'fade-slide-up' 
  | 'fade-slide-right'
  | 'fade-slide-down'
  | 'fade-slide-left'
  | 'fade-scale'
  | 'fade-slide-up-1'
  | 'fade-slide-up-2'
  | 'fade-slide-up-3'
  | 'fade-slide-up-4'
  | 'fade-slide-left-1'
  | 'fade-slide-left-2'
  | 'fade-slide-left-3'
  | 'fade-slide-left-4';

interface AnimationOptions {
  duration?: number;
  delay?: number;
}

/**
 * Hook to get appropriate animation classes that respect user's reduced motion preference
 */
export function useAnimationTransition() {
  const prefersReducedMotion = useReducedMotion();

  /**
   * Get animation classes based on animation type and user preferences
   */
  const getAnimationClass = (
    animationType: AnimationType,
    options?: AnimationOptions
  ): string => {
    // Return just opacity transition if user prefers reduced motion
    if (prefersReducedMotion) {
      return "transition-opacity duration-250 ease-out";
    }

    // Default animation with hardware acceleration
    return `will-change-transform transition-all duration-250 ease-out`;
  };

  /**
   * Get inline style for animation delays and transforms
   */
  const getAnimationStyle = (index: number = 0, baseDelay: number = 0): React.CSSProperties => {
    // Base style that works for all users
    const baseStyle: React.CSSProperties = {
      opacity: 0,
      transition: `opacity 250ms ease-out, transform 250ms ease-out`
    };
    
    // Calculate delay with staggered effect
    const delayMs = baseDelay + (index * 50);
    
    // Different styles based on motion preferences
    if (prefersReducedMotion) {
      return {
        ...baseStyle,
        transitionDelay: `${delayMs}ms`,
      };
    }
    
    return {
      ...baseStyle,
      transform: 'translateY(15px)',
      transitionDelay: `${delayMs}ms`,
    };
  };
  
  /**
   * Apply loaded state styles when element should be visible
   */
  const getLoadedStyle = (isLoaded: boolean, index: number = 0, baseDelay: number = 0): React.CSSProperties => {
    if (!isLoaded) {
      return getAnimationStyle(index, baseDelay);
    }
    
    // When loaded, elements become visible and move to their final position
    const delayMs = baseDelay + (index * 50);
    
    return {
      opacity: 1,
      transform: 'translateY(0px)',
      transitionDelay: `${delayMs}ms`,
      transition: `opacity 250ms ease-out, transform 250ms ease-out`
    };
  };

  return {
    getAnimationClass,
    getAnimationStyle,
    getLoadedStyle,
    prefersReducedMotion
  };
}
