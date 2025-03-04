
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PillIcon, ClockIcon, CalendarIcon } from "lucide-react";

interface MedicationProps {
  medication: {
    id: string;
    name: string;
    dose: string;
    frequency: string;
    lastTaken: string;
    nextDose: string;
    level: number;
    totalDose?: number; // Optional total dose for calculation
    unit?: string; // Optional unit (mg, ml, etc)
    color: string;
  };
}

export function MedicationCard({ medication }: MedicationProps) {
  // Calculate the remaining amount in proper units
  const unit = medication.unit || "mg";
  const totalDose = medication.totalDose || 100;
  const remainingAmount = Math.round((medication.level / 100) * totalDose);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: `${medication.color}20` }}
            >
              <PillIcon
                className="h-5 w-5"
                style={{ color: medication.color }}
              />
            </div>
            <div>
              <h3 className="font-medium">
                {medication.name}
              </h3>
              <p
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                {medication.dose} • {medication.frequency}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              {remainingAmount} {unit}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Remaining
            </p>
          </div>
        </div>

        <Progress
          value={medication.level}
          className="h-2 mb-3"
          style={
            {
              backgroundColor: `${medication.color}20`,
              "--progress-background": medication.color,
            } as React.CSSProperties
          }
        />

        <div className="flex justify-between text-xs">
          <div
            className="flex items-center text-gray-500 dark:text-gray-400"
          >
            <CalendarIcon className="h-3 w-3 mr-1" />
            Last taken: {medication.lastTaken}
          </div>
          <div
            className="flex items-center text-gray-500 dark:text-gray-400"
          >
            <ClockIcon className="h-3 w-3 mr-1" />
            Next dose: {medication.nextDose}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
