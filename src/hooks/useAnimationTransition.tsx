
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
    // Return empty string if user prefers reduced motion
    if (prefersReducedMotion) {
      return "opacity-0 transition-opacity duration-200 ease-out opacity-100";
    }

    // Default animation with hardware acceleration
    return `opacity-0 will-change-transform animate-${animationType}`;
  };

  /**
   * Get inline style for animation delays when not using predefined variants
   */
  const getAnimationStyle = (index: number = 0, baseDelay: number = 0): React.CSSProperties => {
    if (prefersReducedMotion) {
      return {};
    }
    
    const delayMs = baseDelay + (index * 50);
    return {
      animationDelay: `${delayMs}ms`,
      animationFillMode: 'forwards'
    };
  };

  return {
    getAnimationClass,
    getAnimationStyle,
    prefersReducedMotion
  };
}
