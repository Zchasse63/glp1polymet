
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

/**
 * CorrelationContent Component
 * 
 * Displays correlation data with appropriate loading, error, and empty states.
 * Following CodeFarm principles:
 * - Error Handling: Comprehensive error states
 * - Accessibility: Screen reader announcements
 * - User-Centric Design: Meaningful empty states
 */
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
  
  // Announce errors to screen readers
  React.useEffect(() => {
    if (error && !errorAnnounced) {
      setErrorAnnounced(true);
      // Track unhandled errors
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

  // Prepare screen reader message for correlations
  const getScreenReaderMessage = () => {
    if (!hasSignificantCorrelations) {
      return "No significant correlations were found in your data.";
    }
    
    const topCorrelation = sortedCorrelations[0];
    return `Found ${sortedCorrelations.length} correlations. The strongest correlation is ${topCorrelation.factor} with a correlation value of ${topCorrelation.correlation.toFixed(2)}.`;
  };

  return (
    <div>
      <ScreenReaderAnnouncement message={getScreenReaderMessage()} />
      
      <CorrelationInsight insight={insight} />
      
      <div className={cn(
        "h-[300px]", 
        !hasSignificantCorrelations && "opacity-80"
      )}>
        <CorrelationBarChart 
          data={displayedCorrelations} 
        />
      </div>
      
      {!hasSignificantCorrelations && <NoSignificantCorrelations />}
      
      <div className="mt-4 flex flex-col space-y-2">
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
