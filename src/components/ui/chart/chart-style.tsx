
import * as React from "react"
import { ChartConfig, THEMES } from "./chart-context"

export const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([_, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
${Object.entries(THEMES)
  .map(
    ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .filter(Boolean)
  .join("\n")}
}

/* Enhanced chart styling */
${prefix} [data-chart=${id}] .recharts-cartesian-grid-horizontal line,
${prefix} [data-chart=${id}] .recharts-cartesian-grid-vertical line {
  stroke-opacity: 0.15;
}

${prefix} [data-chart=${id}] .recharts-tooltip-cursor {
  stroke-opacity: 0.2;
  stroke-width: 1px;
}

${prefix} [data-chart=${id}] .recharts-dot {
  stroke-width: 1px;
  transition: stroke-width 0.2s, r 0.2s;
}

${prefix} [data-chart=${id}] .recharts-active-dot {
  r: 6px;
  stroke-width: 2px;
  filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2));
}

${prefix} [data-chart=${id}] .recharts-tooltip-wrapper {
  transition: transform 0.1s ease-out;
}

${prefix} [data-chart=${id}] .recharts-default-tooltip {
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

${prefix} [data-chart=${id}] .recharts-cartesian-axis-tick-value {
  font-size: 11px;
}

${prefix} [data-chart=${id}] .recharts-legend-item {
  margin-right: 16px;
}
`
  )
  .join("\n")}
`,
      }}
    />
  )
}
