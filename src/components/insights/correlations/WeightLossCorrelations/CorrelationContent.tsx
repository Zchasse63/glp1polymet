
import React from "react";
import { cn } from "@/lib/utils";
import { Correlation } from "@/utils/insights/types";
import { CorrelationBarChart } from "@/components/insights/charts/correlation";
import CorrelationLoadingState from "../../CorrelationLoadingState";
import CorrelationErrorState from "../../CorrelationErrorState";
import { getErrorSeverity } from "../ErrorSeverityUtils";
import CorrelationInsight from "../CorrelationInsight";
import CorrelationLegend from "../CorrelationLegend";
import CorrelationActions from "../CorrelationActions";
import NoSignificantCorrelations from "../NoSignificantCorrelations";
import NoCorrelationsState from "../NoCorrelationsState";
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";
import { ScreenReaderAnnouncement } from "@/utils/accessibility/ScreenReaderAnnouncement";
import { trackError } from "@/utils/eventTracking";

interface CorrelationContentProps {
  isLoading: boolean;
  error: Error | null;
  correlations: Correlation[] | undefined;
  displayedCorrelations: Correlation[];
  sortedCorrelations: Correlation[];
  hasSignificantCorrelations: boolean;
  showAllFactors: boolean;
  insight: string | null;
  handleRetry: () => void;
  toggleFactorDisplay: () => void;
  handleExportData: () => void;
}

const CorrelationContent: React.FC<CorrelationContentProps> = ({
  isLoading,
  error,
  correlations,
  displayedCorrelations,
  sortedCorrelations,
  hasSignificantCorrelations,
  showAllFactors,
  insight,
  handleRetry,
  toggleFactorDisplay,
  handleExportData
}) => {
  const isReducedMotion = useReducedMotion();
  const [errorAnnounced, setErrorAnnounced] = React.useState(false);
  
  React.useEffect(() => {
    if (error && !errorAnnounced) {
      setErrorAnnounced(true);
      trackError(error, { component: "CorrelationContent" });
    } else if (!error) {
      setErrorAnnounced(false);
    }
  }, [error, errorAnnounced]);

  if (isLoading) {
    return (
      <>
        <ScreenReaderAnnouncement message="Loading correlation data" />
        <CorrelationLoadingState />
      </>
    );
  }

  if (error) {
    return (
      <>
        <ScreenReaderAnnouncement 
          message={`Error loading correlations: ${error.message}`} 
          assertive={true}
        />
        <CorrelationErrorState 
          error={error}
          onRetry={handleRetry}
          severity={getErrorSeverity(error)}
        />
      </>
    );
  }

  if (!correlations || correlations.length === 0) {
    return (
      <>
        <ScreenReaderAnnouncement message="No correlation data available" />
        <NoCorrelationsState />
      </>
    );
  }

  return (
    <div className={cn(
      "space-y-6 transition-all duration-300",
      !isReducedMotion && "animate-fade-in"
    )}>
      <ScreenReaderAnnouncement 
        message={hasSignificantCorrelations 
          ? `Found ${sortedCorrelations.length} correlations. The strongest correlation is ${sortedCorrelations[0].factor} with a correlation value of ${sortedCorrelations[0].correlation.toFixed(2)}.`
          : "No significant correlations were found in your data."
        } 
      />
      
      <CorrelationInsight insight={insight} />
      
      <div className={cn(
        "h-[300px] transition-opacity duration-300",
        !hasSignificantCorrelations && "opacity-80"
      )}>
        <CorrelationBarChart 
          data={displayedCorrelations} 
          animate={!isReducedMotion}
        />
      </div>
      
      {!hasSignificantCorrelations && <NoSignificantCorrelations />}
      
      <div className="mt-4 space-y-4">
        <CorrelationLegend />
        
        <CorrelationActions 
          showAllFactors={showAllFactors}
          toggleFactorDisplay={toggleFactorDisplay}
          handleExportData={handleExportData}
          hasExportData={Boolean(correlations && correlations.length > 0)}
          hasMoreItems={sortedCorrelations.length > 5}
        />
      </div>
    </div>
  );
};

export default CorrelationContent;
