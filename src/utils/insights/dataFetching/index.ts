
/**
 * Data Fetching Utilities for Insights
 * 
 * Following CodeFarm Development Methodology:
 * - Modular Architecture: Split functionality into focused modules
 * - Documentation: Clear documentation at module level
 */

// Re-export all data fetching utilities
export { getDaysFromTimePeriod } from './timePeriodUtils';
export { fetchHealthData } from './healthDataService';
export { fetchCorrelationData } from './correlationService';
