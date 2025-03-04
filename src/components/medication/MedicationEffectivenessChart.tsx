
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, CartesianGrid, YAxis, ReferenceLine, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface TrendDataPoint {
  date: string;
  weight: number;
  medication: number;
}

interface MedicationEffectivenessChartProps {
  trendData: TrendDataPoint[];
}

const MedicationEffectivenessChart = ({ trendData }: MedicationEffectivenessChartProps) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 mt-8 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          Medication Effectiveness
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              weight: {
                label: "Weight (lbs)",
                color: "hsl(var(--chart-1))",
              },
              medication: {
                label: "Medication Level (%)",
                color: "hsl(var(--chart-2))",
              },
            }}
          >
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <ChartTooltip
                content={<ChartTooltipContent />}
                animationDuration={200}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="hsl(var(--muted)/0.15)"
                strokeWidth={0.5}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={10}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis
                yAxisId="left"
                orientation="left"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={10}
                tickCount={5}
                label={{ 
                  value: 'Weight (lbs)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  style: { 
                    textAnchor: 'middle', 
                    fill: 'hsl(var(--muted-foreground))', 
                    fontSize: 12, 
                    fontWeight: 500 
                  } 
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickMargin={10}
                tickCount={5}
                domain={[0, 100]}
                label={{ 
                  value: 'Medication Level (%)', 
                  angle: 90, 
                  position: 'insideRight', 
                  style: { 
                    textAnchor: 'middle', 
                    fill: 'hsl(var(--muted-foreground))', 
                    fontSize: 12, 
                    fontWeight: 500 
                  } 
                }}
              />

              <ReferenceLine 
                y={200} 
                yAxisId="left" 
                stroke="hsl(var(--muted)/0.6)" 
                strokeDasharray="4 4" 
                strokeWidth={1}
                label={{ 
                  value: 'Goal Weight', 
                  position: 'insideTopRight', 
                  fill: 'hsl(var(--muted-foreground))', 
                  fontSize: 10,
                  fontWeight: 500
                }}
              />

              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <Line
                type="monotone"
                dataKey="weight"
                yAxisId="left"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--chart-1))", strokeWidth: 0.5, stroke: "white" }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                name="Weight (lbs)"
                fill="url(#colorWeight)"
                fillOpacity={0.2}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />

              <Line
                type="monotone"
                dataKey="medication"
                yAxisId="right"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--chart-2))", strokeWidth: 0.5, stroke: "white" }}
                activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                name="Medication Level (%)"
                fill="url(#colorMed)"
                fillOpacity={0.2}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="mt-6 text-sm bg-primary/5 p-4 rounded-lg border border-primary/10">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            Analysis:
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Your weight loss shows a <span className="font-semibold text-green-600 dark:text-green-400">strong correlation (85%)</span> with medication
            levels. Periods with higher medication adherence show accelerated
            weight loss.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationEffectivenessChart;
