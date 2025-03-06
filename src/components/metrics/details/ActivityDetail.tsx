
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface ActivityDetailProps {
  currentActivity: string;
  unit: string;
}

export const ActivityDetail = ({ currentActivity, unit }: ActivityDetailProps) => {
  // Generate demo data
  const data = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(new Date(), 6 - i), "MMM dd"),
    value: Math.round(parseFloat(currentActivity) + (Math.random() * 2000 - 1000))
  }));

  const stats = {
    weeklyAvg: Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length),
    weeklyTotal: data.reduce((sum, d) => sum + d.value, 0),
    activeMinutes: Math.round(parseFloat(currentActivity) / 100)
  };

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Weekly Average</div>
            <div className="text-lg font-semibold mt-1">
              {stats.weeklyAvg.toLocaleString()} {unit}
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
            <div className="text-sm text-muted-foreground">Active Minutes</div>
            <div className="text-lg font-semibold mt-1">
              {stats.activeMinutes} min
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
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toLocaleString()} ${unit}`, 'Steps']}
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

export default ActivityDetail;
