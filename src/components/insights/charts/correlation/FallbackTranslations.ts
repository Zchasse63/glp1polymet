
/**
 * Default fallback translations for the correlation chart component
 * Used when translations are not loaded yet
 */
export const setupFallbackTranslations = () => {
  // Only set up if not already present
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
};
