
import React from 'react';
import { TooltipProps } from 'recharts';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useChartConfig } from './useChartConfig';

interface CustomTooltipProps extends TooltipProps<number, string> {
  correlationKey?: string;
  tooltipStyle?: React.CSSProperties;
  labelStyle?: React.CSSProperties;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  correlationKey = 'correlation',
}) => {
  const { t } = useI18n();
  const { tooltipStyle, labelStyle } = useChartConfig();

  if (!active || !payload || !payload.length) {
    return null;
  }

  const correlationValue = payload[0].value;
  const formattedValue = typeof correlationValue === 'number' 
    ? correlationValue.toFixed(2) 
    : correlationValue;
  
  // Determine correlation strength description
  const getCorrelationStrength = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.7) return t('strong');
    if (absValue >= 0.4) return t('moderate');
    return t('weak');
  };

  // Get direction text (positive/negative)
  const getCorrelationDirection = (value: number) => {
    return value >= 0 ? t('positive') : t('negative');
  };

  const strength = getCorrelationStrength(Number(correlationValue));
  const direction = getCorrelationDirection(Number(correlationValue));
  
  // Determine color based on correlation direction
  const directionColor = Number(correlationValue) >= 0 
    ? 'text-green-600 dark:text-green-500' 
    : 'text-red-600 dark:text-red-500';

  return (
    <div 
      className="custom-tooltip rounded-md border bg-card text-card-foreground shadow-sm p-3 animate-fade-in"
      style={tooltipStyle}
      role="tooltip"
      aria-label={`${label} correlation: ${formattedValue}, ${strength} ${direction}`}
    >
      <p className="font-medium mb-1 text-sm" style={labelStyle}>{label}</p>
      <p className="text-xs mt-1.5">
        {t('correlation')}: <span className="font-medium">{formattedValue}</span>
      </p>
      <p className="text-xs mt-0.5">
        {t('strength')}: <span className={cn("font-medium", directionColor)}>
          {strength} {direction}
        </span>
      </p>
    </div>
  );
};
