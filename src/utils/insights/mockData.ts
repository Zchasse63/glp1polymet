
import { UserHealthData } from "./types";

// Mock data generator for development
export function generateMockHealthData(days: number): UserHealthData[] {
  const data: UserHealthData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  let currentWeight = 185; // Starting weight
  
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    // Randomize factors that affect weight
    const medicationAdherence = Math.random() > 0.2; // 80% adherence rate
    const proteinIntake = 40 + Math.random() * 80; // 40-120g
    const sleepHours = 5 + Math.random() * 4; // 5-9 hours
    const stepCount = 2000 + Math.random() * 10000; // 2k-12k steps
    const stressLevel = 1 + Math.random() * 9; // 1-10 scale
    const carbIntake = 100 + Math.random() * 200; // 100-300g
    
    // Weight changes based on factors (simplified model)
    let weightChange = 0;
    weightChange -= medicationAdherence ? 0.15 : 0; // Medication helps lose weight
    weightChange -= (proteinIntake > 70) ? 0.1 : 0; // Higher protein helps lose weight
    weightChange -= (sleepHours > 7) ? 0.08 : 0; // Good sleep helps lose weight
    weightChange -= (stepCount > 8000) ? 0.1 : 0; // More steps help lose weight
    weightChange += (stressLevel > 7) ? 0.1 : 0; // High stress can increase weight
    weightChange += (carbIntake > 200) ? 0.12 : 0; // High carbs can increase weight
    
    // Add some randomness
    weightChange += (Math.random() - 0.5) * 0.2;
    
    // Update current weight
    currentWeight += weightChange;
    
    // Calculate calories based on macros (simplified)
    const fatIntake = 30 + Math.random() * 50; // 30-80g
    const caloriesConsumed = (carbIntake * 4) + (proteinIntake * 4) + (fatIntake * 9);
    
    data.push({
      date: date.toISOString().split('T')[0],
      weight: currentWeight,
      caloriesConsumed,
      proteinIntake,
      carbIntake,
      fatIntake,
      sleepHours,
      stressLevel,
      stepCount,
      medicationAdherence
    });
  }
  
  return data;
}
