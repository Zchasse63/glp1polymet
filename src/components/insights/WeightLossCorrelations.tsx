import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from "recharts";
import { analyzeWeightLossCorrelations, generateKeyInsights } from "@/utils/insights/correlationAnalysis";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUserIntegrations } from "@/utils/appIntegrations";
import { Badge } from "@/components/ui/badge";

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
    absValue: Math.abs(item.correlation) * 100,
    formattedValue: Math.round(item.correlation * 100)
  }));
  
  if (loading) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Weight Loss Correlations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Analyzing your data to find correlations...
          </p>
          <div className="space-y-4">
            <Skeleton className="h-[280px] w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
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

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={formattedData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              barSize={16}
              barGap={2}
            >
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={value => `${value}%`}
                tickCount={6}
              />
              <YAxis 
                type="category" 
                dataKey="factor" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'hsl(var(--foreground))', fontWeight: 500 }}
                width={130}
                tickMargin={8}
              />
              <Tooltip
                formatter={(value, name, props) => {
                  const item = props.payload;
                  const sign = item.correlation > 0 ? '+' : '';
                  return [`${sign}${item.formattedValue}%`, 'Correlation'];
                }}
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  padding: '8px 12px',
                  fontSize: '12px',
                }}
                wrapperStyle={{
                  outline: 'none',
                }}
                cursor={{ fill: 'hsl(var(--muted)/0.15)' }}
              />
              <Bar 
                dataKey="absValue"
                background={{ fill: 'hsl(var(--accent)/0.4)', radius: 4 }}
                radius={4}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {formattedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    style={{ filter: 'brightness(1.05)' }}
                  />
                ))}
                <LabelList 
                  dataKey="formattedValue" 
                  position="right" 
                  formatter={(value, name, props) => {
                    if (props && props.payload) {
                      const item = props.payload;
                      const sign = item.correlation > 0 ? '+' : '';
                      return `${sign}${value}%`;
                    }
                    return value;
                  }}
                  style={{ 
                    fill: 'hsl(var(--foreground))', 
                    fontWeight: 'bold', 
                    fontSize: 12,
                    filter: 'drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.1))'
                  }}
                  offset={8}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-sm bg-primary/5 p-4 rounded-lg border border-primary/10">
          <p className="font-medium text-gray-700 dark:text-gray-300 mb-1">
            Key Insight:
          </p>
          <p className="text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: insight }}>
          </p>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Insights are based on your historical data from all connected apps, even if you've disconnected them.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeightLossCorrelations;
