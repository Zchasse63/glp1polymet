
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { MedicationCard } from "@/components/MedicationCard";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { AddMedicationForm } from "@/components/AddMedicationForm";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

// Define the medication type
export interface Medication {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  lastTaken: string;
  nextDose: string;
  level: number;
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
      color: "#f59e0b",
    },
  ]);
  const { toast } = useToast();

  const handleAddMedication = (data: { name: string; dose: string; frequency: string }) => {
    try {
      const newMedication: Medication = {
        id: `med${medications.length + 1}`,
        name: data.name,
        dose: data.dose,
        frequency: data.frequency,
        lastTaken: "Not taken yet",
        nextDose: "Take now",
        level: 100,
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
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Medications</h1>
          <Button 
            className="rounded-full" 
            onClick={() => setIsAddingMedication(true)}
          >
            <PlusIcon className="h-5 w-5 mr-1" /> Add New
          </Button>
        </div>

        {medications.length > 0 ? (
          <div className="space-y-3">
            {medications.map((medication) => (
              <div key={medication.id} className="relative">
                <MedicationCard medication={medication} />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 hover:bg-white"
                  onClick={() => handleDeleteMedication(medication.id)}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">No medications added yet.</p>
            <Button 
              className="mt-4" 
              onClick={() => setIsAddingMedication(true)}
            >
              Add Your First Medication
            </Button>
          </div>
        )}

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
