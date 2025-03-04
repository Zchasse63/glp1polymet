
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart, XAxis, CartesianGrid } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

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
    <Card className="border border-gray-200 dark:border-gray-700 mt-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Medication Effectiveness
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="h-[250px] w-full">
          <ChartContainer
            config={{}}
            className="aspect-[none] h-[250px]"
          >
            <LineChart
              data={trendData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <ChartTooltip
                content={<ChartTooltipContent />}
              />
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
                tickMargin={10}
              />

              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--chart-1))" }}
                activeDot={{ r: 6 }}
                name="Weight (lbs)"
                radius={4}
                fill="url(#colorWeight)"
                fillOpacity={0.2}
              />

              <Line
                type="monotone"
                dataKey="medication"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                activeDot={{ r: 6 }}
                name="Medication Level (%)"
                radius={4}
                fill="url(#colorMed)"
                fillOpacity={0.2}
              />
              
              {/* Add gradient fills */}
              <defs>
                <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </LineChart>
          </ChartContainer>
        </div>

        <div className="mt-4 text-sm">
          <p className="font-medium text-gray-700 dark:text-gray-300">
            Analysis:
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Your weight loss shows a strong correlation with medication
            levels. Periods with higher medication adherence show accelerated
            weight loss.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationEffectivenessChart;
