
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeightTab from "./tabs/WeightTab";
import ActivityTab from "./tabs/ActivityTab";
import VitalsTab from "./tabs/VitalsTab";
import NutritionTab from "./tabs/NutritionTab";
import { HealthMetricsData, WeightEntry, WeightUnit } from "@/types/healthMetrics";

/**
 * HealthTabs Props Interface
 * Following CodeFarm architecture principles:
 * - Strong Typing: Comprehensive type definitions
 * - Documentation: Detailed JSDoc comments
 */
interface HealthTabsProps { 
  /** Array of weight entries for weight tracking */
  weightEntries: WeightEntry[];
  /** Comprehensive health metrics data */
  healthMetrics: HealthMetricsData;
  /** Current display unit for weight (lbs or kg) */
  displayUnit: WeightUnit;
  /** Handler for toggling between weight display units */
  onToggleDisplayUnit: () => void;
  /** Handler for adding new weight entries */
  onAddWeightEntry: (data: { weight: number; date: string; unit: string }) => void;
}

/**
 * HealthTabs Component - Provides tab navigation for different health tracking sections
 * Following CodeFarm architecture principles:
 * - Modular Design: Separate tabs for different health domains
 * - Composition: Delegating specialized functionality to child components
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
