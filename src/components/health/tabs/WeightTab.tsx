
import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import WeightSummary from "./weight/WeightSummary";
import WeightChart from "./weight/WeightChart";

interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  unit: string;
}

interface WeightTabProps {
  weightEntries: WeightEntry[];
  displayUnit: "lbs" | "kg";
  onToggleDisplayUnit: () => void;
  onAddWeightEntry: (data: { weight: number; date: string; unit: string }) => void;
}

const WeightTab = ({ 
  weightEntries, 
  displayUnit, 
  onToggleDisplayUnit, 
  onAddWeightEntry 
}: WeightTabProps) => {
  const getWeightInDisplayUnit = (weight: number, unit: string): number => {
    if (unit === displayUnit) return weight;
    if (unit === "lbs" && displayUnit === "kg") return weight * 0.45359237;
    if (unit === "kg" && displayUnit === "lbs") return weight * 2.20462262;
    return weight;
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

  const chartData = weightEntries.map(entry => ({
    date: format(new Date(entry.date), "MMM dd"),
    weight: getWeightInDisplayUnit(entry.weight, entry.unit),
  }));

  return (
    <>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Weight Journey</h2>
        <Button onClick={onToggleDisplayUnit} variant="outline" size="sm">
          Display in {displayUnit === "lbs" ? "kg" : "lbs"}
        </Button>
      </div>
      
      <WeightSummary
        startWeight={startWeight}
        currentWeight={currentWeight}
        weightLoss={weightLoss}
        percentageLoss={percentageLoss}
        displayUnit={displayUnit}
      />
      
      <WeightChart
        chartData={chartData}
        displayUnit={displayUnit}
        onAddWeightEntry={onAddWeightEntry}
      />
    </>
  );
};

export default WeightTab;
