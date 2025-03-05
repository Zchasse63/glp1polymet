
export interface CorrelationBarChartProps {
  data: { factor: string; correlation: number }[];
  xAxisKey?: string;
  correlationKey?: string;
  barColorPositive?: string;
  barColorNegative?: string;
  height?: number;
}
