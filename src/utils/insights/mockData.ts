
import { Correlation } from './types';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';

/**
 * Generates mock correlation data for development and testing
 * 
 * @param timePeriod - The selected time period for data analysis
 * @returns Array of correlation data
 */
export const getMockCorrelationData = (timePeriod: TimePeriod): Correlation[] => {
  // Base correlations that will be slightly modified based on the time period
  // to simulate how correlations might change over different timeframes
  const baseCorrelations: Correlation[] = [
    { factor: "Sleep Duration", correlation: 0.68 },
    { factor: "Water Intake", correlation: 0.52 },
    { factor: "Step Count", correlation: 0.47 },
    { factor: "Meal Frequency", correlation: -0.38 },
    { factor: "Protein Intake", correlation: 0.41 },
    { factor: "Processed Foods", correlation: -0.62 },
    { factor: "Stress Level", correlation: -0.44 },
    { factor: "Alcohol Consumption", correlation: -0.35 }
  ];
  
  // Adjust correlations based on time period to simulate how data might 
  // show different patterns over different timeframes
  let timeFactor = 1.0;
  switch (timePeriod) {
    case '7days':
      // For short time periods, correlations are more volatile
      timeFactor = 0.9 + Math.random() * 0.3;
      break;
    case '30days':
      // Default baseline
      timeFactor = 1.0;
      break;
    case '90days':
      // More stable correlations for longer periods
      timeFactor = 1.0 + (Math.random() * 0.1);
      break;
    case '6months':
    case '1year':
      // Even more stable and potentially stronger correlations
      timeFactor = 1.05 + (Math.random() * 0.15);
      break;
  }
  
  // Apply the time factor, but make sure correlations stay in valid range [-1, 1]
  return baseCorrelations.map(item => ({
    factor: item.factor,
    correlation: Math.max(-0.95, Math.min(0.95, item.correlation * timeFactor))
  }));
};
