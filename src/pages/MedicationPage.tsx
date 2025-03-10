import React, { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AddMedicationForm } from "@/components/AddMedicationForm";
import MedicationHeader from "@/components/medication/MedicationHeader";
import MedicationList from "@/components/medication/MedicationList";
import MedicationEffectivenessChart from "@/components/medication/MedicationEffectivenessChart";
import { useMedications } from "@/hooks/useMedications";
import { Spinner } from "@/components/ui/spinner";
import { ErrorLogger } from "@/utils/errorHandling";
import { Medication } from "@/types/medication"; 
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const generateRandomColor = () => {
  const colors = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const MedicationPage = () => {
  const [currentPage, setCurrentPage] = useState("medication");
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    medications, 
    isLoading, 
    error, 
    addMedication, 
    deleteMedication,
    refetch 
  } = useMedications();

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

  const handleAddMedication = useCallback(async (data: { name: string; dose: string; frequency: string; unit?: string; totalDose?: number }) => {
    try {
      const newMedication: Omit<Medication, 'id'> = {
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
  }, [addMedication, toast]);

  const handleDeleteMedication = useCallback(async (id: string) => {
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
  }, [deleteMedication, medications, toast]);

  const handleRetry = useCallback(() => {
    refetch();
    toast({
      title: "Retrying",
      description: "Attempting to reload medications.",
    });
  }, [refetch, toast]);

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-5 animate-fade-in">
        <MedicationHeader onAddClick={() => setIsAddingMedication(true)} />
        
        {!user && !isLoading && (
          <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-600 dark:text-blue-400">Demo Mode</AlertTitle>
            <AlertDescription className="text-blue-600/80 dark:text-blue-400/80">
              You're viewing demo medications. Sign in to manage your own medications.
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Spinner size="lg" className="mb-4" />
              <p className="text-muted-foreground">Loading medications...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-10 bg-destructive/10 rounded-lg p-6 animate-fade-in">
            <p className="text-destructive font-medium mb-2">Error loading medications</p>
            <p className="text-muted-foreground mb-4">There was a problem loading your medications. Please try again.</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : medications.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg p-6 border border-dashed animate-fade-in">
            <p className="text-foreground font-medium mb-2">No medications found</p>
            <p className="text-muted-foreground mb-4">Add your first medication to start tracking</p>
            <button 
              onClick={() => setIsAddingMedication(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Add Medication
            </button>
          </div>
        ) : (
          <MedicationList 
            medications={medications} 
            onDelete={handleDeleteMedication} 
            onAdd={() => setIsAddingMedication(true)} 
          />
        )}
        
        {!isLoading && !error && medications.length > 0 && (
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <MedicationEffectivenessChart trendData={trendData} />
          </div>
        )}

        <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Medication</DialogTitle>
              <DialogDescription>
                Enter the details of your medication below.
              </DialogDescription>
            </DialogHeader>
            <AddMedicationForm 
              onSubmit={handleAddMedication} 
              onCancel={() => setIsAddingMedication(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MedicationPage;
