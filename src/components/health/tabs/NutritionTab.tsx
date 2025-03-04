
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { UtensilsIcon, DropletIcon } from "lucide-react";
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

interface NutritionTabProps {
  healthMetrics: {
    calories: Array<{ date: string; value: number }>;
    hydration: Array<{ date: string; value: number }>;
  };
}

const NutritionTab = ({ healthMetrics }: NutritionTabProps) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <UtensilsIcon className="h-5 w-5 mr-2 text-green-500" />
              Calories
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-3xl font-bold">1,450 kcal</p>
            <p className="text-sm text-muted-foreground">Daily intake (-350 deficit)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthMetrics.calories} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} kcal`, 'Calories']} />
                <defs>
                  <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fill="url(#caloriesGradient)"
                  fillOpacity={1}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  name="Calories"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <DropletIcon className="h-5 w-5 mr-2 text-blue-500" />
              Hydration
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-3xl font-bold">1.2 L</p>
            <p className="text-sm text-muted-foreground">Water intake (Goal: 2L)</p>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthMetrics.hydration} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} L`, 'Hydration']} />
                <defs>
                  <linearGradient id="hydrationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#hydrationGradient)"
                  fillOpacity={1}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2} 
                  dot={{ r: 4 }} 
                  activeDot={{ r: 6 }} 
                  name="Hydration"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default NutritionTab;
