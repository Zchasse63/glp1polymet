
import { supabase } from "@/lib/supabase";
import { UserHealthData } from "./types";
import { fetchIntegrationData } from "../appIntegrations";
import { generateMockHealthData } from "./mockData";

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
      return combineHealthData(weightData, sleepData, activityData, nutritionData, medicationData);
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

/**
 * Combines health data from different integration sources
 */
const combineHealthData = (
  weightData: any[], 
  sleepData: any[], 
  activityData: any[], 
  nutritionData: any[], 
  medicationData: any[] | null
): UserHealthData[] => {
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
};
