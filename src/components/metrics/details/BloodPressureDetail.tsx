
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { format, subDays } from "date-fns";

interface BloodPressureDetailProps {
  currentValue: string;
  unit: string;
}

export const BloodPressureDetail = ({ currentValue, unit }: BloodPressureDetailProps) => {
  // Parse current value (e.g., "120/80")
  const [systolic, diastolic] = currentValue.split('/').map(val => parseInt(val.trim()));
  
  // Generate demo data for the past week
  const data = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    systolic: Math.round(systolic + (Math.random() * 8 - 4)),
    diastolic: Math.round(diastolic + (Math.random() * 6 - 3))
  }));

  // Calculate statistics
  const systolicValues = data.map(d => d.systolic);
  const diastolicValues = data.map(d => d.diastolic);
  
  const stats = {
    avgSystolic: Math.round(systolicValues.reduce((sum, val) => sum + val, 0) / systolicValues.length),
    avgDiastolic: Math.round(diastolicValues.reduce((sum, val) => sum + val, 0) / diastolicValues.length),
    maxSystolic: Math.max(...systolicValues),
    maxDiastolic: Math.max(...diastolicValues),
    minSystolic: Math.min(...systolicValues),
    minDiastolic: Math.min(...diastolicValues)
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="text-lg font-semibold mt-1">
              {stats.avgSystolic}/{stats.avgDiastolic} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Highest</div>
            <div className="text-lg font-semibold mt-1">
              {stats.maxSystolic}/{stats.maxDiastolic} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Lowest</div>
            <div className="text-lg font-semibold mt-1">
              {stats.minSystolic}/{stats.minDiastolic} {unit}
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
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    const formattedName = name === 'systolic' ? 'Systolic' : 'Diastolic';
                    return [`${value} ${unit.split('/')[0]}`, formattedName];
                  }}
                  labelStyle={{ fontSize: 12 }}
                />
                <ReferenceLine y={140} stroke="rgba(255, 0, 0, 0.5)" strokeDasharray="3 3" label={{ value: 'High', position: 'right', fill: 'rgba(255, 0, 0, 0.8)', fontSize: 10 }} />
                <ReferenceLine y={90} stroke="rgba(255, 0, 0, 0.5)" strokeDasharray="3 3" label={{ value: 'High', position: 'right', fill: 'rgba(255, 0, 0, 0.8)', fontSize: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  name="systolic"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  name="diastolic"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BloodPressureDetail;
