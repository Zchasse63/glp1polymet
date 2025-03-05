
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Component for showing correlation legend and help tooltip
 */
const CorrelationLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground flex items-center space-x-3">
        <span className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-600 mr-1 rounded-sm"></span>
          <span>Positive correlation</span>
        </span>
        <span className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-600 mr-1 rounded-sm"></span>
          <span>Negative correlation</span>
        </span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              aria-label="Learn about correlations"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="max-w-xs text-xs">
              Correlations show relationships between factors and your weight loss.
              Positive values (green) indicate factors that may help weight loss,
              while negative values (red) may hinder progress.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default CorrelationLegend;
