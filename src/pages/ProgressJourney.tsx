
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { WeightEntryForm } from "@/components/WeightEntryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  unit: string;
}

const ProgressJourney = () => {
  const [currentPage, setCurrentPage] = useState("progress");
  const [displayUnit, setDisplayUnit] = useState<"lbs" | "kg">("lbs");
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    { id: "w1", weight: 185.5, date: format(subDays(new Date(), 14), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w2", weight: 184.0, date: format(subDays(new Date(), 12), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w3", weight: 183.2, date: format(subDays(new Date(), 10), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w4", weight: 182.5, date: format(subDays(new Date(), 7), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w5", weight: 181.8, date: format(subDays(new Date(), 5), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w6", weight: 180.6, date: format(subDays(new Date(), 3), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w7", weight: 179.5, date: format(subDays(new Date(), 1), "yyyy-MM-dd"), unit: "lbs" },
  ]);

  // Convert weight between units
  const convertWeight = (weight: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === "lbs" && toUnit === "kg") return weight * 0.45359237;
    if (fromUnit === "kg" && toUnit === "lbs") return weight * 2.20462262;
    return weight;
  };

  // Get weight in the display unit
  const getWeightInDisplayUnit = (weight: number, unit: string): number => {
    return convertWeight(weight, unit, displayUnit);
  };

  // Calculate statistics
  const sortedEntries = [...weightEntries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const firstEntry = sortedEntries.length > 0 ? sortedEntries[0] : null;
  const lastEntry = sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1] : null;
  
  const startWeight = firstEntry ? getWeightInDisplayUnit(firstEntry.weight, firstEntry.unit) : 0;
  const currentWeight = lastEntry ? getWeightInDisplayUnit(lastEntry.weight, lastEntry.unit) : 0;
  const weightLoss = startWeight - currentWeight;
  const percentageLoss = startWeight > 0 ? (weightLoss / startWeight) * 100 : 0;

  const handleAddWeightEntry = ({ weight, date, unit }: { weight: number; date: string; unit: string }) => {
    try {
      const newEntry: WeightEntry = {
        id: `w${Date.now()}`,
        weight,
        date,
        unit,
      };
      
      // Sort entries by date
      const updatedEntries = [...weightEntries, newEntry].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setWeightEntries(updatedEntries);
    } catch (error) {
      console.error("Error adding weight entry:", error);
    }
  };

  // Toggle display unit
  const toggleDisplayUnit = () => {
    setDisplayUnit(prev => prev === "lbs" ? "kg" : "lbs");
  };

  // Format chart data for display
  const chartData = weightEntries.map(entry => ({
    date: format(new Date(entry.date), "MMM dd"),
    weight: getWeightInDisplayUnit(entry.weight, entry.unit),
  }));

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Progress Journey</h1>
          <Button onClick={toggleDisplayUnit} variant="outline" size="sm">
            Display in {displayUnit === "lbs" ? "kg" : "lbs"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500">Starting Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{startWeight.toFixed(1)} {displayUnit}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500">Current Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentWeight.toFixed(1)} {displayUnit}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500">Weight Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{weightLoss.toFixed(1)} {displayUnit} ({percentageLoss.toFixed(1)}%)</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>Weight Trend</CardTitle>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Record Today's Weight</CardTitle>
          </CardHeader>
          <CardContent>
            <WeightEntryForm onSubmit={handleAddWeightEntry} />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProgressJourney;
