
import { supabase } from "@/lib/supabase";
import { UserHealthData } from "./types";
import { fetchIntegrationData } from "../appIntegrations";

/**
 * Fetches user health data from Supabase, now supporting app integration data
 */
export const fetchUserHealthData = async (userId: string, days: number = 90): Promise<UserHealthData[]> => {
  try {
    // First try to get data from app integrations
    const weightData = await fetchIntegrationData(userId, 'weight', { limit: days });
    const sleepData = await fetchIntegrationData(userId, 'sleep', { limit: days });
    const activityData = await fetchIntegrationData(userId, 'activity', { limit: days });
    const nutritionData = await fetchIntegrationData(userId, 'nutrition', { limit: days });
    
    // Also get medication adherence data
    const { data: medicationData, error: medError } = await supabase
      .from('medication_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(days);
    
    // If we have some data from app integrations, combine it
    if (weightData.length > 0 || sleepData.length > 0 || activityData.length > 0 || nutritionData.length > 0) {
      // Create a map of dates to combined data
      const healthDataByDate = new Map<string, Partial<UserHealthData>>();
      
      // Process weight data
      weightData.forEach(entry => {
        const date = entry.timestamp.split('T')[0];
        if (!healthDataByDate.has(date)) {
          healthDataByDate.set(date, { date });
        }
        
        const data = healthDataByDate.get(date)!;
        data.weight = entry.weight_lbs || entry.weight;
      });
      
      // Process sleep data
      sleepData.forEach(entry => {
        const date = entry.timestamp.split('T')[0];
        if (!healthDataByDate.has(date)) {
          healthDataByDate.set(date, { date });
        }
        
        const data = healthDataByDate.get(date)!;
        // Convert minutes to hours
        data.sleepHours = (entry.duration_minutes || 0) / 60;
        // Use sleep quality as inverse of stress (simplified)
        data.stressLevel = entry.quality_score ? 10 - (entry.quality_score / 10) : 5;
      });
      
      // Process activity data
      activityData.forEach(entry => {
        const date = entry.timestamp.split('T')[0];
        if (!healthDataByDate.has(date)) {
          healthDataByDate.set(date, { date });
        }
        
        const data = healthDataByDate.get(date)!;
        data.stepCount = entry.steps || 0;
      });
      
      // Process nutrition data
      nutritionData.forEach(entry => {
        const date = entry.timestamp.split('T')[0];
        if (!healthDataByDate.has(date)) {
          healthDataByDate.set(date, { date });
        }
        
        const data = healthDataByDate.get(date)!;
        data.caloriesConsumed = entry.calories || 0;
        data.proteinIntake = entry.protein_grams || 0;
        data.carbIntake = entry.carbs_grams || 0;
        data.fatIntake = entry.fat_grams || 0;
      });
      
      // Process medication data
      if (medicationData) {
        medicationData.forEach(entry => {
          const date = entry.date.split('T')[0];
          if (!healthDataByDate.has(date)) {
            healthDataByDate.set(date, { date });
          }
          
          const data = healthDataByDate.get(date)!;
          data.medicationAdherence = entry.taken;
        });
      }
      
      // Convert map to array and fill in missing values with defaults
      const healthData = Array.from(healthDataByDate.values()).map(data => ({
        date: data.date || '',
        weight: data.weight || 0,
        caloriesConsumed: data.caloriesConsumed || 0,
        proteinIntake: data.proteinIntake || 0,
        carbIntake: data.carbIntake || 0,
        fatIntake: data.fatIntake || 0,
        sleepHours: data.sleepHours || 0,
        stressLevel: data.stressLevel || 5,
        stepCount: data.stepCount || 0,
        medicationAdherence: data.medicationAdherence || false
      }));
      
      // Sort by date descending
      return healthData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    
    // Fallback to the direct health_logs table if no integration data
    const { data, error } = await supabase
      .from('health_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(days);
      
    if (error || !data || data.length === 0) {
      console.error("Error fetching health data or no data found:", error);
      return generateMockHealthData(days);
    }
    
    return data;
    
  } catch (error) {
    console.error("Error in fetchUserHealthData:", error);
    return generateMockHealthData(days);
  }
};

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
