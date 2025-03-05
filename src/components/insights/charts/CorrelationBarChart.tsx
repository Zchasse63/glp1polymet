
/**
 * CorrelationBarChart Component
 * 
 * Visualizes correlation data between health factors and weight loss.
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear visual representation of complex data
 * - Sustainable Code: Reusable chart component
 * - Performance Optimization: Memoized rendering
 * - Accessibility: Improved color contrast and labels
 */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Correlation } from '@/utils/insights/types';
import { cn } from '@/lib/utils';

interface CorrelationBarChartProps {
  data: Correlation[];
  className?: string;
}

const CorrelationBarChart: React.FC<CorrelationBarChartProps> = ({ data, className }) => {
  // Format data for the chart - convert to percentage for better readability
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      // Convert correlation coefficient to percentage for display
      value: Math.round(item.correlation * 100),
      // Format the value for tooltip display
      formattedValue: Math.round(Math.abs(item.correlation * 100)),
      // Determine color based on correlation strength
      color: item.color || getCorrelationColor(item.correlation)
    }));
  }, [data]);

  // Get color based on correlation strength
  const getCorrelationColor = (correlation: number): string => {
    const absValue = Math.abs(correlation);
    
    if (correlation > 0) {
      // Positive correlations - green shades
      if (absValue > 0.7) return "#15803d"; // Strong positive - darker green
      if (absValue > 0.4) return "#22c55e"; // Medium positive - medium green
      return "#86efac"; // Weak positive - light green
    } else {
      // Negative correlations - red shades
      if (absValue > 0.7) return "#b91c1c"; // Strong negative - darker red
      if (absValue > 0.4) return "#ef4444"; // Medium negative - medium red
      return "#fca5a5"; // Weak negative - light red
    }
  };

  // Custom tooltip to show the correlation value with additional context
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const absValue = Math.abs(data.value);
      
      // Determine strength text based on correlation value
      let strengthText = "weak";
      if (absValue > 70) strengthText = "very strong";
      else if (absValue > 50) strengthText = "strong";
      else if (absValue > 30) strengthText = "moderate";
      
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md max-w-xs">
          <p className="font-medium mb-1">{data.factor}</p>
          <p className="text-sm mb-1">
            <span className={data.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.value >= 0 ? 'Positive' : 'Negative'} correlation: {data.formattedValue}%
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {data.value >= 0 
              ? `This factor shows a ${strengthText} positive relationship with your weight loss.`
              : `This factor shows a ${strengthText} negative relationship with your weight loss.`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%" className={cn("mt-2", className)}>
      <BarChart
        data={formattedData}
        layout="vertical"
        margin={{ top: 5, right: 20, left: 20, bottom: 15 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis 
          type="number" 
          domain={[-100, 100]}
          tickFormatter={(value) => `${Math.abs(value)}%`}
        >
          <Label 
            value="Correlation Strength (%)" 
            offset={0} 
            position="bottom" 
            style={{ fontSize: '0.75rem', fill: '#6b7280' }} 
          />
        </XAxis>
        <YAxis 
          type="category" 
          dataKey="factor" 
          width={120}
          tickMargin={5}
          tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
          style={{ fontSize: '0.75rem' }}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x={0} stroke="#666" />
        <Bar 
          dataKey="value" 
          fill={(data) => data.color || (data.value >= 0 ? "#22c55e" : "#ef4444")}
          radius={[4, 4, 4, 4]}
          animationDuration={800}
          animationBegin={300}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(CorrelationBarChart);
