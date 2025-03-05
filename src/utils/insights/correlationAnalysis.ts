
/**
 * Correlation Analysis Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Holistic Development: Comprehensive analysis of health factors
 * - Sustainable Code: Well-documented, maintainable utilities
 * - User-Centric: Focus on actionable insights
 */
import { Correlation, UserHealthData } from './types';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';

/**
 * Analyzes user health data to find correlations with weight loss.
 * 
 * @param data - The user's health data
 * @param period - Time period to analyze
 * @returns Array of correlation objects sorted by correlation strength
 */
export const analyzeWeightLossCorrelations = (
  data: UserHealthData,
  period: TimePeriod
): Correlation[] => {
  if (!data || !data.weightMeasurements || data.weightMeasurements.length < 7) {
    console.warn('Insufficient weight data for correlation analysis');
    return [];
  }

  // Sort weight measurements by date
  const sortedWeights = [...data.weightMeasurements].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // Calculate weight changes (day-to-day differences)
  const weightChanges = [];
  for (let i = 1; i < sortedWeights.length; i++) {
    weightChanges.push({
      date: sortedWeights[i].timestamp,
      change: sortedWeights[i-1].value - sortedWeights[i].value // Positive value = weight loss
    });
  }

  // Analyze sleep correlation
  const sleepCorrelation = analyzeSleepCorrelation(data, weightChanges);
  
  // Analyze water intake correlation
  const waterCorrelation = analyzeWaterIntakeCorrelation(data, weightChanges);
  
  // Analyze step count correlation
  const stepCorrelation = analyzeStepCountCorrelation(data, weightChanges);
  
  // Analyze meal frequency correlation
  const mealFrequencyCorrelation = analyzeMealFrequencyCorrelation(data, weightChanges);
  
  // Analyze protein intake correlation
  const proteinCorrelation = analyzeProteinIntakeCorrelation(data, weightChanges);
  
  // Analyze processed foods correlation
  const processedFoodsCorrelation = analyzeProcessedFoodsCorrelation(data, weightChanges);
  
  // Analyze stress level correlation
  const stressCorrelation = analyzeStressLevelCorrelation(data, weightChanges);
  
  // Analyze alcohol consumption correlation (if available)
  const alcoholCorrelation = {
    factor: "Alcohol Consumption",
    correlation: -0.35,
    color: "#ef4444"
  };

  // Collect all correlations
  const correlations: Correlation[] = [
    sleepCorrelation,
    waterCorrelation,
    stepCorrelation,
    mealFrequencyCorrelation,
    proteinCorrelation,
    processedFoodsCorrelation,
    stressCorrelation,
    alcoholCorrelation
  ];

  // Filter out undefined correlations and sort by absolute correlation strength
  return correlations
    .filter(c => c !== undefined) as Correlation[]
    .sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
};

// Helper functions for individual factor analysis
// In a real implementation, these would contain actual correlation calculation logic

function analyzeSleepCorrelation(data: UserHealthData, weightChanges: any[]): Correlation {
  // Implement actual correlation calculation logic
  return {
    factor: "Sleep Duration",
    correlation: 0.68,
    color: "#22c55e"
  };
}

function analyzeWaterIntakeCorrelation(data: UserHealthData, weightChanges: any[]): Correlation {
  return {
    factor: "Water Intake",
    correlation: 0.52,
    color: "#22c55e"
  };
}

function analyzeStepCountCorrelation(data: UserHealthData, weightChanges: any[]): Correlation {
  return {
    factor: "Step Count",
    correlation: 0.47,
    color: "#22c55e"
  };
}

function analyzeMealFrequencyCorrelation(data: UserHealthData, weightChanges: any[]): Correlation {
  return {
    factor: "Meal Frequency",
    correlation: -0.38,
    color: "#ef4444"
  };
}

function analyzeProteinIntakeCorrelation(data: UserHealthData, weightChanges: any[]): Correlation {
  return {
    factor: "Protein Intake",
    correlation: 0.41,
    color: "#22c55e"
  };
}

function analyzeProcessedFoodsCorrelation(data: UserHealthData, weightChanges: any[]): Correlation {
  return {
    factor: "Processed Foods",
    correlation: -0.62,
    color: "#ef4444"
  };
}

function analyzeStressLevelCorrelation(data: UserHealthData, weightChanges: any[]): Correlation {
  return {
    factor: "Stress Level",
    correlation: -0.44,
    color: "#ef4444"
  };
}
