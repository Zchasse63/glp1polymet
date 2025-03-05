import React, { useMemo, useRef, useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Correlation } from "@/utils/insights/types";
import CorrelationBarChart from "./charts/CorrelationBarChart";
import CorrelationLoadingState from "./CorrelationLoadingState";
import CorrelationErrorState from "./CorrelationErrorState";
import { ErrorLogger } from "@/utils/errorHandling";
import { useIntersectionObserver } from "@/utils/performanceUtils";
import { cn } from "@/lib/utils";
import { getErrorSeverity } from "./correlations/ErrorSeverityUtils";
import CorrelationInsight from "./correlations/CorrelationInsight";
import CorrelationLegend from "./correlations/CorrelationLegend";
import CorrelationActions from "./correlations/CorrelationActions";
import NoSignificantCorrelations from "./correlations/NoSignificantCorrelations";
import NoCorrelationsState from "./correlations/NoCorrelationsState";

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
  
  // State for visualization options
  const [showAllFactors, setShowAllFactors] = useState(false);
  
  // Log errors to our centralized error logger
  React.useEffect(() => {
    if (error) {
      ErrorLogger.error(
        "Failed to load correlation data", 
        "CORRELATION_LOAD_ERROR",
        { 
          componentName: "WeightLossCorrelations",
          visible: isVisible,
          errorMessage: error.message 
        },
        error
      );
    }
  }, [error, isVisible]);
  
  // Memoized retry handler to avoid unnecessary re-renders
  const handleRetry = useCallback(() => {
    // Log retry attempt
    ErrorLogger.info(
      "User initiated correlation data retry", 
      "CORRELATION_RETRY",
      { componentName: "WeightLossCorrelations" }
    );
    
    if (onRetry) {
      onRetry();
    }
  }, [onRetry]);
  
  // Only compute sorted correlations when data changes
  const sortedCorrelations = useMemo(() => {
    if (!correlations) return [];
    
    // First sort by absolute value of correlation to get strongest factors first
    return [...correlations].sort((a, b) => 
      Math.abs(b.correlation) - Math.abs(a.correlation)
    );
  }, [correlations]);
  
  // Determine if we have enough significant correlations
  const hasSignificantCorrelations = useMemo(() => {
    return sortedCorrelations.some(item => Math.abs(item.correlation) > 0.3);
  }, [sortedCorrelations]);
  
  // Filter correlations based on user selection
  const displayedCorrelations = useMemo(() => {
    if (!isVisible || !sortedCorrelations.length) return [];
    
    // If showing all or we have few items, show everything
    if (showAllFactors || sortedCorrelations.length <= 5) {
      return sortedCorrelations;
    }
    
    // Otherwise show only the most significant ones (top 5)
    return sortedCorrelations.slice(0, 5);
  }, [sortedCorrelations, isVisible, showAllFactors]);

  // Function to toggle between showing all factors and just the top ones
  const toggleFactorDisplay = useCallback(() => {
    setShowAllFactors(prev => !prev);
  }, []);
  
  // Simulate exporting data (in a real app, this would generate a CSV or PDF)
  const handleExportData = useCallback(() => {
    if (!correlations || correlations.length === 0) return;
    
    // Log the export attempt
    ErrorLogger.info(
      "User exported correlation data", 
      "CORRELATION_EXPORT",
      { dataCount: correlations.length }
    );
    
    // Create a simple CSV string
    const headers = ["Factor", "Correlation Value"];
    const rows = sortedCorrelations.map(item => [
      item.factor,
      item.correlation.toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    // Create a blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'weight_loss_correlations.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [correlations, sortedCorrelations]);

  const renderContent = () => {
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

  return (
    <Card ref={cardRef} className="shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Weight Loss Correlations</CardTitle>
        <CardDescription>
          See which factors have the strongest relationship with your weight loss
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
});

// Add display name for debugging
WeightLossCorrelations.displayName = "WeightLossCorrelations";

export default WeightLossCorrelations;
