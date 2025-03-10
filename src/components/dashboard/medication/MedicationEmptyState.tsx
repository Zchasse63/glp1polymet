
import React from "react";

interface MedicationEmptyStateProps {
  message?: string;
}

const MedicationEmptyState = ({ 
  message = "No medications selected for dashboard. Configure in App Settings." 
}: MedicationEmptyStateProps) => {
  return (
    <div className="text-center text-muted-foreground p-6 bg-muted/50 rounded-lg">
      {message}
    </div>
  );
};

export default MedicationEmptyState;
