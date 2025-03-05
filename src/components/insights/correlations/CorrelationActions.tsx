
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CorrelationActionsProps {
  showAllFactors: boolean;
  toggleFactorDisplay: () => void;
  handleExportData: () => void;
  hasExportData: boolean;
  hasMoreItems: boolean;
}

/**
 * Component for correlation chart action buttons
 */
const CorrelationActions: React.FC<CorrelationActionsProps> = ({
  showAllFactors,
  toggleFactorDisplay,
  handleExportData,
  hasExportData,
  hasMoreItems,
}) => {
  return (
    <div className="flex justify-between items-center">
      {hasMoreItems && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleFactorDisplay}
          className="text-xs h-8"
        >
          {showAllFactors ? "Show top factors only" : "Show all factors"}
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8 ml-auto"
        onClick={handleExportData}
        disabled={!hasExportData}
      >
        <Download className="h-3 w-3 mr-1" />
        Export data
      </Button>
    </div>
  );
};

export default CorrelationActions;
