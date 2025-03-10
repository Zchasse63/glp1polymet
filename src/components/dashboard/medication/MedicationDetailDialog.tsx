
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import MedicationDetailChart from "../MedicationDetailChart";
import { Medication } from "@/types/medication";
import MedicationIcon from "./MedicationIcon";

interface MedicationDetailDialogProps {
  selectedMedication: Medication | null;
  onOpenChange: (open: boolean) => void;
}

const MedicationDetailDialog = ({ 
  selectedMedication, 
  onOpenChange 
}: MedicationDetailDialogProps) => {
  return (
    <Dialog open={!!selectedMedication} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {selectedMedication && (
              <>
                <div className="w-10 h-10 mr-2">
                  <MedicationIcon 
                    medicationId={selectedMedication.id} 
                    color={selectedMedication.color}
                    size={5}
                  />
                </div>
                {selectedMedication.name}
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {selectedMedication && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Dose</span>
                <span className="font-medium">{selectedMedication.dose}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Frequency</span>
                <span className="font-medium">{selectedMedication.frequency}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Last Taken</span>
                <span className="font-medium">{selectedMedication.lastTaken}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Next Dose</span>
                <span className="font-medium">{selectedMedication.nextDose}</span>
              </div>
            </div>
            
            <MedicationDetailChart medication={selectedMedication} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicationDetailDialog;
