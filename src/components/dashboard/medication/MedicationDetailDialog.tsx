
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import MedicationDetailChart from "../MedicationDetailChart";
import { Medication } from "@/types/medication";
import { PillIcon, HeartPulseIcon, BrainIcon, ActivityIcon, TabletIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";

interface MedicationDetailDialogProps {
  selectedMedication: Medication | null;
  onOpenChange: (open: boolean) => void;
}

const MedicationDetailDialog = ({ 
  selectedMedication, 
  onOpenChange 
}: MedicationDetailDialogProps) => {
  const { getAnimationClass } = useAnimationTransition();

  // Function to get appropriate icon based on medication ID
  const getMedicationIcon = (medicationId: string) => {
    // Use different icons based on the first character of medication ID for demo variation
    const firstChar = medicationId.charAt(0).toLowerCase();
    
    switch(true) {
      case firstChar <= 'd':
        return <PillIcon className="h-5 w-5" />;
      case firstChar <= 'h':
        return <HeartPulseIcon className="h-5 w-5" />;
      case firstChar <= 'l':
        return <BrainIcon className="h-5 w-5" />;
      case firstChar <= 'p':
        return <TabletIcon className="h-5 w-5" />;
      default:
        return <ActivityIcon className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={!!selectedMedication} onOpenChange={onOpenChange}>
      <DialogContent className="animate-scale-in sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            {selectedMedication && (
              <>
                <span 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: `${selectedMedication.color}20`,
                  }}
                >
                  {React.cloneElement(getMedicationIcon(selectedMedication.id), {
                    style: { color: selectedMedication.color }
                  })}
                </span>
                {selectedMedication.name}
              </>
            )}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        
        {selectedMedication && (
          <div className="space-y-4 p-1">
            <div className="grid grid-cols-2 gap-4 text-sm animate-fade-slide-up" style={{ animationDelay: '50ms' }}>
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
            
            <div className="animate-fade-slide-up" style={{ animationDelay: '100ms' }}>
              <MedicationDetailChart medication={selectedMedication} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MedicationDetailDialog;
