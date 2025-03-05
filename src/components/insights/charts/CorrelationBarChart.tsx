import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { useI18n } from '@/lib/i18n';
import { useReducedMotion } from '@/utils/accessibilityUtils';

interface CorrelationBarChartProps {
  data: { name: string; correlation: number }[];
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
  xAxisKey = 'name',
  correlationKey = 'correlation',
  barColorPositive = '#82ca9d',
  barColorNegative = '#e45649',
  height = 300,
}) => {
  const { theme } = useTheme();
  const { t } = useI18n();
  const isReducedMotion = useReducedMotion();

  const getCorrelationColor = useMemo(() => {
    return (entry: { payload: { [key: string]: number } }) => {
      const correlationValue = entry.payload[correlationKey];
      return correlationValue >= 0 ? barColorPositive : barColorNegative;
    };
  }, [barColorPositive, barColorNegative, correlationKey]);

  const renderCorrelationValue = useMemo(() => {
    return (entry: { payload: { [key: string]: number } }) => {
      return entry.payload[correlationKey];
    };
  }, [correlationKey]);

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
          dataKey={renderCorrelationValue}
          fill={getCorrelationColor}
          radius={[4, 4, 0, 0]}
          isAnimationActive={!isReducedMotion}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
