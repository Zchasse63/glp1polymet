
import React from "react";
import { Card } from "@/components/ui/card";

interface WeightSummaryProps {
  startWeight: number;
  currentWeight: number;
  weightLoss: number;
  percentageLoss: number;
  displayUnit: "lbs" | "kg";
}

const WeightSummary: React.FC<WeightSummaryProps> = ({
  startWeight,
  currentWeight,
  weightLoss,
  percentageLoss,
  displayUnit
}) => {
  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
      <Card className="p-3">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium">Starting Weight</p>
          <p className="text-xl font-bold">{startWeight.toFixed(1)} {displayUnit}</p>
        </div>
      </Card>
      
      <Card className="p-3">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium">Current Weight</p>
          <p className="text-xl font-bold">{currentWeight.toFixed(1)} {displayUnit}</p>
        </div>
      </Card>
      
      <Card className="p-3">
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-medium">Weight Loss</p>
          <p className="text-xl font-bold">{weightLoss.toFixed(1)} {displayUnit} <span className="text-sm text-green-600">({percentageLoss.toFixed(1)}%)</span></p>
        </div>
      </Card>
    </div>
  );
};

export default WeightSummary;
