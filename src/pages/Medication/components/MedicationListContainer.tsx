
import React from "react";
import { Medication } from "@/types/medication";
import { Spinner } from "@/components/ui/spinner";
import MedicationList from "@/components/medication/MedicationList";

interface MedicationListContainerProps {
  medications: Medication[];
  isLoading: boolean;
  error: Error | null;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onRetry: () => void;
}

export const MedicationListContainer: React.FC<MedicationListContainerProps> = ({
  medications,
  isLoading,
  error,
  onDelete,
  onAdd,
  onRetry
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-center">
          <Spinner size="lg" className="mb-4" />
          <p className="text-muted-foreground">Loading medications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 bg-destructive/10 rounded-lg p-6 animate-fade-in">
        <p className="text-destructive font-medium mb-2">Error loading medications</p>
        <p className="text-muted-foreground mb-4">There was a problem loading your medications. Please try again.</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg p-6 border border-dashed animate-fade-in">
        <p className="text-foreground font-medium mb-2">No medications found</p>
        <p className="text-muted-foreground mb-4">Add your first medication to start tracking</p>
        <button 
          onClick={onAdd}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          Add Medication
        </button>
      </div>
    );
  }

  return (
    <MedicationList 
      medications={medications} 
      onDelete={onDelete} 
      onAdd={onAdd} 
    />
  );
};
