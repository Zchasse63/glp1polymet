
import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Correlation } from "@/utils/insights/types";
import { useIntersectionObserver } from "@/utils/performanceUtils";
import useCorrelationDisplay from "./hooks/useCorrelationDisplay";
import CorrelationContent from "./CorrelationContent";
import { AccessibleIcon } from "@/utils/accessibility/AccessibleIcon";
import { BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";

interface WeightLossCorrelationsProps {
  correlations: Correlation[] | undefined;
  isLoading: boolean;
  error: Error | null;
  insight: string | null;
  onRetry?: () => void;
}

const WeightLossCorrelations: React.FC<WeightLossCorrelationsProps> = React.memo(({
  correlations,
  isLoading,
  error,
  insight,
  onRetry
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });
  const { getAnimationClass, getLoadedStyle } = useAnimationTransition();
  
  const {
    sortedCorrelations,
    displayedCorrelations,
    hasSignificantCorrelations,
    showAllFactors,
    toggleFactorDisplay,
    handleExportData,
    handleRetry
  } = useCorrelationDisplay({
    correlations,
    onRetry,
    isVisible,
    error
  });

  return (
    <Card 
      ref={cardRef} 
      className={cn(
        "shadow-md transition-all duration-250 ease-out",
        "hover:shadow-lg border border-border/50",
        "dark:bg-card dark:border-border/20",
        getAnimationClass('fade-slide-up')
      )}
      style={getLoadedStyle(isVisible, 0)}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <AccessibleIcon
          icon={<BarChart2 className="h-6 w-6 text-primary" />}
          label="Weight Loss Correlations"
          role="presentation"
        />
        <div>
          <CardTitle className="text-xl font-semibold">
            Weight Loss Correlations
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            See which factors have the strongest relationship with your weight loss
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <CorrelationContent 
          isLoading={isLoading}
          error={error}
          correlations={correlations}
          displayedCorrelations={displayedCorrelations}
          sortedCorrelations={sortedCorrelations}
          hasSignificantCorrelations={hasSignificantCorrelations}
          showAllFactors={showAllFactors}
          insight={insight}
          handleRetry={handleRetry}
          toggleFactorDisplay={toggleFactorDisplay}
          handleExportData={handleExportData}
        />
      </CardContent>
    </Card>
  );
});

WeightLossCorrelations.displayName = "WeightLossCorrelations";

export default WeightLossCorrelations;
