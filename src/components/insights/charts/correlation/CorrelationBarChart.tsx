
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/lib/i18n';
import { CorrelationBarChartProps } from './types';
import { useChartConfig } from './useChartConfig';
import { CustomTooltip } from './CustomTooltip';

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
  const { t } = useI18n();
  const { 
    isReducedMotion, 
    cartesianGridFill, 
    axisColor, 
    tooltipStyle, 
    labelStyle,
    barStroke 
  } = useChartConfig();

  // Function to determine bar fill color based on correlation value
  const getBarFill = (entry: any) => {
    return entry[correlationKey] >= 0 ? barColorPositive : barColorNegative;
  };

  // Apply colors to each data point
  const dataWithColors = data.map(item => ({
    ...item,
    fill: getBarFill(item)
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={dataWithColors}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" fill={cartesianGridFill} />
        <XAxis dataKey={xAxisKey} stroke={axisColor} />
        <YAxis stroke={axisColor} />
        <Tooltip 
          content={<CustomTooltip 
            correlationKey={correlationKey} 
            tooltipStyle={tooltipStyle} 
            labelStyle={labelStyle}
          />}
        />
        <Bar
          dataKey={correlationKey}
          radius={[4, 4, 0, 0]}
          isAnimationActive={!isReducedMotion}
          fillOpacity={0.8}
          maxBarSize={60}
          stroke={barStroke}
          strokeWidth={1}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
