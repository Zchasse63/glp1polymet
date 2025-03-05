
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
