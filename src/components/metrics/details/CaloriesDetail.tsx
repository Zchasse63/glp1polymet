
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, subDays } from "date-fns";

interface CaloriesDetailProps {
  currentCalories: string;
  unit: string;
}

export const CaloriesDetail = ({ currentCalories, unit }: CaloriesDetailProps) => {
  // Parse current value
  const currentValue = parseInt(currentCalories.replace(/,/g, ''));
  
  // Generate demo data
  const data = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    value: Math.round(currentValue + (Math.random() * 300 - 150))
  }));

  const targetCalories = 2000; // Example target daily calorie intake

  // Calculate stats
  const values = data.map(d => d.value);
  const stats = {
    avg: Math.round(values.reduce((sum, val) => sum + val, 0) / values.length),
    max: Math.max(...values),
    min: Math.min(...values),
    weeklyTotal: values.reduce((sum, val) => sum + val, 0)
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Daily Average</div>
            <div className="text-lg font-semibold mt-1">
              {stats.avg.toLocaleString()} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Weekly Total</div>
            <div className="text-lg font-semibold mt-1">
              {stats.weeklyTotal.toLocaleString()} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Max Intake</div>
            <div className="text-lg font-semibold mt-1">
              {stats.max.toLocaleString()} {unit}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  fontSize={11}
                  tickMargin={5}
                />
                <YAxis 
                  fontSize={11}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} ${unit}`, 'Calories']}
                  labelStyle={{ fontSize: 12 }}
                />
                <ReferenceLine 
                  y={targetCalories} 
                  stroke="rgba(255, 99, 71, 0.5)" 
                  strokeDasharray="3 3" 
                  label={{ value: 'Target', position: 'right', fill: 'rgba(255, 99, 71, 0.8)', fontSize: 10 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--chart-7))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-md font-medium mb-2">Calorie Insights</h3>
          <p className="text-sm text-muted-foreground">
            Calories are a measurement of energy that your body uses for all activities, from basic functions to exercise.
            Maintaining an appropriate calorie intake is essential for weight management and overall health.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Your target calorie intake should be based on factors like age, gender, weight, height, and activity level.
            Adjusting your intake to match your goals (weight loss, maintenance, or gain) is an effective strategy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaloriesDetail;
