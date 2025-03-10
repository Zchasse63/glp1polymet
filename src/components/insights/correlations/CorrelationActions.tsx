
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from '@/lib/utils';
import { AccessibleIcon } from '@/utils/accessibility/AccessibleIcon';

interface CorrelationActionsProps {
  showAllFactors: boolean;
  toggleFactorDisplay: () => void;
  handleExportData: () => void;
  hasExportData: boolean;
  hasMoreItems: boolean;
}

/**
 * Component for correlation chart action buttons
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear, accessible actions
 * - Holistic Development: Consistent with application-wide patterns
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
          className={cn(
            "text-xs h-8 transition-colors",
            "hover:bg-secondary hover:text-secondary-foreground"
          )}
        >
          <AccessibleIcon
            icon={showAllFactors ? <ChevronUp className="h-3.5 w-3.5 mr-1.5" /> : <ChevronDown className="h-3.5 w-3.5 mr-1.5" />}
            label={showAllFactors ? "Show fewer factors" : "Show more factors"}
            role="presentation"
          />
          {showAllFactors ? "Show top factors only" : "Show all factors"}
        </Button>
      )}
      
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "text-xs h-8 ml-auto transition-all",
          "hover:bg-primary/10 dark:hover:bg-primary/20",
          !hasExportData && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleExportData}
        disabled={!hasExportData}
      >
        <AccessibleIcon
          icon={<Download className="h-3.5 w-3.5 mr-1.5" />}
          label="Export correlation data"
          role="presentation"
        />
        Export data
      </Button>
    </div>
  );
};

export default CorrelationActions;
