
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays, subMonths } from "date-fns";

type WeightDetailProps = {
  weightData: { date: string; weight: number }[];
  currentWeight: string;
  weightUnit: string;
};

export const WeightDetail = ({ weightData, currentWeight, weightUnit }: WeightDetailProps) => {
  const [timeRange, setTimeRange] = React.useState("1M");

  // Generate demo data for different time ranges
  const generateRangeData = (range: string) => {
    const now = new Date();
    const data = [];
    
    switch(range) {
      case "1W":
        // Generate data for 1 week
        for (let i = 7; i >= 0; i--) {
          const date = subDays(now, i);
          data.push({
            date: format(date, "MMM dd"),
            weight: parseFloat(currentWeight) - (Math.random() * 0.5 * (7-i) / 7)
          });
        }
        break;
      case "1M":
        // Generate data for 1 month
        for (let i = 30; i >= 0; i -= 3) {
          const date = subDays(now, i);
          data.push({
            date: format(date, "MMM dd"),
            weight: parseFloat(currentWeight) - (Math.random() * 2 * (30-i) / 30)
          });
        }
        break;
      case "3M":
        // Generate data for 3 months
        for (let i = 90; i >= 0; i -= 7) {
          const date = subDays(now, i);
          data.push({
            date: format(date, "MMM dd"),
            weight: parseFloat(currentWeight) - (Math.random() * 4 * (90-i) / 90)
          });
        }
        break;
      case "1Y":
        // Generate data for 1 year
        for (let i = 12; i >= 0; i--) {
          const date = subMonths(now, i);
          data.push({
            date: format(date, "MMM yyyy"),
            weight: parseFloat(currentWeight) - (Math.random() * 10 * (12-i) / 12)
          });
        }
        break;
    }
    
    return data;
  };
  
  const rangeData = generateRangeData(timeRange);
  
  // Calculate weight stats
  const weights = rangeData.map(item => item.weight);
  const minWeight = Math.min(...weights).toFixed(1);
  const maxWeight = Math.max(...weights).toFixed(1);
  const avgWeight = (weights.reduce((sum, w) => sum + w, 0) / weights.length).toFixed(1);
  
  // Calculate weekly average change
  const weeklyChange = ((parseFloat(currentWeight) - weights[0]) / (rangeData.length / 7)).toFixed(1);
  const isWeightLoss = parseFloat(weeklyChange) < 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1W">1 Week</SelectItem>
            <SelectItem value="1M">1 Month</SelectItem>
            <SelectItem value="3M">3 Months</SelectItem>
            <SelectItem value="1Y">1 Year</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          Current: <span className="font-medium">{currentWeight} {weightUnit}</span>
        </div>
      </div>
      
      <Card>
        <CardContent className="pt-4">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rangeData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  fontSize={11}
                  tickMargin={5}
                />
                <YAxis 
                  fontSize={11}
                  tickFormatter={(value) => `${value} ${weightUnit}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value) => [`${value} ${weightUnit}`, 'Weight']}
                  labelStyle={{ fontSize: 12 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Min Weight</div>
            <div className="text-lg font-semibold mt-1">
              {minWeight} {weightUnit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Max Weight</div>
            <div className="text-lg font-semibold mt-1">
              {maxWeight} {weightUnit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Average</div>
            <div className="text-lg font-semibold mt-1">
              {avgWeight} {weightUnit}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Weekly Change</div>
            <div className={`text-lg font-semibold mt-1 ${isWeightLoss ? 'text-green-500' : 'text-red-500'}`}>
              {weeklyChange} {weightUnit}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WeightDetail;
