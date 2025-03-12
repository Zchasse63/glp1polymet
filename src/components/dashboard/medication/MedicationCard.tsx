
import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ClockIcon } from "lucide-react";
import { Medication } from "@/types/medication";
import { cn } from "@/lib/utils";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";

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
  const { getAnimationClass, getLoadedStyle } = useAnimationTransition();

  return (
    <Card
      key={med.id}
      className={cn(
        "w-full overflow-hidden card-hover cursor-pointer transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        getAnimationClass('fade-slide-up')
      )}
      style={getLoadedStyle(isLoaded, index)}
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

          <div className="flex items-center space-x-2 min-w-[120px] justify-end">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
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
