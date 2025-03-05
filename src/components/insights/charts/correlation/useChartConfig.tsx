
import { useTheme } from '@/contexts/ThemeContext';
import { useReducedMotion } from '@/utils/accessibility/useReducedMotion';

/**
 * Custom hook for chart configuration
 * 
 * Provides consistent styling for charts based on current theme and accessibility preferences
 */
export const useChartConfig = () => {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();
  const isDark = theme === 'dark';
  
  return {
    theme,
    isReducedMotion,
    // Theme-aware color configurations
    cartesianGridFill: isDark ? '#1f1f1f' : '#f8f8f8',
    axisColor: isDark ? '#a0a0a0' : '#666666',
    tooltipStyle: {
      backgroundColor: isDark ? '#2d2d2d' : '#ffffff', 
      color: isDark ? '#e0e0e0' : '#333333',
      borderColor: isDark ? '#555555' : '#e0e0e0',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '6px',
      padding: '8px',
      boxShadow: isDark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.15)'
    },
    labelStyle: { 
      color: isDark ? '#e0e0e0' : '#333333',
      fontWeight: '500'
    },
    barStroke: isDark ? '#444444' : '#e0e0e0',
    // Animation duration (shorter for reduced motion preference)
    animationDuration: isReducedMotion ? 0 : 300,
    // Text sizes for better readability
    fontSize: {
      axis: 12,
      tooltip: 14,
      legend: 13
    }
  };
};
