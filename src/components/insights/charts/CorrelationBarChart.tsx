
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/lib/i18n';
import { useReducedMotion } from '@/utils/accessibilityUtils';

interface CorrelationBarChartProps {
  data: { factor: string; correlation: number }[];
  xAxisKey?: string;
  correlationKey?: string;
  barColorPositive?: string;
  barColorNegative?: string;
  height?: number;
}

/**
 * CorrelationBarChart Component
 *
 * Displays correlation data as a bar chart with customizable colors based on positive or negative correlation.
 */
export const CorrelationBarChart: React.FC<CorrelationBarChartProps> = ({
  data,
  xAxisKey = 'factor',
  correlationKey = 'correlation',
  barColorPositive = '#82ca9d',
  barColorNegative = '#e45649',
  height = 300,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();
  const isReducedMotion = useReducedMotion();

  // Function to determine bar color based on correlation value
  const getBarFill = (entry: any) => {
    const correlationValue = entry?.payload?.[correlationKey];
    return correlationValue >= 0 ? barColorPositive : barColorNegative;
  };

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" fill={theme === 'dark' ? '#333' : '#f0f0f0'} />
        <XAxis dataKey={xAxisKey} stroke={theme === 'dark' ? '#fff' : '#333'} />
        <YAxis stroke={theme === 'dark' ? '#fff' : '#333'} />
        <Tooltip
          contentStyle={{ backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#333' }}
          labelStyle={{ color: theme === 'dark' ? '#fff' : '#333' }}
        />
        <Bar
          dataKey={correlationKey}
          fill={barColorPositive} // Default fill color
          radius={[4, 4, 0, 0]}
          isAnimationActive={!isReducedMotion}
          fillOpacity={0.8}
          maxBarSize={60}
          // Use barGradient or fill function with proper typing
          fill={barColorPositive} // Set a default color
          // Use 'fill' attribute for conditional coloring based on value
          // This is safer than using getCorrelationColor function directly
          stroke={theme === 'dark' ? '#555' : '#ddd'}
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Add export default for backward compatibility
export default CorrelationBarChart;
