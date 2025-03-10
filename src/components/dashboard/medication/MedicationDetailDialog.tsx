
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import MedicationDetailChart from "../MedicationDetailChart";
import { Medication } from "@/types/medication";
import { PillIcon, HeartPulseIcon, BrainIcon, ActivityIcon, TabletIcon } from "lucide-react";

interface MedicationDetailDialogProps {
  selectedMedication: Medication | null;
  onOpenChange: (open: boolean) => void;
}

const MedicationDetailDialog = ({ 
  selectedMedication, 
  onOpenChange 
}: MedicationDetailDialogProps) => {
  // Function to generate a gradient background based on medication color
  const generateGradientStyle = (color: string) => {
    return {
      background: `linear-gradient(135deg, ${color}30, ${color}60)`,
      borderRadius: '50%',
      padding: '12px',
      boxShadow: `0 4px 10px ${color}40`,
    };
  };

  // Function to generate icon style
  const generateIconStyle = (color: string) => {
    return {
      color: color,
      filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))',
    };
  };

  // Function to get appropriate icon based on medication ID
  const getMedicationIcon = (medicationId: string) => {
    // Use different icons based on the first character of medication ID for demo variation
    const firstChar = medicationId.charAt(0).toLowerCase();
    
    switch(true) {
      case firstChar <= 'd':
        return <PillIcon className="h-5 w-5 transition-all animate-pulse-subtle" />;
      case firstChar <= 'h':
        return <HeartPulseIcon className="h-5 w-5 transition-all animate-pulse-subtle" />;
      case firstChar <= 'l':
        return <BrainIcon className="h-5 w-5 transition-all animate-pulse-subtle" />;
      case firstChar <= 'p':
        return <TabletIcon className="h-5 w-5 transition-all animate-pulse-subtle" />;
      default:
        return <ActivityIcon className="h-5 w-5 transition-all animate-pulse-subtle" />;
    }
  };

  return (
    <Dialog open={!!selectedMedication} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {selectedMedication && (
              <>
                <div 
                  className="w-10 h-10 mr-2 flex items-center justify-center"
                  style={generateGradientStyle(selectedMedication.color)}
                >
                  {React.cloneElement(getMedicationIcon(selectedMedication.id), {
                    style: generateIconStyle(selectedMedication.color)
                  })}
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
