
import React from "react";
import { MedicationCard } from "@/components/MedicationCard";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { Medication } from "@/pages/MedicationPage";

interface MedicationListProps {
  medications: Medication[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const MedicationList = ({ medications, onDelete, onAdd }: MedicationListProps) => {
  return (
    <>
      {medications.length > 0 ? (
        <div className="space-y-3">
          {medications.map((medication) => (
            <div key={medication.id} className="relative group">
              <MedicationCard medication={medication} />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                onClick={() => onDelete(medication.id)}
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
            onClick={onAdd}
          >
            Add Your First Medication
          </Button>
        </div>
      )}
    </>
  );
};

export default MedicationList;
