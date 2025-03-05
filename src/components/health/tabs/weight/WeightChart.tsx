
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Line, 
  LineChart, 
  XAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  YAxis, 
  Tooltip, 
  Area
} from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WeightEntryForm } from "@/components/WeightEntryForm";

interface WeightChartProps {
  chartData: Array<{ date: string; weight: number }>;
  displayUnit: "lbs" | "kg";
  onAddWeightEntry: (data: { weight: number; date: string; unit: string }) => void;
}

const WeightChart: React.FC<WeightChartProps> = ({ 
  chartData, 
  displayUnit,
  onAddWeightEntry
}) => {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Weight Trend</CardTitle>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Add Weight Entry</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h3 className="font-medium">Record Today's Weight</h3>
                <WeightEntryForm onSubmit={onAddWeightEntry} />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => `${value} ${displayUnit}`}
              />
              <Tooltip formatter={(value) => [`${value} ${displayUnit}`, 'Weight']} />
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="weight" 
                stroke="#4f46e5" 
                strokeWidth={2}
                fill="url(#weightGradient)"
                fillOpacity={1}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#4f46e5" 
                strokeWidth={2} 
                dot={{ r: 4 }} 
                activeDot={{ r: 6 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightChart;
