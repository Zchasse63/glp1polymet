
// Types for health data and correlations
export interface UserHealthData {
  date: string;
  weight: number;
  caloriesConsumed: number;
  proteinIntake: number;
  carbIntake: number;
  fatIntake: number;
  sleepHours: number;
  stressLevel: number;
  stepCount: number;
  medicationAdherence: boolean;
  // Could add more metrics as needed
}

export interface Correlation {
  factor: string;
  correlation: number;
  color: string;
}
