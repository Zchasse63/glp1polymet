
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays } from "date-fns";
import HealthVitalsOverview from "@/components/health/HealthVitalsOverview";
import HealthTabs from "@/components/health/HealthTabs";
import { getWeightInDisplayUnit } from "@/utils/weightUtils";
import { useHealthMetrics } from "@/hooks/useHealthMetrics";
import { WeightEntry, WeightUnit } from "@/types/healthMetrics";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

/**
 * Health Page Component - Main entry point for health tracking features
 * Following the CodeFarm architecture principles:
 * - Modular Design: Delegating responsibilities to specialized components
 * - Clean Architecture: Using hooks for data management
 * - Error Handling: Comprehensive error management
 * - Loading States: Clear feedback during data loading
 */
const HealthPage = () => {
  const [currentPage, setCurrentPage] = useState("health");
  const [displayUnit, setDisplayUnit] = useState<WeightUnit>("lbs");
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    { id: "w1", weight: 185.5, date: format(subDays(new Date(), 14), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w2", weight: 184.0, date: format(subDays(new Date(), 12), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w3", weight: 183.2, date: format(subDays(new Date(), 10), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w4", weight: 182.5, date: format(subDays(new Date(), 7), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w5", weight: 181.8, date: format(subDays(new Date(), 5), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w6", weight: 180.6, date: format(subDays(new Date(), 3), "yyyy-MM-dd"), unit: "lbs" },
    { id: "w7", weight: 179.5, date: format(subDays(new Date(), 1), "yyyy-MM-dd"), unit: "lbs" },
  ]);

  // Use our custom hook to fetch and manage health metrics
  const { healthMetrics, vitalsData, isLoading, error } = useHealthMetrics();

  const toggleDisplayUnit = () => {
    setDisplayUnit(prev => prev === "lbs" ? "kg" : "lbs");
  };

  /**
   * Handles adding a new weight entry to the tracking system
   * @param data Weight entry data including weight, date and unit
   */
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

  // Render loading state
  if (isLoading) {
    return (
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <div className="p-5 flex flex-col items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-lg">Loading health data...</p>
        </div>
      </Layout>
    );
  }

  // Render error state
  if (error) {
    return (
      <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
        <div className="p-5">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load health data. Please try refreshing the page.
              <br />
              Error details: {error.message}
            </AlertDescription>
          </Alert>
        </div>
      </Layout>
    );
  }

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
