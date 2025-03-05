
import React from 'react';
import { useI18n } from '@/lib/i18n';

interface TooltipProps {
  active?: boolean;
  payload?: any[];
}

/**
 * Custom tooltip to show the correlation value with additional context
 */
export const CustomTooltip = ({ active, payload }: TooltipProps) => {
  const { t } = useI18n();
  
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
