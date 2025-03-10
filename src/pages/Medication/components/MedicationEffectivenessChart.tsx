
import React from "react";
import MedicationEffectivenessChartBase from "@/components/medication/MedicationEffectivenessChart";

interface TrendDataPoint {
  date: string;
  weight: number;
  medication: number;
}

interface MedicationEffectivenessChartProps {
  trendData: TrendDataPoint[];
}

export const MedicationEffectivenessChart: React.FC<MedicationEffectivenessChartProps> = ({ 
  trendData 
}) => {
  return <MedicationEffectivenessChartBase trendData={trendData} />;
};
