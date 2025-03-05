import React, { useMemo, useRef, useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Correlation } from "@/utils/insights/types";
import CorrelationBarChart from "./charts/CorrelationBarChart";
import CorrelationLoadingState from "./CorrelationLoadingState";
import CorrelationErrorState from "./CorrelationErrorState";
import { ErrorLogger, ErrorSeverity } from "@/utils/errorHandling";
import { useIntersectionObserver } from "@/utils/performanceUtils";
import { Button } from "@/components/ui/button";
import { Info, Download, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
    
    // In a real app, this would generate and download a file
    // For now, we'll just show a toast message
    console.log("Exporting correlation data", correlations);
    
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
        
        <div className={cn(
          "h-[300px]", 
          !hasSignificantCorrelations && "opacity-80"
        )}>
          <CorrelationBarChart data={displayedCorrelations} />
        </div>
        
        {!hasSignificantCorrelations && (
          <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground">
            <p className="flex items-center gap-1">
              <Info className="h-3 w-3" />
              No strong correlations detected yet. Continue tracking for more accurate insights.
            </p>
          </div>
        )}
        
        <div className="mt-4 flex flex-col space-y-2">
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
          
          <div className="flex justify-between items-center">
            {sortedCorrelations.length > 5 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleFactorDisplay}
                className="text-xs h-8"
              >
                {showAllFactors ? "Show top factors only" : "Show all factors"}
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 ml-auto"
              onClick={handleExportData}
              disabled={!correlations || correlations.length === 0}
            >
              <Download className="h-3 w-3 mr-1" />
              Export data
            </Button>
          </div>
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
