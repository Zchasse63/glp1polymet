
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface MedicationHeaderProps {
  onAddClick: () => void;
}

export const MedicationHeader = ({ onAddClick }: MedicationHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Medications</h1>
      <Button 
        className="rounded-full" 
        onClick={onAddClick}
      >
        <PlusIcon className="h-5 w-5 mr-1" /> Add New
      </Button>
    </div>
  );
};
