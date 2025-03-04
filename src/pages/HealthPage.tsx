
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays } from "date-fns";
import HealthVitalsOverview from "@/components/health/HealthVitalsOverview";
import HealthTabs from "@/components/health/HealthTabs";
import { getWeightInDisplayUnit } from "@/utils/weightUtils";

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

  // Sample health metrics data
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

  // Vitals data for the overview section
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

  const toggleDisplayUnit = () => {
    setDisplayUnit(prev => prev === "lbs" ? "kg" : "lbs");
  };

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
        
        <HealthTabs 
          weightEntries={weightEntries} 
          healthMetrics={healthMetrics}
          displayUnit={displayUnit}
          onToggleDisplayUnit={toggleDisplayUnit}
          onAddWeightEntry={handleAddWeightEntry}
        />
      </div>
    </Layout>
  );
};

export default HealthPage;
