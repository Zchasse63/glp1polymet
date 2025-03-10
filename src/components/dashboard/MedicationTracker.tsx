
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRightIcon, PillIcon, CalendarIcon, ClockIcon, BarChart2Icon } from "lucide-react";
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

      <div className="grid grid-cols-2 gap-3">
        {filteredMedications.length > 0 ? (
          filteredMedications.map((med, index) => (
            <Card
              key={med.id}
              className={`overflow-hidden border-l-2 card-hover opacity-0 cursor-pointer ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
              style={{ 
                borderLeftColor: med.color, 
                animationDelay: getAnimationDelay(index),
                animationFillMode: "forwards"
              }}
              onClick={() => setSelectedMedication(med)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                      style={{ backgroundColor: `${med.color}15` }}
                    >
                      <PillIcon
                        className="h-4 w-4"
                        style={{ color: med.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">
                        {med.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {med.dose}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {med.level}
                    </div>
                  </div>
                </div>

                <Progress
                  value={(parseFloat(med.level) / parseFloat(med.totalAmount)) * 100}
                  className="h-1.5 mb-2"
                  style={
                    {
                      backgroundColor: `${med.color}20`,
                      "--progress-background": med.color,
                    } as React.CSSProperties
                  }
                />

                <div className="flex justify-between text-xs">
                  <div className="flex items-center text-muted-foreground">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Next: {med.nextDose}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <BarChart2Icon className="h-3 w-3 mr-1" />
                    <span>Details</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center col-span-2 text-muted-foreground p-4">
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
                className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: selectedMedication ? `${selectedMedication.color}15` : '' }}
              >
                <PillIcon
                  className="h-4 w-4"
                  style={{ color: selectedMedication?.color }}
                />
              </div>
              {selectedMedication?.name} Details
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
