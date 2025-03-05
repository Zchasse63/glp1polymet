
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { analyzeWeightLossCorrelations, generateKeyInsights } from "@/utils/insights/correlationAnalysis";
import { fetchUserIntegrations } from "@/utils/appIntegrations";
import { Badge } from "@/components/ui/badge";
import CorrelationBarChart from "./charts/CorrelationBarChart";
import InsightDisplay from "./InsightDisplay";
import CorrelationLoadingState from "./CorrelationLoadingState";
import { toast } from "@/components/ui/use-toast";
import { CorrelationFactor } from "@/types/insightTypes";
import { useCorrelationData } from "@/hooks/useCorrelationData";

/**
 * WeightLossCorrelations Component
 * 
 * Displays factors correlated with weight loss success, following CodeFarm principles:
 * - Separation of concerns: Data fetching handled by custom hook
 * - Error handling: Graceful fallbacks and user notifications
 * - Documentation: Comprehensive JSDoc comments
 * - Single Responsibility: Each subcomponent has a focused purpose
 */
const WeightLossCorrelations: React.FC = () => {
  const { 
    correlationData, 
    loading, 
    error, 
    insight, 
    dataSources 
  } = useCorrelationData();
  
  // Inform user of errors via toast
  useEffect(() => {
    if (error) {
      toast({
        title: "Unable to load correlation data",
        description: "Showing sample data instead. Please try again later.",
        variant: "destructive"
      });
    }
  }, [error]);
  
  // Sort data for optimal display
  const formattedData = React.useMemo(() => {
    if (!correlationData.length) return [];
    
    // Sort by positive correlations first, then by absolute correlation strength
    const sortedData = [...correlationData].sort((a, b) => {
      if (a.correlation >= 0 && b.correlation < 0) return -1;
      if (a.correlation < 0 && b.correlation >= 0) return 1;
      return Math.abs(b.correlation) - Math.abs(a.correlation);
    });
    
    return sortedData.map(item => ({
      ...item,
      value: item.correlation * 100,
      formattedValue: Math.round(item.correlation * 100)
    }));
  }, [correlationData]);
  
  if (loading) {
    return <CorrelationLoadingState />;
  }
  
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <CardTitle className="text-lg font-medium">
            Weight Loss Correlations
          </CardTitle>
          <div className="flex flex-wrap gap-1 mt-2 sm:mt-0">
            {dataSources.map(source => (
              <Badge key={source} variant="secondary" className="text-xs">
                {source.charAt(0).toUpperCase() + source.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Factors most strongly correlated with your weight loss success
        </p>

        <CorrelationBarChart formattedData={formattedData} />
        <InsightDisplay insight={insight} />
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Insights are based on your historical data from all connected apps, even if you've disconnected them.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightLossCorrelations;
