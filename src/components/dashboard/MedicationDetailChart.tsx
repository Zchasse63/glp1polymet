
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Mock data - in a real app, this would come from an API
const generateMockData = (medicationId: string) => {
  // Generate different data patterns based on medication ID
  const baseData = [
    { day: "Mon", adherence: 100, effectiveness: 85 },
    { day: "Tue", adherence: 100, effectiveness: 87 },
    { day: "Wed", adherence: 100, effectiveness: 89 },
    { day: "Thu", adherence: 100, effectiveness: 91 },
    { day: "Fri", adherence: 100, effectiveness: 93 },
    { day: "Sat", adherence: 100, effectiveness: 94 },
    { day: "Sun", adherence: 100, effectiveness: 96 },
  ];
  
  // Modify data based on medication ID to create unique patterns
  const firstChar = medicationId.charAt(0);
  const seed = firstChar.charCodeAt(0) % 10;
  
  return baseData.map((item, index) => ({
    ...item,
    adherence: Math.max(70, Math.min(100, item.adherence - (seed + index) % 30)),
    effectiveness: Math.max(70, Math.min(98, item.effectiveness - (seed + index) % 15))
  }));
};

type MedicationDetailChartProps = {
  medication: {
    id: string;
    name: string;
    color: string;
    [key: string]: any;
  };
};

const MedicationDetailChart = ({ medication }: MedicationDetailChartProps) => {
  const chartData = generateMockData(medication.id);

  return (
    <Card className="border-t border-muted">
      <CardContent className="pt-4">
        <h3 className="text-sm font-medium mb-3">Weekly Progress</h3>
        <div className="h-[200px] w-full">
          <ChartContainer
            config={{
              adherence: {
                label: "Adherence",
                theme: {
                  light: medication.color,
                  dark: medication.color,
                },
              },
              effectiveness: {
                label: "Effectiveness",
                theme: {
                  light: "#6366f1",
                  dark: "#818cf8",
                },
              },
            }}
          >
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickCount={5}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="adherence"
                stroke={medication.color}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="effectiveness"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        </div>
        <div className="mt-3 text-xs bg-muted p-2 rounded-sm">
          <p className="font-medium mb-1">Analysis:</p>
          <p className="text-muted-foreground">
            {medication.name} shows {chartData[6].effectiveness}% effectiveness with 
            {chartData.filter(d => d.adherence === 100).length} days of perfect adherence.
            {chartData[6].effectiveness > 90 
              ? " Excellent progress!" 
              : chartData[6].effectiveness > 80 
                ? " Good progress, keep it up!" 
                : " Room for improvement."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationDetailChart;
