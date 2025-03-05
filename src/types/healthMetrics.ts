
/**
 * Health Metrics Type Definitions
 * Following CodeFarm architecture principles:
 * - Type Safety: Comprehensive TypeScript interfaces for all data structures
 * - Documentation: Detailed JSDoc comments for better code understanding
 * - Modularity: Separation of types into dedicated files
 */

/**
 * Represents a single weight entry in the system
 */
export interface WeightEntry {
  /** Unique identifier for the weight entry */
  id: string;
  /** Weight value */
  weight: number;
  /** Date of the weight entry in ISO format (YYYY-MM-DD) */
  date: string;
  /** Unit of measurement (lbs or kg) */
  unit: string;
}

/**
 * Supported weight display units
 */
export type WeightUnit = "lbs" | "kg";

/**
 * Data point with date and numeric value
 */
export interface DataPoint {
  /** Date string in format specified by the component */
  date: string;
  /** Numeric value for the data point */
  value: number;
}

/**
 * Blood pressure data point with systolic and diastolic values
 */
export interface BloodPressureDataPoint {
  /** Date string in format specified by the component */
  date: string;
  /** Systolic blood pressure value (top number) */
  systolic: number;
  /** Diastolic blood pressure value (bottom number) */
  diastolic: number;
}

/**
 * Complete health metrics data structure
 */
export interface HealthMetricsData {
  /** Step count or other activity metrics */
  activity: DataPoint[];
  /** Heart rate measurements */
  heartRate: DataPoint[];
  /** Sleep duration in hours */
  sleep: DataPoint[];
  /** Hydration measurements in liters */
  hydration: DataPoint[];
  /** Caloric intake */
  calories: DataPoint[];
  /** Blood glucose measurements */
  glucose: DataPoint[];
  /** Blood pressure readings */
  bloodPressure: BloodPressureDataPoint[];
}

/**
 * Trend direction for health metrics
 */
export type TrendDirection = "up" | "down" | "neutral";

/**
 * Parameters for calculating trends
 */
export interface TrendCalculationParams {
  /** Array of data points to analyze */
  data: {value: number}[];
  /** Optional threshold for considering a change significant (percent) */
  significanceThreshold?: number;
}
