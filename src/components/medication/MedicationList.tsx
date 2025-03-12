
import React from "react";
import { Medication } from "@/types/medication";
import { PillIcon, Clock9Icon, AlertCircleIcon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface MedicationListProps {
  medications: Medication[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const MedicationList = ({ medications, onDelete, onAdd }: MedicationListProps) => {
  // Get level percentage for progress bar
  const getLevelPercentage = (level: string | number, totalDose?: number) => {
    const numericLevel = typeof level === 'string' ? parseFloat(level) : level;
    if (!totalDose) return numericLevel;
    return (numericLevel / totalDose) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {medications.length > 0 ? (
          medications.map((medication, index) => (
            <Card 
              key={medication.id} 
              className={cn(
                "w-full overflow-hidden card-hover cursor-pointer transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
                "opacity-0 animate-scale-in opacity-100"
              )}
              style={{ 
                animationDelay: `${index * 0.05}s`,
                animationFillMode: "forwards"
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold text-foreground">
                      {medication.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {medication.dose} • {medication.frequency}
                    </p>
                  </div>

                  <div className="flex-1 mx-6 max-w-xs">
                    <Progress
                      value={getLevelPercentage(medication.level, medication.totalDose)}
                      className="h-2 mb-1 rounded-full"
                      style={
                        {
                          backgroundColor: `${medication.color}20`,
                          "--progress-background": medication.color,
                        } as React.CSSProperties
                      }
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">
                        {medication.level} {medication.totalDose || 100}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center text-sm mr-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: `${medication.color}20` }}
                      >
                        <Clock9Icon className="h-4 w-4" style={{ color: medication.color }} />
                      </div>
                      <span className="font-medium">Next: {medication.nextDose}</span>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer flex items-center">
                          <EditIcon className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="cursor-pointer text-destructive focus:text-destructive flex items-center"
                          onClick={() => onDelete(medication.id)}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8">
            <PillIcon className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No medications found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first medication to start tracking
            </p>
            <Button onClick={onAdd} className="mt-4">
              Add Medication
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationList;
