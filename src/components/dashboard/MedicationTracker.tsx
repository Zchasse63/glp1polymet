
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { useMedicationPreferences } from "@/hooks/useMedicationPreferences";
import { Medication } from "@/types/medication";
import MedicationCard from "./medication/MedicationCard";
import MedicationEmptyState from "./medication/MedicationEmptyState";
import MedicationDetailDialog from "./medication/MedicationDetailDialog";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";
import { cn } from "@/lib/utils";

type MedicationTrackerProps = {
  medications: Medication[];
  isLoaded: boolean;
  onViewAll: () => void;
};

export const MedicationTracker = ({ medications, isLoaded, onViewAll }: MedicationTrackerProps) => {
  // Get selected medications
  const { selectedMedications } = useMedicationPreferences();
  const { getAnimationClass, getLoadedStyle } = useAnimationTransition();
  
  // Filter medications based on preferences
  const filteredMedications = medications.filter(medication => 
    selectedMedications.includes(medication.id)
  );
  
  // State for tracking which medication details to show
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  // Handle medication card click
  const handleMedicationSelect = (medication: Medication) => {
    setSelectedMedication(medication);
  };

  // Handle dialog close
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) setSelectedMedication(null);
  };

  return (
    <section 
      className={cn(
        "space-y-3",
        getAnimationClass('fade-slide-up')
      )}
      style={getLoadedStyle(isLoaded, 2)}
    >
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-semibold">
          Medication Tracker
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary flex items-center hover:bg-primary/5"
          onClick={onViewAll}
        >
          View all <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="flex flex-col space-y-3">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((medication, index) => (
            <MedicationCard
              key={medication.id}
              medication={medication}
              onClick={handleMedicationSelect}
              index={index}
              isLoaded={isLoaded}
            />
          ))
        ) : (
          <MedicationEmptyState />
        )}
      </div>

      {/* Medication Detail Dialog */}
      <MedicationDetailDialog 
        selectedMedication={selectedMedication} 
        onOpenChange={handleDialogOpenChange} 
      />
    </section>
  );
};

export default MedicationTracker;
