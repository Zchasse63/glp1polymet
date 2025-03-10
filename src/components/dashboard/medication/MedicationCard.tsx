
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ClockIcon } from "lucide-react";
import { Medication } from "@/types/medication";
import MedicationIcon from "./MedicationIcon";

interface MedicationCardProps {
  medication: Medication;
  onClick: (medication: Medication) => void;
  index: number;
  isLoaded: boolean;
}

export const MedicationCard = ({ 
  medication: med, 
  onClick, 
  index, 
  isLoaded 
}: MedicationCardProps) => {
  // Animation delay utility
  const getAnimationDelay = (index: number) => `${index * 0.05}s`;

  return (
    <Card
      key={med.id}
      className={`w-full overflow-hidden border-0 shadow-md opacity-0 cursor-pointer ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
      style={{ 
        background: `linear-gradient(to right, ${med.color}15, transparent)`,
        borderRadius: '12px',
        animationDelay: getAnimationDelay(index),
        animationFillMode: "forwards"
      }}
      onClick={() => onClick(med)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 mr-4">
              <MedicationIcon 
                medicationId={med.id} 
                color={med.color}
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">
                {med.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {med.dose} • {med.frequency}
              </p>
            </div>
          </div>

          <div className="flex-1 mx-6 max-w-xs">
            <Progress
              value={(parseFloat(med.level) / parseFloat(med.totalAmount)) * 100}
              className="h-2 mb-1 rounded-full"
              style={
                {
                  backgroundColor: `${med.color}20`,
                  "--progress-background": med.color,
                } as React.CSSProperties
              }
            />
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                {med.level} / {med.totalAmount}
              </span>
            </div>
          </div>

          <div className="flex items-center text-sm">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
              style={{ backgroundColor: `${med.color}20` }}
            >
              <ClockIcon className="h-4 w-4" style={{ color: med.color }} />
            </div>
            <span className="font-medium">Next: {med.nextDose}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationCard;
