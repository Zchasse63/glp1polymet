
/**
 * CorrelationBarChart Component
 * 
 * Visualizes correlation data between health factors and weight loss.
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear visual representation of complex data
 * - Sustainable Code: Reusable chart component
 * - Performance Optimization: Memoized rendering
 * - Accessibility: Improved color contrast and labels
 */
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Correlation } from '@/utils/insights/types';
import { cn } from '@/lib/utils';
import { useHighContrastMode } from '@/utils/a11y';
import { useI18n } from '@/lib/internationalization';
import { measureApiCall } from '@/utils/performanceMonitoring';
import analytics, { EventCategory } from '@/utils/eventTracking';

interface CorrelationBarChartProps {
  data: Correlation[];
  className?: string;
}

const CorrelationBarChart: React.FC<CorrelationBarChartProps> = ({ data, className }) => {
  const isHighContrastMode = useHighContrastMode();
  const { t } = useI18n();
  
  // Track component view
  React.useEffect(() => {
    analytics.trackEvent({
      name: 'chart_viewed',
      category: EventCategory.ENGAGEMENT,
      properties: {
        chartType: 'correlation_bar_chart',
        dataPoints: data.length
      }
    });
  }, [data.length]);
  
  // Format data for the chart - convert to percentage for better readability
  const formattedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      // Convert correlation coefficient to percentage for display
      value: Math.round(item.correlation * 100),
      // Format the value for tooltip display
      formattedValue: Math.round(Math.abs(item.correlation * 100)),
      // Determine color based on correlation strength and high contrast mode
      color: item.color || getCorrelationColor(item.correlation, isHighContrastMode)
    }));
  }, [data, isHighContrastMode]);

  // Get color based on correlation strength and high contrast mode
  const getCorrelationColor = (correlation: number, highContrast: boolean): string => {
    const absValue = Math.abs(correlation);
    
    if (highContrast) {
      // High contrast colors for accessibility
      return correlation > 0 ? "#007700" : "#bb0000";
    }
    
    if (correlation > 0) {
      // Positive correlations - green shades
      if (absValue > 0.7) return "#15803d"; // Strong positive - darker green
      if (absValue > 0.4) return "#22c55e"; // Medium positive - medium green
      return "#86efac"; // Weak positive - light green
    } else {
      // Negative correlations - red shades
      if (absValue > 0.7) return "#b91c1c"; // Strong negative - darker red
      if (absValue > 0.4) return "#ef4444"; // Medium negative - medium red
      return "#fca5a5"; // Weak negative - light red
    }
  };

  // Custom tooltip to show the correlation value with additional context
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const absValue = Math.abs(data.value);
      
      // Determine strength text based on correlation value
      let strengthText = t('insights.correlation.weak');
      if (absValue > 70) strengthText = t('insights.correlation.veryStrong');
      else if (absValue > 50) strengthText = t('insights.correlation.strong');
      else if (absValue > 30) strengthText = t('insights.correlation.moderate');
      
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-md max-w-xs" role="tooltip">
          <p className="font-medium mb-1">{data.factor}</p>
          <p className="text-sm mb-1">
            <span className={data.value >= 0 ? 'text-green-600' : 'text-red-600'}>
              {data.value >= 0 ? t('insights.correlation.positive') : t('insights.correlation.negative')} 
              {' '}{t('insights.correlation.correlation')}: {data.formattedValue}%
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {data.value >= 0 
              ? t('insights.correlation.positiveExplanation', { strength: strengthText })
              : t('insights.correlation.negativeExplanation', { strength: strengthText })
            }
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className={cn("mt-2 h-full", className)}
      role="figure" 
      aria-label={t('insights.correlation.chartAriaLabel')}
    >
      <ResponsiveContainer width="100%" height="100%" className={cn("mt-2", className)}>
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 15 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            domain={[-100, 100]}
            tickFormatter={(value) => `${Math.abs(value)}%`}
            aria-label={t('insights.correlation.strengthAxis')}
          >
            <Label 
              value={t('insights.correlation.strengthLabel')} 
              offset={0} 
              position="bottom" 
              style={{ fontSize: '0.75rem', fill: '#6b7280' }} 
            />
          </XAxis>
          <YAxis 
            type="category" 
            dataKey="factor" 
            width={120}
            tickMargin={5}
            tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
            style={{ fontSize: '0.75rem' }}
            aria-label={t('insights.correlation.factorsAxis')}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#666" />
          <Bar 
            dataKey="value" 
            fill={(data) => data.color || (data.value >= 0 ? "#22c55e" : "#ef4444")}
            radius={[4, 4, 4, 4]}
            animationDuration={800}
            animationBegin={300}
            label={({ x, y, width, height, value }) => {
              const absValue = Math.abs(value);
              // Only show labels for significant correlations
              if (absValue > 30) {
                const xPos = value >= 0 ? x + width + 5 : x - 5;
                const textAnchor = value >= 0 ? "start" : "end";
                return (
                  <text 
                    x={xPos} 
                    y={y + height / 2} 
                    textAnchor={textAnchor} 
                    dominantBaseline="middle"
                    className="text-xs fill-current"
                  >
                    {absValue}%
                  </text>
                );
              }
              return null;
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Default fallback translations for the component
if (!('insights.correlation.weak' in window)) {
  const fallbackTranslations = {
    'insights.correlation.weak': 'weak',
    'insights.correlation.moderate': 'moderate',
    'insights.correlation.strong': 'strong',
    'insights.correlation.veryStrong': 'very strong',
    'insights.correlation.positive': 'Positive',
    'insights.correlation.negative': 'Negative',
    'insights.correlation.correlation': 'correlation',
    'insights.correlation.positiveExplanation': 'This factor shows a {strength} positive relationship with your weight loss.',
    'insights.correlation.negativeExplanation': 'This factor shows a {strength} negative relationship with your weight loss.',
    'insights.correlation.chartAriaLabel': 'Bar chart showing correlations between health factors and weight loss',
    'insights.correlation.strengthAxis': 'Correlation strength in percent',
    'insights.correlation.factorsAxis': 'Health factors',
    'insights.correlation.strengthLabel': 'Correlation Strength (%)'
  };
  
  // Add fallback translations to window for development
  Object.entries(fallbackTranslations).forEach(([key, value]) => {
    (window as any)[key] = value;
  });
}

export default React.memo(CorrelationBarChart);
