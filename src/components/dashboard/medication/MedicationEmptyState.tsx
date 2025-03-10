
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface MedicationEmptyStateProps {
  message?: string;
}

const MedicationEmptyState = ({ 
  message = "No medications selected for dashboard. Configure in App Settings." 
}: MedicationEmptyStateProps) => {
  return (
    <Card className="bg-muted/30">
      <CardContent className="flex flex-col items-center justify-center py-10 px-6 text-center">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
};

export default MedicationEmptyState;
