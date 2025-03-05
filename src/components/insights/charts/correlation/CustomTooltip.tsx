
import React from 'react';
import { TooltipProps } from 'recharts';
import { useI18n } from '@/lib/i18n';

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
  tooltipStyle,
  labelStyle,
}) => {
  const { t } = useI18n();

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

  return (
    <div className="custom-tooltip rounded-md border p-3 shadow-sm" style={tooltipStyle}>
      <p className="font-medium mb-1" style={labelStyle}>{label}</p>
      <p className="text-sm">
        {t('correlation')}: <span className="font-medium">{formattedValue}</span>
      </p>
      <p className="text-sm">
        {t('strength')}: <span className="font-medium">{strength} {direction}</span>
      </p>
    </div>
  );
};
