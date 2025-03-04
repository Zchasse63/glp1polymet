
import React, { useState } from "react";
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

// Define the medication type
export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  lastTaken: string;
  nextDose: string;
  level: number;
  totalDose?: number;
  unit?: string;
  color: string;
}

const generateRandomColor = () => {
  const colors = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const MedicationPage = () => {
  const [currentPage, setCurrentPage] = useState("medication");
  const [isAddingMedication, setIsAddingMedication] = useState(false);
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: "med1",
      name: "Ozempic",
      dose: "0.5mg",
      frequency: "Once weekly",
      lastTaken: "Today",
      nextDose: "In 7 days",
      level: 95,
      totalDose: 0.5,
      unit: "mg",
      color: "#4f46e5",
    },
    {
      id: "med2",
      name: "Metformin",
      dose: "500mg",
      frequency: "Twice daily",
      lastTaken: "4 hours ago",
      nextDose: "In 8 hours",
      level: 80,
      totalDose: 500,
      unit: "mg",
      color: "#0ea5e9",
    },
    {
      id: "med3",
      name: "Vitamin D",
      dose: "2000 IU",
      frequency: "Once daily",
      lastTaken: "Yesterday",
      nextDose: "Today",
      level: 60,
      totalDose: 2000,
      unit: "IU",
      color: "#f59e0b",
    },
  ]);
  const { toast } = useToast();

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

  const handleAddMedication = (data: { name: string; dose: string; frequency: string; unit?: string; totalDose?: number }) => {
    try {
      const newMedication: Medication = {
        id: `med${medications.length + 1}`,
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

      setMedications([...medications, newMedication]);
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

  const handleDeleteMedication = (id: string) => {
    try {
      const medicationToDelete = medications.find(med => med.id === id);
      setMedications(medications.filter(med => med.id !== id));
      
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

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <div className="p-5 space-y-5">
        <MedicationHeader onAddClick={() => setIsAddingMedication(true)} />
        
        <MedicationList 
          medications={medications} 
          onDelete={handleDeleteMedication} 
          onAdd={() => setIsAddingMedication(true)} 
        />
        
        <MedicationEffectivenessChart trendData={trendData} />

        <Dialog open={isAddingMedication} onOpenChange={setIsAddingMedication}>
          <DialogContent>
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
