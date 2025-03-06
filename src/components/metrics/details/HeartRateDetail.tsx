
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface HeartRateDetailProps {
  currentRate: string;
  unit: string;
}

export const HeartRateDetail = ({ currentRate, unit }: HeartRateDetailProps) => {
  // Generate demo data
  const data = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    value: Math.round(parseFloat(currentRate) + (Math.random() * 10 - 5))
  }));

  const stats = {
    min: Math.min(...data.map(d => d.value)),
    max: Math.max(...data.map(d => d.value)),
    avg: Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length)
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
            <div className="text-sm text-muted-foreground">Minimum</div>
            <div className="text-lg font-semibold mt-1">
              {stats.min} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Maximum</div>
            <div className="text-lg font-semibold mt-1">
              {stats.max} {unit}
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
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value) => [`${value} ${unit}`, 'Heart Rate']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))"
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

export default HeartRateDetail;
