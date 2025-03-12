
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";

type AnimationType = 
  | 'fade-slide-up' 
  | 'fade-slide-right'
  | 'fade-slide-down'
  | 'fade-slide-left'
  | 'fade-scale';

type AnimationDirection = 'up' | 'right' | 'down' | 'left' | 'scale';

/**
 * Hook to provide consistent animation transitions that respect user's motion preferences
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Respects reduced motion preferences
 * - Holistic Development: Provides consistent animations across the app
 */
export function useAnimationTransition() {
  const prefersReducedMotion = useReducedMotion();

  /**
   * Get animation classes based on direction and user preferences
   */
  const getAnimationClass = (direction: AnimationDirection = 'up'): string => {
    // Return base transition classes
    return "will-change-transform transition-all duration-250 ease-out";
  };

  /**
   * Get initial animation style for an element before it appears
   */
  const getInitialStyle = (direction: AnimationDirection = 'up', index: number = 0, baseDelay: number = 0): React.CSSProperties => {
    // Calculate delay with staggered effect
    const delayMs = baseDelay + (index * 50);
    
    // Base style for all elements
    const baseStyle: React.CSSProperties = {
      opacity: 0,
      transition: `opacity 250ms ease-out, transform 250ms ease-out`,
      transitionDelay: `${delayMs}ms`,
    };
    
    // If user prefers reduced motion, only fade without translation
    if (prefersReducedMotion) {
      return baseStyle;
    }
    
    // Add direction-specific transform
    switch (direction) {
      case 'up':
        return { ...baseStyle, transform: 'translateY(15px)' };
      case 'right':
        return { ...baseStyle, transform: 'translateX(-15px)' };
      case 'down':
        return { ...baseStyle, transform: 'translateY(-15px)' };
      case 'left':
        return { ...baseStyle, transform: 'translateX(15px)' };
      case 'scale':
        return { ...baseStyle, transform: 'scale(0.95)' };
      default:
        return { ...baseStyle, transform: 'translateY(15px)' };
    }
  };
  
  /**
   * Get the animation style for loaded/visible state
   */
  const getFinalStyle = (index: number = 0, baseDelay: number = 0): React.CSSProperties => {
    const delayMs = baseDelay + (index * 50);
    
    return {
      opacity: 1,
      transform: 'translate3d(0,0,0)', // Use translate3d for hardware acceleration
      transitionDelay: `${delayMs}ms`,
      transition: `opacity 250ms ease-out, transform 250ms ease-out`
    };
  };
  
  /**
   * Toggle between initial and final animation styles based on isLoaded state
   */
  const getAnimationStyle = (
    isLoaded: boolean, 
    direction: AnimationDirection = 'up', 
    index: number = 0, 
    baseDelay: number = 0
  ): React.CSSProperties => {
    return isLoaded 
      ? getFinalStyle(index, baseDelay)
      : getInitialStyle(direction, index, baseDelay);
  };

  return {
    getAnimationClass,
    getInitialStyle,
    getFinalStyle,
    getAnimationStyle,
    prefersReducedMotion
  };
}
