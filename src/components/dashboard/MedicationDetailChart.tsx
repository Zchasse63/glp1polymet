
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

// Calculate drug level based on half-life
const calculateDrugLevels = (medicationId: string) => {
  // Generate different data patterns based on medication ID for demo
  const halfLifeHours = getHalfLifeForMedication(medicationId);
  
  // Generate data points for 7 days
  const dataPoints = [];
  const dosesPerDay = getDosesPerDay(medicationId);
  const doseAmount = 100 / dosesPerDay; // Standardized dose amount
  
  let currentLevel = 0;
  
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      // Add medication at dose times
      if (hour % (24 / dosesPerDay) === 0) {
        currentLevel += doseAmount;
      }
      
      // Calculate elimination based on half-life
      const eliminationRate = Math.log(2) / halfLifeHours;
      currentLevel = currentLevel * Math.exp(-eliminationRate);
      
      // Add data point every 4 hours for visualization
      if (hour % 4 === 0) {
        dataPoints.push({
          timepoint: `Day ${day+1}, ${hour}h`,
          level: Math.round(currentLevel),
          adherence: hour % (24 / dosesPerDay) === 0 ? 100 : null,
          displayed: hour === 12, // Only display noon time on X-axis for clarity
          day: day + 1,
          hour
        });
      }
    }
  }
  
  // Convert to simplified day format for chart display
  const chartData = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  for (let i = 0; i < 7; i++) {
    const dayData = dataPoints.filter(point => point.day === i + 1);
    // Take noon reading for each day
    const noonData = dayData.find(point => point.hour === 12) || dayData[0];
    
    chartData.push({
      day: days[i],
      level: noonData.level,
      adherence: 100, // Simplified for display
      effectiveness: 70 + Math.min(30, Math.round(noonData.level / 5)) // Effectiveness related to level
    });
  }
  
  return chartData;
};

// Helper functions for demo data
const getHalfLifeForMedication = (medicationId: string): number => {
  // Demo function that returns different half-lives based on medication ID
  const firstChar = medicationId.charAt(0).toLowerCase();
  const asciiValue = firstChar.charCodeAt(0);
  
  // Generate half-life between 4-36 hours based on first character
  return 4 + (asciiValue % 26) * 1.2;
};

const getDosesPerDay = (medicationId: string): number => {
  // Demo function that returns different dosing schedules based on medication ID
  const lastChar = medicationId.charAt(medicationId.length - 1);
  const value = parseInt(lastChar, 36) % 4;
  
  // Return 1, 2, 3, or 4 doses per day
  return value === 0 ? 1 : value;
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
  const chartData = calculateDrugLevels(medication.id);
  const halfLife = getHalfLifeForMedication(medication.id);
  const dosesPerDay = getDosesPerDay(medication.id);

  return (
    <Card className="border-t border-muted">
      <CardContent className="pt-4">
        <h3 className="text-sm font-medium mb-3">Medication Levels</h3>
        <div className="h-[200px] w-full">
          <ChartContainer
            config={{
              level: {
                label: "Drug Level",
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
            <AreaChart
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
              <Area
                type="monotone"
                dataKey="level"
                stroke={medication.color}
                fill={`${medication.color}40`}
                strokeWidth={2}
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
            </AreaChart>
          </ChartContainer>
        </div>
        <div className="mt-3 text-xs bg-muted p-2 rounded-sm">
          <p className="font-medium mb-1">Pharmacokinetics:</p>
          <p className="text-muted-foreground">
            {medication.name} has a half-life of approximately {halfLife.toFixed(1)} hours 
            with {dosesPerDay === 1 ? 'once' : dosesPerDay === 2 ? 'twice' : `${dosesPerDay}x`} daily dosing.
            Current effectiveness: {chartData[6].effectiveness}%.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationDetailChart;
