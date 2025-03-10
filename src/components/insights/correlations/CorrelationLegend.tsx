
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AccessibleIcon } from '@/utils/accessibility/AccessibleIcon';

/**
 * Component for showing correlation legend and help tooltip
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear visual representation of correlation types
 * - Accessibility: Using AccessibleIcon for improved screen reader support
 */
const CorrelationLegend: React.FC = () => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground flex items-center space-x-3">
        <span className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[hsl(var(--chart-3))] mr-1.5 rounded-sm"></span>
          <span>Positive correlation</span>
        </span>
        <span className="flex items-center">
          <span className="inline-block w-3 h-3 bg-[hsl(var(--chart-4))] mr-1.5 rounded-sm"></span>
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
            >
              <AccessibleIcon 
                icon={<HelpCircle className="h-4 w-4" />}
                label="Learn about correlations"
                role="button"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs text-xs">
            <p>
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
