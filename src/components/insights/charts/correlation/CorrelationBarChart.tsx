
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useI18n } from '@/lib/i18n';
import { CorrelationBarChartProps } from './types';
import { useChartConfig } from './useChartConfig';
import { CustomTooltip } from './CustomTooltip';
import { trackFeatureUsage } from '@/utils/eventTracking';

/**
 * CorrelationBarChart Component
 *
 * Displays correlation data as a bar chart with customizable colors based on positive or negative correlation.
 * Following CodeFarm principles:
 * - User-Centric Design: Clear visualization of complex data
 * - Accessibility: Supports reduced motion preferences
 * - Error Handling: Graceful handling of data edge cases
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

  // Track chart interaction on initial render
  React.useEffect(() => {
    if (data.length > 0) {
      trackFeatureUsage('correlation_chart_viewed', { 
        dataCount: data.length,
        hasNegativeCorrelations: data.some(item => item[correlationKey] < 0)
      });
    }
  }, [data, correlationKey]);

  // Handle empty data case gracefully
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] border border-dashed rounded-md border-muted">
        <p className="text-muted-foreground">No correlation data available</p>
      </div>
    );
  }

  // Function to determine bar fill color based on correlation value
  const getBarFill = (entry: any) => {
    const value = entry[correlationKey];
    if (value === undefined || value === null) return '#ccc';
    return value >= 0 ? barColorPositive : barColorNegative;
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
        <XAxis 
          dataKey={xAxisKey} 
          stroke={axisColor}
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: axisColor }}
        />
        <YAxis 
          stroke={axisColor}
          domain={[-1, 1]} 
          tickFormatter={(value) => value.toFixed(1)}
          tick={{ fontSize: 12 }}
          tickLine={{ stroke: axisColor }}
        />
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
