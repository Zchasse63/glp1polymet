
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRightIcon, PillIcon, CalendarIcon, ClockIcon } from "lucide-react";

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

  return (
    <section 
      className={`space-y-5 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
      style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
    >
      <div className="flex justify-between items-center">
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

      <div className="grid gap-5">
        {medications.map((med, index) => (
          <Card
            key={med.id}
            className={`overflow-hidden border-l-4 card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ 
              borderLeftColor: med.color, 
              animationDelay: getAnimationDelay(index),
              animationFillMode: "forwards"
            }}
          >
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                    style={{ backgroundColor: `${med.color}15` }}
                  >
                    <PillIcon
                      className="h-6 w-6"
                      style={{ color: med.color }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {med.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {med.dose} • {med.frequency}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">
                    {med.level}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Remaining amount
                  </p>
                </div>
              </div>

              <Progress
                value={(parseFloat(med.level) / parseFloat(med.totalAmount)) * 100}
                className="h-2 mb-4"
                style={
                  {
                    backgroundColor: `${med.color}20`,
                    "--progress-background": med.color,
                  } as React.CSSProperties
                }
              />

              <div className="flex justify-between text-sm">
                <div className="flex items-center text-muted-foreground">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Last taken: {med.lastTaken}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Next dose: {med.nextDose}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default MedicationTracker;
