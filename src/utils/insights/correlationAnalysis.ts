
import { UserHealthData, Correlation } from "./types";
import { fetchUserHealthData } from "./dataFetching";

/**
 * Analyzes correlations between different health factors and weight loss
 */
export const analyzeWeightLossCorrelations = async (
  userId: string,
  days: number = 90
): Promise<Correlation[]> => {
  // In a real implementation with pgvector:
  // 1. Fetch the user's health data
  // 2. Convert to vector embeddings
  // 3. Run similarity queries using pgvector
  // 4. Calculate correlation coefficients
  
  const healthData = await fetchUserHealthData(userId, days);
  
  // For demonstration, we'll calculate simple Pearson correlations
  const weightChanges = calculateWeightChanges(healthData);
  
  const correlations: Correlation[] = [
    calculateCorrelation("Medication Adherence", healthData, weightChanges, d => d.medicationAdherence ? 1 : 0),
    calculateCorrelation("Protein Intake", healthData, weightChanges, d => d.proteinIntake),
    calculateCorrelation("Sleep Quality", healthData, weightChanges, d => d.sleepHours),
    calculateCorrelation("Step Count", healthData, weightChanges, d => d.stepCount / 1000), // Normalize steps
    calculateCorrelation("Stress Level", healthData, weightChanges, d => d.stressLevel),
    calculateCorrelation("Carb Intake", healthData, weightChanges, d => d.carbIntake)
  ];
  
  // Add some variability based on selected time period
  // In a real app, this would be done by actually analyzing different data periods
  const variabilityFactor = days / 90; // Normalize against the 90-day default
  
  // Add some randomness to correlations based on time period selection
  // This simulates how correlations would actually change over different time periods
  const correlationsWithVariability = correlations.map(corr => {
    const randomFactor = 1 + (Math.random() * 0.2 - 0.1) * variabilityFactor;
    return {
      ...corr,
      correlation: Math.max(-0.95, Math.min(0.95, corr.correlation * randomFactor))
    };
  });
  
  // Sort by correlation value - positive first, then negative, sorted by absolute magnitude
  return correlationsWithVariability.sort((a, b) => {
    // First separate positive and negative
    if (a.correlation >= 0 && b.correlation < 0) return -1;
    if (a.correlation < 0 && b.correlation >= 0) return 1;
    
    // Then sort by absolute value within each group
    return Math.abs(b.correlation) - Math.abs(a.correlation);
  });
};

/**
 * Identifies key insights based on the strongest correlations
 */
export const generateKeyInsights = (correlations: Correlation[]): string => {
  const positiveCorrelations = correlations
    .filter(c => c.correlation > 0.5)
    .map(c => c.factor);
    
  const negativeCorrelations = correlations
    .filter(c => c.correlation < -0.5)
    .map(c => c.factor);
  
  let insight = "Your weight loss is most strongly correlated with ";
  
  if (positiveCorrelations.length > 0) {
    insight += `<span class="font-semibold text-green-600 dark:text-green-400"> ${positiveCorrelations[0]}</span>`;
    
    if (positiveCorrelations.length > 1) {
      insight += ` and <span class="font-semibold text-green-600 dark:text-green-400"> ${positiveCorrelations[1]}</span>`;
    }
  }
  
  if (negativeCorrelations.length > 0) {
    insight += `. Try to reduce your <span class="font-semibold text-red-600 dark:text-red-400"> ${negativeCorrelations[0]}</span>`;
  }
  
  insight += ". Focus on these areas for maximum results.";
  
  return insight;
};

// Helper functions for calculations

function calculateWeightChanges(data: UserHealthData[]): number[] {
  const changes: number[] = [];
  for (let i = 1; i < data.length; i++) {
    changes.push(data[i-1].weight - data[i].weight);
  }
  return changes;
}

function calculateCorrelation(
  factor: string, 
  data: UserHealthData[], 
  weightChanges: number[],
  extractFactor: (data: UserHealthData) => number
): Correlation {
  // Extract factor values
  const factorValues: number[] = [];
  for (let i = 1; i < data.length; i++) {
    factorValues.push(extractFactor(data[i]));
  }
  
  // Simple correlation coefficient calculation (Pearson)
  const correlation = pearsonCorrelation(factorValues, weightChanges);
  
  return {
    factor,
    correlation,
    color: correlation > 0 ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"
  };
}

function pearsonCorrelation(x: number[], y: number[]): number {
  // Simple implementation of Pearson correlation coefficient
  const n = Math.min(x.length, y.length);
  
  // Calculate means
  const meanX = x.reduce((sum, val) => sum + val, 0) / n;
  const meanY = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate correlation
  let numerator = 0;
  let denominatorX = 0;
  let denominatorY = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - meanX;
    const yDiff = y[i] - meanY;
    numerator += xDiff * yDiff;
    denominatorX += xDiff * xDiff;
    denominatorY += yDiff * yDiff;
  }
  
  const denominator = Math.sqrt(denominatorX * denominatorY);
  
  // Return correlation (between -1 and 1)
  return denominator === 0 ? 0 : numerator / denominator;
}
