
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeightTab from "./tabs/WeightTab";
import ActivityTab from "./tabs/ActivityTab";
import VitalsTab from "./tabs/VitalsTab";
import NutritionTab from "./tabs/NutritionTab";

const HealthTabs = ({ 
  weightEntries, 
  healthMetrics, 
  displayUnit, 
  onToggleDisplayUnit, 
  onAddWeightEntry 
}: { 
  weightEntries: any[];
  healthMetrics: any;
  displayUnit: "lbs" | "kg";
  onToggleDisplayUnit: () => void;
  onAddWeightEntry: (data: { weight: number; date: string; unit: string }) => void;
}) => {
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
