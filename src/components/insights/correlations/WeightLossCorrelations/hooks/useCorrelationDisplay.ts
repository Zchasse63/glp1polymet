import { useMemo, useState, useCallback, useEffect } from "react";
import { Correlation } from "@/utils/insights/types";
import { ErrorLogger } from "@/utils/errorHandling";

interface UseCorrelationDisplayProps {
  correlations: Correlation[] | undefined;
  onRetry?: () => void;
  isVisible: boolean;
  error: Error | null;
}

/**
 * Custom hook for handling correlation display logic
 */
const useCorrelationDisplay = ({
  correlations,
  onRetry,
  isVisible,
  error
}: UseCorrelationDisplayProps) => {
  // State for visualization options
  const [showAllFactors, setShowAllFactors] = useState(false);
  
  // Log errors to our centralized error logger
  useEffect(() => {
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

  return {
    sortedCorrelations,
    displayedCorrelations,
    hasSignificantCorrelations,
    showAllFactors,
    toggleFactorDisplay,
    handleExportData,
    handleRetry
  };
};

export default useCorrelationDisplay;
