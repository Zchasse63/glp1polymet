
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface SleepDetailProps {
  currentSleep: string;
  unit: string;
}

export const SleepDetail = ({ currentSleep, unit }: SleepDetailProps) => {
  // Generate demo data
  const data = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    value: parseFloat(currentSleep) + (Math.random() * 2 - 1)
  }));

  const stats = {
    avg: (data.reduce((sum, d) => sum + d.value, 0) / data.length).toFixed(1),
    deepSleep: ((parseFloat(currentSleep) * 0.3)).toFixed(1),
    remSleep: ((parseFloat(currentSleep) * 0.25)).toFixed(1)
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Average Sleep</div>
            <div className="text-lg font-semibold mt-1">
              {stats.avg} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Deep Sleep</div>
            <div className="text-lg font-semibold mt-1">
              {stats.deepSleep} {unit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">REM Sleep</div>
            <div className="text-lg font-semibold mt-1">
              {stats.remSleep} {unit}
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
                  formatter={(value) => [`${value} ${unit}`, 'Sleep Duration']}
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

export default SleepDetail;
