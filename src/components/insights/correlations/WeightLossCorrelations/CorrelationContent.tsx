
import React from "react";
import { cn } from "@/lib/utils";
import { Correlation } from "@/utils/insights/types";
import { CorrelationBarChart } from "../../../charts/correlation";
import CorrelationLoadingState from "../../CorrelationLoadingState";
import CorrelationErrorState from "../../CorrelationErrorState";
import { getErrorSeverity } from "../ErrorSeverityUtils";
import CorrelationInsight from "../CorrelationInsight";
import CorrelationLegend from "../CorrelationLegend";
import CorrelationActions from "../CorrelationActions";
import NoSignificantCorrelations from "../NoSignificantCorrelations";
import NoCorrelationsState from "../NoCorrelationsState";

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
  if (isLoading) {
    return <CorrelationLoadingState />;
  }

  if (error) {
    return (
      <CorrelationErrorState 
        error={error}
        onRetry={handleRetry}
        severity={getErrorSeverity(error)}
      />
    );
  }

  if (!correlations || correlations.length === 0) {
    return <NoCorrelationsState />;
  }

  return (
    <div>
      <CorrelationInsight insight={insight} />
      
      <div className={cn(
        "h-[300px]", 
        !hasSignificantCorrelations && "opacity-80"
      )}>
        <CorrelationBarChart data={displayedCorrelations} />
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
