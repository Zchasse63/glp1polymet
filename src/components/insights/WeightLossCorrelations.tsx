
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { analyzeWeightLossCorrelations, generateKeyInsights } from "@/utils/insights/correlationAnalysis";
import { fetchUserIntegrations } from "@/utils/appIntegrations";
import { Badge } from "@/components/ui/badge";
import CorrelationBarChart from "./charts/CorrelationBarChart";
import InsightDisplay from "./InsightDisplay";
import CorrelationLoadingState from "./CorrelationLoadingState";

const WeightLossCorrelations = () => {
  const [correlationData, setCorrelationData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [insight, setInsight] = useState<string>("");
  const [dataSources, setDataSources] = useState<string[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = "demo-user";
        const correlations = await analyzeWeightLossCorrelations(userId);
        setCorrelationData(correlations);
        setInsight(generateKeyInsights(correlations));
        
        const integrations = await fetchUserIntegrations(userId);
        const activeIntegrations = integrations
          .filter(integration => integration.status === 'active')
          .map(integration => integration.provider);
          
        if (activeIntegrations.length > 0) {
          setDataSources(activeIntegrations);
        } else {
          setDataSources(['App Data']);
        }
      } catch (error) {
        console.error("Error fetching correlation data:", error);
        setCorrelationData([
          { factor: "Medication Adherence", correlation: 0.85, color: "hsl(142, 76%, 36%)" },
          { factor: "Protein Intake", correlation: 0.72, color: "hsl(142, 76%, 36%)" },
          { factor: "Sleep Quality", correlation: 0.68, color: "hsl(142, 76%, 36%)" },
          { factor: "Step Count", correlation: 0.65, color: "hsl(142, 76%, 36%)" },
          { factor: "Stress Level", correlation: -0.58, color: "hsl(0, 84%, 60%)" },
          { factor: "Carb Intake", correlation: -0.45, color: "hsl(0, 84%, 60%)" },
        ]);
        setInsight("Your weight loss is most strongly correlated with <span class=\"font-semibold text-green-600 dark:text-green-400\"> medication adherence</span> and <span class=\"font-semibold text-green-600 dark:text-green-400\"> protein intake</span>. Focus on these areas for maximum results.");
        setDataSources(['Sample Data']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const sortedData = [...correlationData].sort((a, b) => {
    if (a.correlation >= 0 && b.correlation < 0) return -1;
    if (a.correlation < 0 && b.correlation >= 0) return 1;
    return Math.abs(b.correlation) - Math.abs(a.correlation);
  });
  
  const formattedData = sortedData.map(item => ({
    ...item,
    value: item.correlation * 100,
    formattedValue: Math.round(item.correlation * 100)
  }));
  
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
