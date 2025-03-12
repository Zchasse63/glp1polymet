
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";
import { Medication } from "@/types/medication";
import { cn } from "@/lib/utils";

interface MedicationCardProps {
  medication: Medication;
  onClick: (medication: Medication) => void;
  index: number;
  isLoaded: boolean;
}

// Use React.memo to prevent unnecessary re-renders
const MedicationCard = memo(({ 
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
      className={cn(
        "w-full overflow-hidden card-hover opacity-0 cursor-pointer transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        isLoaded ? "animate-scale-in opacity-100" : ""
      )}
      style={{ 
        animationDelay: getAnimationDelay(index),
        animationFillMode: "forwards"
      }}
      onClick={() => onClick(med)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-1">
            <h3 className="text-base font-semibold text-foreground">
              {med.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {med.dose} • {med.frequency}
            </p>
          </div>

          <div className="flex items-center text-sm">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
              style={{ backgroundColor: `${med.color}20` }}
            >
              <ClockIcon className="h-4 w-4" style={{ color: med.color }} />
            </div>
            <span className="font-medium whitespace-nowrap">Next: {med.nextDose}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Add displayName for better debugging
MedicationCard.displayName = "MedicationCard";

export default MedicationCard;
