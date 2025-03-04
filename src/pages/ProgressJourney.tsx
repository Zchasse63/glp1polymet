
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
}

const ProgressJourney = () => {
  const [currentPage, setCurrentPage] = useState("progress");
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    { id: "w1", weight: 185.5, date: format(subDays(new Date(), 14), "yyyy-MM-dd") },
    { id: "w2", weight: 184.0, date: format(subDays(new Date(), 12), "yyyy-MM-dd") },
    { id: "w3", weight: 183.2, date: format(subDays(new Date(), 10), "yyyy-MM-dd") },
    { id: "w4", weight: 182.5, date: format(subDays(new Date(), 7), "yyyy-MM-dd") },
    { id: "w5", weight: 181.8, date: format(subDays(new Date(), 5), "yyyy-MM-dd") },
    { id: "w6", weight: 180.6, date: format(subDays(new Date(), 3), "yyyy-MM-dd") },
    { id: "w7", weight: 179.5, date: format(subDays(new Date(), 1), "yyyy-MM-dd") },
  ]);

  // Calculate statistics
  const startWeight = weightEntries.length > 0 ? weightEntries[0].weight : 0;
  const currentWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : 0;
  const weightLoss = startWeight - currentWeight;
  const percentageLoss = startWeight > 0 ? (weightLoss / startWeight) * 100 : 0;

  const handleAddWeightEntry = ({ weight, date }: { weight: number; date: string }) => {
    try {
      const newEntry: WeightEntry = {
        id: `w${Date.now()}`,
        weight,
        date,
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

  // Format chart data for display
  const chartData = weightEntries.map(entry => ({
    date: format(new Date(entry.date), "MMM dd"),
    weight: entry.weight
  }));

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-6">
        <h1 className="text-2xl font-bold">Progress Journey</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500">Starting Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{startWeight.toFixed(1)} lbs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500">Current Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{currentWeight.toFixed(1)} lbs</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-gray-500">Weight Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{weightLoss.toFixed(1)} lbs ({percentageLoss.toFixed(1)}%)</p>
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
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
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
