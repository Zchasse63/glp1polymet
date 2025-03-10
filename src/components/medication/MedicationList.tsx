
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

interface MedicationListProps {
  medications: Medication[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const MedicationList = ({ medications, onDelete, onAdd }: MedicationListProps) => {
  // Get level percentage for progress bar
  const getLevelPercentage = (level: number, totalDose?: number) => {
    if (!totalDose) return level;
    return (level / totalDose) * 100;
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <Card key={medication.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: medication.color }}>
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${medication.color}15` }}
                      >
                        <PillIcon className="h-5 w-5" style={{ color: medication.color }} />
                      </div>
                      <div>
                        <h3 className="font-medium">{medication.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {medication.dose} • {medication.frequency}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
                      <DropdownMenuContent align="end">
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

                <Progress
                  value={getLevelPercentage(medication.level, medication.totalDose)}
                  className="h-1.5 rounded-none"
                  style={{
                    backgroundColor: `${medication.color}20`,
                    "--progress-background": medication.color,
                  } as React.CSSProperties}
                />

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock9Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Last Taken</p>
                      <p className="font-medium">{medication.lastTaken}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <AlertCircleIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground">Next Dose</p>
                      <p className="font-medium">{medication.nextDose}</p>
                    </div>
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
