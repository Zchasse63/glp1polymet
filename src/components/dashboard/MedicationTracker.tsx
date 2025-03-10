
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRightIcon, PillIcon, ClockIcon, BarChart2Icon, HeartPulseIcon, BrainIcon, ActivityIcon, TabletIcon } from "lucide-react";
import { useMedicationPreferences } from "@/hooks/useMedicationPreferences";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MedicationDetailChart from "./MedicationDetailChart";

type Medication = {
  id: string;
  name: string;
  dose: string;
  frequency: string;
  lastTaken: string;
  nextDose: string;
  level: string;
  totalAmount: string;
  color: string;
};

type MedicationTrackerProps = {
  medications: Medication[];
  isLoaded: boolean;
  onViewAll: () => void;
};

export const MedicationTracker = ({ medications, isLoaded, onViewAll }: MedicationTrackerProps) => {
  // Animation delay utility
  const getAnimationDelay = (index: number) => `${index * 0.05}s`;
  
  // Get selected medications
  const { selectedMedications } = useMedicationPreferences();
  
  // Filter medications based on preferences
  const filteredMedications = medications.filter(medication => 
    selectedMedications.includes(medication.id)
  );
  
  // State for tracking which medication details to show
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  // Function to generate a gradient background based on medication color
  const generateGradientStyle = (color: string) => {
    return {
      background: `linear-gradient(135deg, ${color}30, ${color}60)`,
      borderRadius: '50%',
      padding: '12px',
      boxShadow: `0 4px 10px ${color}40`,
    };
  };

  // Function to generate pill icon style
  const generatePillStyle = (color: string) => {
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
    <section 
      className={`space-y-3 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
      style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
    >
      <div className="flex justify-between items-center mb-1">
        <h2 className="text-xl font-semibold">
          Medication Tracker
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary flex items-center hover:bg-primary/5"
          onClick={onViewAll}
        >
          View all <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="flex flex-col space-y-3">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med, index) => (
            <Card
              key={med.id}
              className={`w-full overflow-hidden border-0 shadow-md opacity-0 cursor-pointer ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
              style={{ 
                background: `linear-gradient(to right, ${med.color}15, transparent)`,
                borderRadius: '12px',
                animationDelay: getAnimationDelay(index),
                animationFillMode: "forwards"
              }}
              onClick={() => setSelectedMedication(med)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 flex items-center justify-center mr-4"
                      style={generateGradientStyle(med.color)}
                    >
                      {React.cloneElement(getMedicationIcon(med.id), {
                        style: generatePillStyle(med.color)
                      })}
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {med.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {med.dose} • {med.frequency}
                      </p>
                    </div>
                  </div>

                  <div className="flex-1 mx-6 max-w-xs">
                    <Progress
                      value={(parseFloat(med.level) / parseFloat(med.totalAmount)) * 100}
                      className="h-2 mb-1 rounded-full"
                      style={
                        {
                          backgroundColor: `${med.color}20`,
                          "--progress-background": med.color,
                        } as React.CSSProperties
                      }
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {med.level} / {med.totalAmount}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-sm">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: `${med.color}20` }}
                    >
                      <ClockIcon className="h-4 w-4" style={{ color: med.color }} />
                    </div>
                    <span className="font-medium">Next: {med.nextDose}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground p-6 bg-muted/50 rounded-lg">
            No medications selected for dashboard. Configure in App Settings.
          </div>
        )}
      </div>

      {/* Medication Detail Dialog */}
      <Dialog open={!!selectedMedication} onOpenChange={(open) => !open && setSelectedMedication(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <div
                className="w-10 h-10 flex items-center justify-center mr-2"
                style={selectedMedication ? generateGradientStyle(selectedMedication.color) : {}}
              >
                {selectedMedication && React.cloneElement(getMedicationIcon(selectedMedication.id), {
                  style: generatePillStyle(selectedMedication.color)
                })}
              </div>
              {selectedMedication?.name}
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
    </section>
  );
};

export default MedicationTracker;
