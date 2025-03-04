
// This file is re-exporting from the refactored chart components
// to maintain backward compatibility with existing imports
import { ChartContainer } from "./chart/chart-container";
import { ChartTooltip, ChartTooltipContent } from "./chart/chart-tooltip";
import { ChartLegend, ChartLegendContent } from "./chart/chart-legend";
import { ChartStyle } from "./chart/chart-style";
import type { ChartConfig } from "./chart/chart-context";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};

// Use 'export type' for type-only exports
export type { ChartConfig };
