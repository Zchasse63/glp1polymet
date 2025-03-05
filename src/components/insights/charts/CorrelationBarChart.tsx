
/**
 * CorrelationBarChart Component
 * 
 * Visualizes correlation data between health factors and weight loss.
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Clear visual representation of complex data
 * - Sustainable Code: Reusable chart component
 * - Accessibility: Improved color contrast and labels
 */
import React, { useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Label } from 'recharts';
import { Correlation } from '@/utils/insights/types';
import { cn } from '@/lib/utils';
import { useHighContrastMode } from '@/utils/a11y';
import { useI18n } from '@/lib/i18n';
import analytics, { EventCategory } from '@/utils/eventTracking';
import { getCorrelationColor } from './correlation/getCorrelationColor';
import { CustomTooltip } from './correlation/CustomTooltip';
import { setupFallbackTranslations } from './correlation/FallbackTranslations';

interface CorrelationBarChartProps {
  data: Correlation[];
  className?: string;
}

const CorrelationBarChart: React.FC<CorrelationBarChartProps> = ({ data, className }) => {
  const isHighContrastMode = useHighContrastMode();
  const { t } = useI18n();
  
  // Set up fallback translations
  useEffect(() => {
    setupFallbackTranslations();
  }, []);
  
  // Track component view
  useEffect(() => {
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

export default React.memo(CorrelationBarChart);
