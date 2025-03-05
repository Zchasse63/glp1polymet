
/**
 * Type definitions for insights data structures
 */

/**
 * Correlation between a factor and weight loss
 */
export interface Correlation {
  /** The name of the factor (e.g., "Sleep Duration", "Water Intake") */
  factor: string;
  /** Correlation coefficient between -1 and 1 */
  correlation: number;
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
