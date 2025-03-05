
import { Correlation, UserHealthData } from './types';
import { TimePeriod } from '@/components/insights/TimePeriodSelector';
import { format, subDays } from 'date-fns';

/**
 * Generates mock user health data for development and testing
 * Following CodeFarm principles:
 * - Modular Design: Separate mock data generation
 * - Maintainable: Well-documented functions
 * - Scalable: Easily extended for new data types
 * 
 * @param userId - The user ID to generate data for
 * @param days - Number of days of historical data to generate
 * @returns Complete mock user health data
 */
export const generateMockHealthData = (userId: string, days: number): UserHealthData => {
  const today = new Date();
  const data: UserHealthData = {
    userId,
    weightMeasurements: [],
    activityMetrics: [],
    nutritionRecords: [],
    sleepRecords: [],
    stressLevels: [],
    medicationAdherence: []
  };
  
  // Generate daily data for the specified number of days
  for (let i = 0; i < days; i++) {
    const currentDate = subDays(today, i);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const dateTimeStr = `${dateStr}T08:00:00Z`;
    
    // Weight data: Start at 100kg and decrease slightly over time with some variation
    const baseWeight = 100 - (i * 0.08);
    const randomVariation = Math.random() * 0.6 - 0.3; // -0.3 to +0.3
    data.weightMeasurements.push({
      timestamp: dateTimeStr,
      value: baseWeight + randomVariation,
      unit: "kg"
    });
    
    // Activity data
    data.activityMetrics.push({
      timestamp: dateTimeStr,
      steps: Math.floor(5000 + Math.random() * 7000),
      activeMinutes: Math.floor(30 + Math.random() * 60),
      distance: 3 + Math.random() * 5,
      distanceUnit: "km",
      caloriesBurned: Math.floor(1800 + Math.random() * 600)
    });
    
    // Nutrition data
    const processedFoodDay = Math.random() > 0.7;
    data.nutritionRecords.push({
      timestamp: dateTimeStr,
      calories: Math.floor(1600 + Math.random() * 800),
      protein: Math.floor(70 + Math.random() * 60),
      carbs: Math.floor(150 + Math.random() * 100),
      fat: Math.floor(50 + Math.random() * 30),
      water: Math.floor(1500 + Math.random() * 1000),
      fiber: Math.floor(15 + Math.random() * 15),
      processedFoods: processedFoodDay,
      mealCount: Math.floor(3 + Math.random() * 2)
    });
    
    // Sleep data
    data.sleepRecords.push({
      date: dateStr,
      durationMinutes: Math.floor(360 + Math.random() * 180),
      quality: Math.floor(5 + Math.random() * 5),
      deepSleepMinutes: Math.floor(90 + Math.random() * 60),
      remSleepMinutes: Math.floor(60 + Math.random() * 60),
      bedtime: `${format(subDays(today, i), 'yyyy-MM-dd')}T22:30:00Z`,
      wakeTime: `${dateStr}T06:30:00Z`
    });
    
    // Stress data
    data.stressLevels.push({
      timestamp: dateTimeStr,
      level: Math.floor(3 + Math.random() * 6)
    });
    
    // Medication adherence
    const tookMedication = Math.random() > 0.1; // 90% adherence rate
    data.medicationAdherence.push({
      date: dateStr,
      adherence: tookMedication,
      reason: !tookMedication ? "Forgot" : undefined
    });
  }
  
  return data;
};

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
    { factor: "Sleep Duration", correlation: 0.68, color: "#22c55e" },
    { factor: "Water Intake", correlation: 0.52, color: "#22c55e" },
    { factor: "Step Count", correlation: 0.47, color: "#22c55e" },
    { factor: "Meal Frequency", correlation: -0.38, color: "#ef4444" },
    { factor: "Protein Intake", correlation: 0.41, color: "#22c55e" },
    { factor: "Processed Foods", correlation: -0.62, color: "#ef4444" },
    { factor: "Stress Level", correlation: -0.44, color: "#ef4444" },
    { factor: "Alcohol Consumption", correlation: -0.35, color: "#ef4444" }
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
    correlation: Math.max(-0.95, Math.min(0.95, item.correlation * timeFactor)),
    color: item.correlation > 0 ? "#22c55e" : "#ef4444"
  }));
};
