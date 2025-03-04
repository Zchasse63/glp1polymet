
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";

const WeightLossCorrelations = () => {
  // Sample correlation data
  const correlationData = [
    { factor: "Medication Adherence", correlation: 0.85, color: "hsl(142, 76%, 36%)" },
    { factor: "Protein Intake", correlation: 0.72, color: "hsl(142, 76%, 36%)" },
    { factor: "Sleep Quality", correlation: 0.68, color: "hsl(142, 76%, 36%)" },
    { factor: "Step Count", correlation: 0.65, color: "hsl(142, 76%, 36%)" },
    { factor: "Stress Level", correlation: -0.58, color: "hsl(0, 84%, 60%)" },
    { factor: "Carb Intake", correlation: -0.45, color: "hsl(0, 84%, 60%)" },
  ];
  
  // Sort data for better visualization
  const sortedData = [...correlationData].sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
  
  // Format data for horizontal bar chart
  const formattedData = sortedData.map(item => ({
    ...item,
    absValue: Math.abs(item.correlation),
    formattedValue: Math.round(item.correlation * 100)
  }));
  
  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Weight Loss Correlations
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Factors most strongly correlated with your weight loss success
        </p>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={20}
              barGap={2}
            >
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={value => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="factor" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))' }}
                width={120}
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
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                }}
              />
              <Bar 
                dataKey="absValue" 
                background={{ fill: 'hsl(var(--accent))' }}
                radius={[0, 4, 4, 0]}
                animationDuration={1500}
                animationEasing="ease-in-out"
              >
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                  />
                ))}
                <LabelList 
                  dataKey="formattedValue" 
                  position="right" 
                  formatter={(value, name, props) => {
                    const item = props.payload;
                    const sign = item.correlation > 0 ? '+' : '';
                    return `${sign}${value}%`;
                  }}
                  style={{ fill: 'hsl(var(--foreground))', fontWeight: 'bold', fontSize: 12 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm bg-primary/5 p-4 rounded-lg border border-primary/10">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            Key Insight:
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Your weight loss is most strongly correlated with 
            <span className="font-semibold text-green-600 dark:text-green-400"> medication adherence</span> and 
            <span className="font-semibold text-green-600 dark:text-green-400"> protein intake</span>.
            Focus on these areas for maximum results.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightLossCorrelations;
