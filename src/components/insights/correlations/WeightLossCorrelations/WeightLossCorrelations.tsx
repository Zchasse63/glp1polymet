
import React, { useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Correlation } from "@/utils/insights/types";
import { useIntersectionObserver } from "@/utils/performanceUtils";
import useCorrelationDisplay from "./hooks/useCorrelationDisplay";
import CorrelationContent from "./CorrelationContent";

interface WeightLossCorrelationsProps {
  correlations: Correlation[] | undefined;
  isLoading: boolean;
  error: Error | null;
  insight: string | null;
  onRetry?: () => void;
}

// Use React.memo to prevent unnecessary re-renders
const WeightLossCorrelations: React.FC<WeightLossCorrelationsProps> = React.memo(({
  correlations,
  isLoading,
  error,
  insight,
  onRetry
}) => {
  // Use a ref to track when the component is visible
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, { threshold: 0.1 });
  
  // Use custom hook for correlation display logic
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
    <Card ref={cardRef} className="shadow-md card-hover">
      <CardHeader>
        <CardTitle className="text-xl">Weight Loss Correlations</CardTitle>
        <CardDescription>
          See which factors have the strongest relationship with your weight loss
        </CardDescription>
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

// Add display name for debugging
WeightLossCorrelations.displayName = "WeightLossCorrelations";

export default WeightLossCorrelations;
