import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { WeightEntryForm } from "@/components/WeightEntryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import HealthVitalsOverview from "@/components/health/HealthVitalsOverview";
import { 
  ActivityIcon, 
  HeartIcon, 
  MoonIcon, 
  DropletIcon, 
  UtensilsIcon, 
  BrainIcon,
  WeightIcon,
  Plus
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  unit: string;
}

const HealthPage = () => {
  const [currentPage, setCurrentPage] = useState("health");
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

  const healthMetrics = {
    activity: [
      { date: format(subDays(new Date(), 6), "MMM dd"), value: 5823 },
      { date: format(subDays(new Date(), 5), "MMM dd"), value: 7254 },
      { date: format(subDays(new Date(), 4), "MMM dd"), value: 6542 },
      { date: format(subDays(new Date(), 3), "MMM dd"), value: 8321 },
      { date: format(subDays(new Date(), 2), "MMM dd"), value: 7123 },
      { date: format(subDays(new Date(), 1), "MMM dd"), value: 6254 },
      { date: format(new Date(), "MMM dd"), value: 4517 },
    ],
    heartRate: [
      { date: format(subDays(new Date(), 6), "MMM dd"), value: 74 },
      { date: format(subDays(new Date(), 5), "MMM dd"), value: 72 },
      { date: format(subDays(new Date(), 4), "MMM dd"), value: 75 },
      { date: format(subDays(new Date(), 3), "MMM dd"), value: 73 },
      { date: format(subDays(new Date(), 2), "MMM dd"), value: 71 },
      { date: format(subDays(new Date(), 1), "MMM dd"), value: 70 },
      { date: format(new Date(), "MMM dd"), value: 72 },
    ],
    sleep: [
      { date: format(subDays(new Date(), 6), "MMM dd"), value: 6.8 },
      { date: format(subDays(new Date(), 5), "MMM dd"), value: 7.2 },
      { date: format(subDays(new Date(), 4), "MMM dd"), value: 6.5 },
      { date: format(subDays(new Date(), 3), "MMM dd"), value: 7.5 },
      { date: format(subDays(new Date(), 2), "MMM dd"), value: 8.1 },
      { date: format(subDays(new Date(), 1), "MMM dd"), value: 7.3 },
      { date: format(new Date(), "MMM dd"), value: 7.5 },
    ],
    hydration: [
      { date: format(subDays(new Date(), 6), "MMM dd"), value: 1.6 },
      { date: format(subDays(new Date(), 5), "MMM dd"), value: 1.8 },
      { date: format(subDays(new Date(), 4), "MMM dd"), value: 1.5 },
      { date: format(subDays(new Date(), 3), "MMM dd"), value: 2.0 },
      { date: format(subDays(new Date(), 2), "MMM dd"), value: 1.9 },
      { date: format(subDays(new Date(), 1), "MMM dd"), value: 1.7 },
      { date: format(new Date(), "MMM dd"), value: 1.2 },
    ],
    calories: [
      { date: format(subDays(new Date(), 6), "MMM dd"), value: 1650 },
      { date: format(subDays(new Date(), 5), "MMM dd"), value: 1580 },
      { date: format(subDays(new Date(), 4), "MMM dd"), value: 1720 },
      { date: format(subDays(new Date(), 3), "MMM dd"), value: 1490 },
      { date: format(subDays(new Date(), 2), "MMM dd"), value: 1560 },
      { date: format(subDays(new Date(), 1), "MMM dd"), value: 1620 },
      { date: format(new Date(), "MMM dd"), value: 1450 },
    ],
    glucose: [
      { date: format(subDays(new Date(), 6), "MMM dd"), value: 102 },
      { date: format(subDays(new Date(), 5), "MMM dd"), value: 97 },
      { date: format(subDays(new Date(), 4), "MMM dd"), value: 105 },
      { date: format(subDays(new Date(), 3), "MMM dd"), value: 99 },
      { date: format(subDays(new Date(), 2), "MMM dd"), value: 101 },
      { date: format(subDays(new Date(), 1), "MMM dd"), value: 96 },
      { date: format(new Date(), "MMM dd"), value: 98 },
    ],
    bloodPressure: [
      { date: format(subDays(new Date(), 6), "MMM dd"), systolic: 122, diastolic: 81 },
      { date: format(subDays(new Date(), 5), "MMM dd"), systolic: 119, diastolic: 79 },
      { date: format(subDays(new Date(), 4), "MMM dd"), systolic: 125, diastolic: 82 },
      { date: format(subDays(new Date(), 3), "MMM dd"), systolic: 121, diastolic: 80 },
      { date: format(subDays(new Date(), 2), "MMM dd"), systolic: 118, diastolic: 78 },
      { date: format(subDays(new Date(), 1), "MMM dd"), systolic: 122, diastolic: 80 },
      { date: format(new Date(), "MMM dd"), systolic: 120, diastolic: 80 },
    ],
  };

  const vitalsData = {
    heartRate: { current: 72, trend: -2 },
    bloodPressure: { systolic: 120, diastolic: 80, trend: -1 },
    steps: { current: 6254, trend: 5 },
    sleep: { hours: 7, minutes: 32, trend: 3 },
    water: { current: 1.2, trend: -15 },
    calories: { current: 1450, trend: -8 },
    glucose: { current: 98, trend: 0 },
    hrv: { current: 58, trend: 2 },
  };

  const convertWeight = (weight: number, fromUnit: string, toUnit: string): number => {
    if (fromUnit === toUnit) return weight;
    if (fromUnit === "lbs" && toUnit === "kg") return weight * 0.45359237;
    if (fromUnit === "kg" && toUnit === "lbs") return weight * 2.20462262;
    return weight;
  };

  const getWeightInDisplayUnit = (weight: number, unit: string): number => {
    return convertWeight(weight, unit, displayUnit);
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

  const handleAddWeightEntry = ({ weight, date, unit }: { weight: number; date: string; unit: string }) => {
    try {
      const newEntry: WeightEntry = {
        id: `w${Date.now()}`,
        weight,
        date,
        unit,
      };
      
      const updatedEntries = [...weightEntries, newEntry].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      setWeightEntries(updatedEntries);
    } catch (error) {
      console.error("Error adding weight entry:", error);
    }
  };

  const toggleDisplayUnit = () => {
    setDisplayUnit(prev => prev === "lbs" ? "kg" : "lbs");
  };

  const chartData = weightEntries.map(entry => ({
    date: format(new Date(entry.date), "MMM dd"),
    weight: getWeightInDisplayUnit(entry.weight, entry.unit),
  }));

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Health Overview</h1>
        </div>
        
        <Card className="bg-white p-4">
          <CardContent className="p-0">
            <HealthVitalsOverview vitals={vitalsData} />
          </CardContent>
        </Card>
        
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="weight" className="py-2">Weight</TabsTrigger>
            <TabsTrigger value="activity" className="py-2">Activity</TabsTrigger>
            <TabsTrigger value="vitals" className="py-2">Vitals</TabsTrigger>
            <TabsTrigger value="nutrition" className="py-2">Nutrition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weight" className="space-y-6 mt-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Weight Journey</h2>
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
                        <WeightEntryForm onSubmit={handleAddWeightEntry} />
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
          </TabsContent>
          
          <TabsContent value="activity" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <ActivityIcon className="h-5 w-5 mr-2 text-primary" />
                    Steps
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold">6,254</p>
                  <p className="text-sm text-muted-foreground">Today's steps</p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthMetrics.activity} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} steps`, 'Activity']} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#4f46e5" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Steps"
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
                    <MoonIcon className="h-5 w-5 mr-2 text-indigo-500" />
                    Sleep
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold">7h 32m</p>
                  <p className="text-sm text-muted-foreground">Last night's sleep</p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthMetrics.sleep} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} hours`, 'Sleep']} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8b5cf6" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Sleep"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vitals" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center">
                    <HeartIcon className="h-5 w-5 mr-2 text-rose-500" />
                    Heart Rate
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold">72 bpm</p>
                  <p className="text-sm text-muted-foreground">Resting heart rate</p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthMetrics.heartRate} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} bpm`, 'Heart Rate']} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Heart Rate"
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
                    <ActivityIcon className="h-5 w-5 mr-2 text-cyan-500" />
                    Blood Pressure
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold">120/80</p>
                  <p className="text-sm text-muted-foreground">Current blood pressure</p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthMetrics.bloodPressure} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value, name) => {
                          return [`${value} mmHg`, name === "systolic" ? "Systolic" : "Diastolic"];
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="systolic" 
                        stroke="#06b6d4" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Systolic"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="diastolic" 
                        stroke="#0891b2" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Diastolic"
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
                    <BrainIcon className="h-5 w-5 mr-2 text-amber-500" />
                    Glucose
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-3xl font-bold">98 mg/dL</p>
                  <p className="text-sm text-muted-foreground">Fasting blood glucose</p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={healthMetrics.glucose} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} mg/dL`, 'Glucose']} />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#f59e0b" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                        activeDot={{ r: 6 }} 
                        name="Glucose"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition" className="space-y-6 mt-4">
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
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default HealthPage;
