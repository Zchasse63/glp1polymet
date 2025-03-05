
/**
 * Utility function to get color based on correlation strength and accessibility settings
 */
export const getCorrelationColor = (correlation: number, highContrast: boolean): string => {
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
