
/**
 * CorrelationBarChart Component
 * 
 * Visualizes correlation data between health factors and weight loss.
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear visual representation of complex data
 * - Sustainable Code: Reusable chart component
 * - Performance Optimization: Memoized rendering
 */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Correlation } from '@/utils/insights/types';

interface CorrelationBarChartProps {
  data: Correlation[];
}

const CorrelationBarChart: React.FC<CorrelationBarChartProps> = ({ data }) => {
  // Format data for the chart - convert to percentage for better readability
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      // Convert correlation coefficient to percentage for display
      value: Math.round(item.correlation * 100),
      // Format the value for tooltip display
      formattedValue: Math.round(Math.abs(item.correlation * 100))
    }));
  }, [data]);

  // Custom tooltip to show the correlation value
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-2 rounded-md shadow-md">
          <p className="font-medium">{data.factor}</p>
          <p className="text-sm">
            <span className={data.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.value >= 0 ? 'Positive' : 'Negative'} correlation: {data.formattedValue}%
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={formattedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis 
          type="number" 
          domain={[-100, 100]}
          tickFormatter={(value) => `${Math.abs(value)}%`}
        />
        <YAxis 
          type="category" 
          dataKey="factor" 
          width={120}
          tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine x={0} stroke="#666" />
        <Bar 
          dataKey="value" 
          fill={(data) => data.color || (data.value >= 0 ? "#22c55e" : "#ef4444")}
          radius={[4, 4, 4, 4]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CorrelationBarChart;
