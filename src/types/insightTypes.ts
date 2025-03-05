
/**
 * Insight Types Definition
 * Following CodeFarm architecture principles:
 * - Strong Typing: Comprehensive type definitions
 * - Documentation: Detailed JSDoc comments
 * - Modularity: Separation of types into dedicated files
 */

/**
 * Represents a single correlation factor and its strength
 */
export interface CorrelationFactor {
  /** Name of the factor being correlated */
  factor: string;
  /** Correlation coefficient (-1 to 1) */
  correlation: number;
  /** Color for visualization */
  color: string;
  /** Optional additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Formatted correlation data for chart display
 */
export interface FormattedCorrelationData extends CorrelationFactor {
  /** Value scaled for visualization (typically percentage) */
  value: number;
  /** Formatted value for display */
  formattedValue: number;
}

/**
 * Data source information
 */
export interface DataSource {
  /** Unique identifier for the data source */
  id: string;
  /** Display name of the data source */
  provider: string;
  /** Current connection status */
  status: 'active' | 'inactive' | 'error';
  /** Last sync time */
  lastSync?: string;
}

/**
 * Status of correlation analysis
 */
export type AnalysisStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Recommendation type based on health data analysis
 */
export type RecommendationType = 'nutrition' | 'activity' | 'medication' | 'sleep' | 'stress' | 'general';

/**
 * Icon type for recommendation display
 */
export type RecommendationIconType = 'nutrition' | 'activity' | 'medication' | 'sleep' | 'stress' | 'general';

/**
 * Impact level of a recommendation
 */
export type ImpactLevel = 'high' | 'medium' | 'low';

/**
 * Individual recommendation item
 */
export interface Recommendation {
  /** Unique identifier for the recommendation */
  id: string;
  /** Short title for the recommendation */
  title: string;
  /** Detailed description of the recommendation */
  description: string;
  /** Type category for grouping and filtering */
  type: RecommendationType;
  /** Icon to display with the recommendation */
  iconType: RecommendationIconType;
  /** Color theme for UI elements (should match design system) */
  color: string;
  /** Expected impact if implemented */
  impact: ImpactLevel;
  /** Action label for recommendation button */
  actionLabel: string;
  /** URL or action identifier for the recommendation */
  actionLink: string;
  /** Optional metadata for additional information */
  metadata?: Record<string, any>;
}
