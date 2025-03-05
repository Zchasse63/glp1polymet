
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeightTab from "./tabs/WeightTab";
import ActivityTab from "./tabs/ActivityTab";
import VitalsTab from "./tabs/VitalsTab";
import NutritionTab from "./tabs/NutritionTab";

/**
 * HealthTabs Props Interface
 */
interface HealthTabsProps { 
  weightEntries: Array<{
    id: string;
    weight: number;
    date: string;
    unit: string;
  }>;
  healthMetrics: {
    activity: Array<{ date: string; value: number }>;
    heartRate: Array<{ date: string; value: number }>;
    sleep: Array<{ date: string; value: number }>;
    hydration: Array<{ date: string; value: number }>;
    calories: Array<{ date: string; value: number }>;
    glucose: Array<{ date: string; value: number }>;
    bloodPressure: Array<{ date: string; systolic: number; diastolic: number }>;
  };
  displayUnit: "lbs" | "kg";
  onToggleDisplayUnit: () => void;
  onAddWeightEntry: (data: { weight: number; date: string; unit: string }) => void;
}

/**
 * HealthTabs Component - Provides tab navigation for different health tracking sections
 * @param props Component props
 * @returns React component
 */
const HealthTabs = ({ 
  weightEntries, 
  healthMetrics, 
  displayUnit, 
  onToggleDisplayUnit, 
  onAddWeightEntry 
}: HealthTabsProps) => {
  return (
    <Tabs defaultValue="weight" className="w-full">
      <TabsList className="grid w-full grid-cols-4 h-auto">
        <TabsTrigger value="weight" className="py-2">Weight</TabsTrigger>
        <TabsTrigger value="activity" className="py-2">Activity</TabsTrigger>
        <TabsTrigger value="vitals" className="py-2">Vitals</TabsTrigger>
        <TabsTrigger value="nutrition" className="py-2">Nutrition</TabsTrigger>
      </TabsList>
      
      <TabsContent value="weight" className="space-y-6 mt-4">
        <WeightTab 
          weightEntries={weightEntries} 
          displayUnit={displayUnit} 
          onToggleDisplayUnit={onToggleDisplayUnit}
          onAddWeightEntry={onAddWeightEntry}
        />
      </TabsContent>
      
      <TabsContent value="activity" className="space-y-6 mt-4">
        <ActivityTab healthMetrics={healthMetrics} />
      </TabsContent>
      
      <TabsContent value="vitals" className="space-y-6 mt-4">
        <VitalsTab healthMetrics={healthMetrics} />
      </TabsContent>
      
      <TabsContent value="nutrition" className="space-y-6 mt-4">
        <NutritionTab healthMetrics={healthMetrics} />
      </TabsContent>
    </Tabs>
  );
};

export default HealthTabs;
