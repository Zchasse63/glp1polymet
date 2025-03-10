
import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useMedications } from "@/hooks/useMedications";
import { ErrorLogger } from "@/utils/errorHandling";
import { Medication } from "@/types/medication";
import { MedicationHeader } from "./MedicationHeader";
import { MedicationListContainer } from "./MedicationListContainer";
import { MedicationEffectivenessChart } from "./MedicationEffectivenessChart";
import { AddMedicationDialog } from "./AddMedicationDialog";

// Random color generator for new medications
const generateRandomColor = () => {
  const colors = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const MedicationPageContent = () => {
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const { toast } = useToast();
  const { 
    medications, 
    isLoading, 
    error, 
    addMedication, 
    deleteMedication,
    refetch 
  } = useMedications();

  // Fetch medications on mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Log any errors to our centralized error logger
  useEffect(() => {
    if (error) {
      ErrorLogger.error(
        'Error loading medications', 
        'MEDICATION_PAGE_ERROR',
        { page: 'MedicationPage' },
        error
      );
    }
  }, [error]);

  const handleAddMedication = async (data: { name: string; dose: string; frequency: string; unit?: string; totalDose?: number }) => {
    try {
      const newMedication = {
        name: data.name,
        dose: data.dose,
        frequency: data.frequency,
        lastTaken: "Not taken yet",
        nextDose: "Take now",
        level: 100,
        totalDose: data.totalDose || parseInt(data.dose) || 100,
        unit: data.unit || (data.dose.includes("mg") ? "mg" : "units"),
        color: generateRandomColor(),
      };

      await addMedication(newMedication);
      setIsAddingMedication(false);
      
      toast({
        title: "Success",
        description: `${data.name} has been added to your medications.`,
      });
    } catch (error) {
      console.error("Error adding medication:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add medication. Please try again.",
      });
    }
  };

  const handleDeleteMedication = async (id: string) => {
    try {
      const medicationToDelete = medications.find(med => med.id === id);
      await deleteMedication(id);
      
      toast({
        title: "Medication removed",
        description: `${medicationToDelete?.name || 'Medication'} has been removed.`,
      });
    } catch (error) {
      console.error("Error deleting medication:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove medication. Please try again.",
      });
    }
  };

  // Sample trend data for medication effectiveness chart
  const trendData = [
    { date: "Week 1", weight: 210, medication: 80 },
    { date: "Week 2", weight: 208, medication: 85 },
    { date: "Week 3", weight: 207, medication: 90 },
    { date: "Week 4", weight: 205, medication: 85 },
    { date: "Week 5", weight: 203, medication: 90 },
    { date: "Week 6", weight: 200, medication: 95 },
    { date: "Week 7", weight: 198, medication: 90 },
    { date: "Week 8", weight: 195, medication: 95 },
  ];

  return (
    <div className="p-5 space-y-5 animate-fade-in">
      <MedicationHeader onAddClick={() => setIsAddingMedication(true)} />
      
      <MedicationListContainer 
        medications={medications}
        isLoading={isLoading}
        error={error}
        onDelete={handleDeleteMedication}
        onAdd={() => setIsAddingMedication(true)}
        onRetry={refetch}
      />
      
      {!isLoading && !error && medications.length > 0 && (
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <MedicationEffectivenessChart trendData={trendData} />
        </div>
      )}

      <AddMedicationDialog
        open={isAddingMedication}
        onOpenChange={setIsAddingMedication}
        onSubmit={handleAddMedication}
      />
    </div>
  );
};
