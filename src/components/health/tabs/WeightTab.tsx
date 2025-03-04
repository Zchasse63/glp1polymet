
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { WeightEntryForm } from "@/components/WeightEntryForm";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  unit: string;
}

interface WeightTabProps {
  weightEntries: WeightEntry[];
  displayUnit: "lbs" | "kg";
  onToggleDisplayUnit: () => void;
  onAddWeightEntry: (data: { weight: number; date: string; unit: string }) => void;
}

const WeightTab = ({ 
  weightEntries, 
  displayUnit, 
  onToggleDisplayUnit, 
  onAddWeightEntry 
}: WeightTabProps) => {
  const getWeightInDisplayUnit = (weight: number, unit: string): number => {
    if (unit === displayUnit) return weight;
    if (unit === "lbs" && displayUnit === "kg") return weight * 0.45359237;
    if (unit === "kg" && displayUnit === "lbs") return weight * 2.20462262;
    return weight;
  };

  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstEntry = sortedEntries.length > 0 ? sortedEntries[0] : null;
  const lastEntry = sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1] : null;
  
  const startWeight = firstEntry ? getWeightInDisplayUnit(firstEntry.weight, firstEntry.unit) : 0;
  const currentWeight = lastEntry ? getWeightInDisplayUnit(lastEntry.weight, lastEntry.unit) : 0;
  const weightLoss = startWeight - currentWeight;
  const percentageLoss = startWeight > 0 ? (weightLoss / startWeight) * 100 : 0;

  const chartData = weightEntries.map(entry => ({
    date: format(new Date(entry.date), "MMM dd"),
    weight: getWeightInDisplayUnit(entry.weight, entry.unit),
  }));

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Weight Journey</h2>
        <Button onClick={onToggleDisplayUnit} variant="outline" size="sm">
          Display in {displayUnit === "lbs" ? "kg" : "lbs"}
        </Button>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
        <Card className="p-3">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Starting Weight</p>
            <p className="text-xl font-bold">{startWeight.toFixed(1)} {displayUnit}</p>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Current Weight</p>
            <p className="text-xl font-bold">{currentWeight.toFixed(1)} {displayUnit}</p>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="space-y-1">
            <p className="text-xs text-gray-500 font-medium">Weight Loss</p>
            <p className="text-xl font-bold">{weightLoss.toFixed(1)} {displayUnit} <span className="text-sm text-green-600">({percentageLoss.toFixed(1)}%)</span></p>
          </div>
        </Card>
      </div>
      
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
    </>
  );
};

export default WeightTab;
