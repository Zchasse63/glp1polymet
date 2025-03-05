
import React, { useMemo, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Correlation } from "@/utils/insights/types";
import CorrelationBarChart from "./charts/CorrelationBarChart";
import CorrelationLoadingState from "./CorrelationLoadingState";
import CorrelationErrorState from "./CorrelationErrorState";
import { ErrorLogger, ErrorSeverity } from "@/utils/errorHandling";
import { useIntersectionObserver } from "@/utils/performanceUtils";

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
  
  // Determine error severity based on error message
  const getErrorSeverity = useCallback((err: Error | null): ErrorSeverity => {
    if (!err) return ErrorSeverity.ERROR;
    
    const message = err.message.toLowerCase();
    
    if (message.includes('network') || message.includes('connection')) {
      return ErrorSeverity.WARNING;
    }
    
    if (message.includes('timeout')) {
      return ErrorSeverity.WARNING;
    }
    
    if (message.includes('permission') || message.includes('forbidden') || message.includes('unauthorized')) {
      return ErrorSeverity.CRITICAL;
    }
    
    return ErrorSeverity.ERROR;
  }, []);
  
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
  
  // Only prepare chart data when component is visible and data exists
  const chartData = useMemo(() => {
    if (!isVisible || !sortedCorrelations.length) return [];
    return sortedCorrelations;
  }, [sortedCorrelations, isVisible]);

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
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Not enough data to analyze correlations.
            <br />
            Continue tracking your health metrics to see what affects your progress.
          </p>
        </div>
      );
    }

    return (
      <div>
        {insight && (
          <div className="mb-4 p-3 bg-primary/10 rounded-md">
            <p dangerouslySetInnerHTML={{ __html: insight }} />
          </div>
        )}
        
        <div className="h-[300px]">
          <CorrelationBarChart data={chartData} />
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p>
            <span className="inline-block w-3 h-3 bg-green-600 mr-1 rounded-sm"></span>
            <span className="mr-3">Positive correlation</span>
            <span className="inline-block w-3 h-3 bg-red-600 mr-1 rounded-sm"></span>
            <span>Negative correlation</span>
          </p>
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
