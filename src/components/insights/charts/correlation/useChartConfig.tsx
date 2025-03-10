
import { useTheme } from '@/contexts/ThemeContext';
import { useReducedMotion } from '@/utils/accessibility/useReducedMotion';

/**
 * Custom hook for chart configuration
 * 
 * Provides consistent styling for charts based on current theme and accessibility preferences
 * Following CodeFarm Development Methodology:
 * - Holistic Development: Combines technical excellence with design consistency
 * - User-Centric Design: Accommodates accessibility and theme preferences
 */
export const useChartConfig = () => {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();
  const isDark = theme === 'dark';
  
  return {
    theme,
    isReducedMotion,
    // Theme-aware color configurations
    colors: {
      positive: 'hsl(var(--chart-3))',
      negative: 'hsl(var(--chart-4))',
      grid: isDark ? 'rgba(51, 51, 51, 0.6)' : 'rgba(233, 233, 233, 0.8)',
      axis: isDark ? 'rgba(180, 180, 180, 0.9)' : 'rgba(75, 75, 75, 0.9)',
    },
    cartesianGridFill: isDark ? 'rgba(31, 31, 31, 0.4)' : 'rgba(248, 248, 248, 0.6)',
    axisColor: isDark ? 'rgba(160, 160, 160, 0.8)' : 'rgba(102, 102, 102, 0.8)',
    tooltipStyle: {
      backgroundColor: isDark ? 'hsl(var(--card))' : 'hsl(var(--card))', 
      color: isDark ? 'hsl(var(--card-foreground))' : 'hsl(var(--card-foreground))',
      borderColor: isDark ? 'hsl(var(--border))' : 'hsl(var(--border))',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: 'var(--radius)',
      padding: '8px 12px',
      boxShadow: isDark 
        ? '0 4px 12px rgba(0,0,0,0.25)' 
        : '0 2px 8px rgba(0,0,0,0.08)'
    },
    labelStyle: { 
      color: isDark ? 'hsl(var(--card-foreground))' : 'hsl(var(--card-foreground))',
      fontWeight: '500'
    },
    barStroke: isDark ? 'rgba(60, 60, 60, 0.6)' : 'rgba(224, 224, 224, 0.8)',
    // Animation duration (shorter for reduced motion preference)
    animationDuration: isReducedMotion ? 0 : 500,
    // Text sizes for better readability
    fontSize: {
      axis: 12,
      tooltip: 14,
      legend: 13
    },
    // Animation timing functions
    animation: {
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      delay: isReducedMotion ? 0 : 100,
    }
  };
};
