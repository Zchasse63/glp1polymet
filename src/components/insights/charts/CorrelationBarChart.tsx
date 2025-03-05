
import React from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList, ReferenceLine } from "recharts";

interface CorrelationBarChartProps {
  formattedData: Array<{
    factor: string;
    correlation: number;
    color: string;
    value: number;
    formattedValue: number;
  }>;
}

const CorrelationBarChart: React.FC<CorrelationBarChartProps> = ({ formattedData }) => {
  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
          barSize={16}
          barGap={2}
        >
          <XAxis 
            type="number" 
            domain={[-100, 100]} 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={value => `${Math.abs(value)}%`}
            tickCount={5}
          />
          <YAxis 
            type="category" 
            dataKey="factor" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 500 }}
            width={130}
            tickMargin={8}
          />
          <Tooltip
            formatter={(value, name, props) => {
              const item = props.payload;
              const sign = item.correlation > 0 ? '+' : '';
              return [`${sign}${item.formattedValue}%`, 'Correlation'];
            }}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '0.5rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              padding: '8px 12px',
              fontSize: '12px',
            }}
            wrapperStyle={{
              outline: 'none',
            }}
            cursor={{ fill: 'hsl(var(--muted)/0.15)' }}
          />
          <ReferenceLine 
            x={0} 
            stroke="hsl(var(--border))" 
            strokeWidth={2} 
            label={{ 
              value: "Neutral", 
              position: "top", 
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10 
            }} 
          />
          <Bar 
            dataKey="value"
            background={{ fill: 'hsl(var(--accent)/0.4)', radius: 4 }}
            radius={4}
            animationDuration={1500}
            animationEasing="ease-out"
          >
            {formattedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                style={{ filter: 'brightness(1.05)' }}
              />
            ))}
            <LabelList 
              dataKey="formattedValue" 
              position="right"
              formatter={(value, name, props) => {
                if (props && props.payload) {
                  const item = props.payload;
                  const sign = item.correlation > 0 ? '+' : '';
                  return `${sign}${value}%`;
                }
                return value;
              }}
              style={{ 
                fill: 'hsl(var(--foreground))', 
                fontWeight: 'bold', 
                fontSize: 12,
                filter: 'drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1))'
              }}
              offset={8}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationBarChart;
