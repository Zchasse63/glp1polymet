
import { useTheme } from '@/contexts/ThemeContext';
import { useReducedMotion } from '@/utils/accessibilityUtils';

export const useChartConfig = () => {
  const { theme } = useTheme();
  const isReducedMotion = useReducedMotion();
  
  return {
    theme,
    isReducedMotion,
    cartesianGridFill: theme === 'dark' ? '#333' : '#f0f0f0',
    axisColor: theme === 'dark' ? '#fff' : '#333',
    tooltipStyle: {
      backgroundColor: theme === 'dark' ? '#333' : '#fff', 
      color: theme === 'dark' ? '#fff' : '#333'
    },
    labelStyle: { 
      color: theme === 'dark' ? '#fff' : '#333' 
    },
    barStroke: theme === 'dark' ? '#555' : '#ddd'
  };
};
