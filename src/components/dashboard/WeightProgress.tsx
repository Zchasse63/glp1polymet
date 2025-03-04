
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line, LineChart, XAxis, CartesianGrid, ResponsiveContainer, YAxis, Tooltip } from "recharts";

type WeightDataPoint = {
  date: string;
  weight: number;
};

type WeightProgressProps = {
  weightData: WeightDataPoint[];
  isLoaded: boolean;
  onViewDetails: () => void;
};

export const WeightProgress = ({ weightData, isLoaded, onViewDetails }: WeightProgressProps) => {
  return (
    <section 
      className={`opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
      style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
    >
      <Card className="card-hover">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              Weight Progress
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="hover:bg-primary/5"
              onClick={onViewDetails}
            >
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                -18 lbs
              </div>
              <div className="text-sm text-muted-foreground">
                Since starting GLP-1
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold">
                192 lbs
              </div>
              <div className="text-sm text-muted-foreground">
                Current weight
              </div>
            </div>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weightData}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.3)" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  tickMargin={10} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                  tickMargin={10}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "hsl(var(--chart-1))" }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                  animationDuration={2000}
                  animationEasing="ease-in-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default WeightProgress;
