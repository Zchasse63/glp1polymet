
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, subDays } from "date-fns";

interface WaterIntakeDetailProps {
  currentIntake: string;
  unit: string;
}

export const WaterIntakeDetail = ({ currentIntake, unit }: WaterIntakeDetailProps) => {
  // Parse current value
  const currentValue = parseFloat(currentIntake);
  
  // Generate demo data
  const data = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    value: parseFloat((currentValue + (Math.random() * 0.8 - 0.3)).toFixed(1))
  }));

  const recommendedDaily = 2.5; // recommended daily water intake in liters

  // Calculate stats
  const values = data.map(d => d.value);
  const stats = {
    avg: (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1),
    max: Math.max(...values).toFixed(1),
    min: Math.min(...values).toFixed(1),
    percentOfTarget: Math.round((currentValue / recommendedDaily) * 100)
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="text-lg font-semibold mt-1">
              {stats.avg} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Highest</div>
            <div className="text-lg font-semibold mt-1">
              {stats.max} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Of Target</div>
            <div className="text-lg font-semibold mt-1">
              {stats.percentOfTarget}%
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
                  tickFormatter={(value) => `${value} ${unit}`}
                  domain={[0, 'auto']}
                />
                <Tooltip 
                  formatter={(value) => [`${value} ${unit}`, 'Water Intake']}
                  labelStyle={{ fontSize: 12 }}
                />
                <ReferenceLine 
                  y={recommendedDaily} 
                  stroke="rgba(0, 128, 255, 0.5)" 
                  strokeDasharray="3 3" 
                  label={{ value: 'Target', position: 'right', fill: 'rgba(0, 128, 255, 0.8)', fontSize: 10 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--chart-5))"
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
          <h3 className="text-md font-medium mb-2">Hydration Insights</h3>
          <p className="text-sm text-muted-foreground">
            Maintaining adequate hydration is essential for overall health. Water helps regulate body temperature, 
            transport nutrients, remove waste, and support proper organ function.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            The recommended daily intake is approximately 2-2.5 liters (8-10 cups) for most adults, 
            though individual needs may vary based on activity level, climate, and other factors.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterIntakeDetail;
