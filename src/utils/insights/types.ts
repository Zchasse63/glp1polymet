
/**
 * Type definitions for insights data structures
 * Following CodeFarm principles:
 * - Strong Typing: Comprehensive type definitions
 * - Documentation: Detailed JSDoc comments
 * - Sustainable Code: Clear, maintainable type interfaces
 */

/**
 * User health data collected from various sources
 */
export interface UserHealthData {
  /** Unique identifier for the user */
  userId: string;
  /** Collection of weight measurements over time */
  weightMeasurements: WeightMeasurement[];
  /** Collection of activity metrics over time */
  activityMetrics: ActivityMetric[];
  /** Collection of nutrition records over time */
  nutritionRecords: NutritionRecord[];
  /** Collection of sleep records over time */
  sleepRecords: SleepRecord[];
  /** Collection of stress level recordings over time */
  stressLevels: StressReading[];
  /** Collection of medication adherence records */
  medicationAdherence: MedicationAdherenceRecord[];
  /** Optional additional health metrics */
  additionalMetrics?: Record<string, any[]>;
}

/**
 * Single weight measurement data point
 */
export interface WeightMeasurement {
  /** Date and time of measurement */
  timestamp: string;
  /** Weight value in user's preferred unit */
  value: number;
  /** Unit of measurement (e.g., "kg", "lbs") */
  unit: "kg" | "lbs";
}

/**
 * Single activity metric data point
 */
export interface ActivityMetric {
  /** Date and time of activity recording */
  timestamp: string;
  /** Step count for the day */
  steps?: number;
  /** Active minutes */
  activeMinutes?: number;
  /** Distance traveled */
  distance?: number;
  /** Unit for distance (e.g., "km", "mi") */
  distanceUnit?: "km" | "mi";
  /** Calories burned */
  caloriesBurned?: number;
}

/**
 * Single nutrition record data point
 */
export interface NutritionRecord {
  /** Date and time of nutrition recording */
  timestamp: string;
  /** Total calories consumed */
  calories?: number;
  /** Protein intake in grams */
  protein?: number;
  /** Carbohydrate intake in grams */
  carbs?: number;
  /** Fat intake in grams */
  fat?: number;
  /** Water intake in milliliters */
  water?: number;
  /** Fiber intake in grams */
  fiber?: number;
  /** Whether processed foods were consumed */
  processedFoods?: boolean;
  /** Number of meals eaten */
  mealCount?: number;
}

/**
 * Single sleep record data point
 */
export interface SleepRecord {
  /** Date of sleep recording */
  date: string;
  /** Total sleep duration in minutes */
  durationMinutes: number;
  /** Sleep quality rating (1-10) */
  quality?: number;
  /** Deep sleep duration in minutes */
  deepSleepMinutes?: number;
  /** REM sleep duration in minutes */
  remSleepMinutes?: number;
  /** Time went to bed */
  bedtime?: string;
  /** Time woke up */
  wakeTime?: string;
}

/**
 * Single stress level reading
 */
export interface StressReading {
  /** Date and time of stress reading */
  timestamp: string;
  /** Stress level (1-10) */
  level: number;
  /** Optional notes about stressors */
  notes?: string;
}

/**
 * Medication adherence record
 */
export interface MedicationAdherenceRecord {
  /** Date of medication taking */
  date: string;
  /** Whether medication was taken as prescribed */
  adherence: boolean;
  /** Optional reason for non-adherence */
  reason?: string;
}

/**
 * Correlation between a factor and weight loss
 */
export interface Correlation {
  /** The name of the factor (e.g., "Sleep Duration", "Water Intake") */
  factor: string;
  /** Correlation coefficient between -1 and 1 */
  correlation: number;
  /** Color for visualization */
  color?: string;
}

/**
 * Weekly progress data point
 */
export interface WeeklyProgressPoint {
  /** The week number or identifier */
  week: string | number;
  /** The progress value for that week */
  value: number;
  /** Optional target value for comparison */
  target?: number;
}

/**
 * Recommendation for health improvement
 */
export interface Recommendation {
  /** Unique identifier for the recommendation */
  id: string;
  /** The title of the recommendation */
  title: string;
  /** Detailed description of the recommendation */
  description: string;
  /** Category of the recommendation (e.g., "Nutrition", "Fitness") */
  category: string;
  /** Priority level (1-3, with 1 being highest) */
  priority: 1 | 2 | 3;
  /** Implementation difficulty (1-3, with 1 being easiest) */
  difficulty: 1 | 2 | 3;
  /** Estimated time to see results (in days) */
  timeToResults: number;
}
