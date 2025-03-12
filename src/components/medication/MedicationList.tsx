
import React from "react";
import { Medication } from "@/types/medication";
import { PillIcon, Clock9Icon, EditIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";

interface MedicationListProps {
  medications: Medication[];
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const MedicationList = ({ medications, onAdd, onDelete }: MedicationListProps) => {
  const { getAnimationClass, getAnimationStyle } = useAnimationTransition();

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {medications.length > 0 ? (
          medications.map((medication, index) => (
            <Card 
              key={medication.id} 
              className={cn(
                "w-full overflow-hidden card-hover cursor-pointer transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
              )}
              style={getAnimationStyle(true, 'up', index)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col space-y-1">
                    <h3 className="text-base font-semibold text-foreground">
                      {medication.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {medication.dose} • {medication.frequency}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex items-center space-x-2 min-w-[120px] justify-end mr-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${medication.color}20` }}
                      >
                        <Clock9Icon className="h-4 w-4" style={{ color: medication.color }} />
                      </div>
                      <span className="font-medium whitespace-nowrap">Next: {medication.nextDose}</span>
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
                      <DropdownMenuContent align="end" className="w-40 animate-fade-scale">
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
          <div className="text-center py-8 animate-fade-scale">
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
