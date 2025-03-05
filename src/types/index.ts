
/**
 * Central Types Index
 * 
 * This file consolidates and re-exports all type definitions
 * from across the application to provide a single entry point
 * for type imports.
 */

// Re-export all types from domain-specific type files
export * from './insightTypes';
export * from './healthMetrics';
export * from './authentication';
export * from './medication';
export * from './integration';

// Global utility types

/**
 * Represents a response from an API
 */
export type ApiResponse<T> = {
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  status: 'success' | 'error' | 'loading';
};

/**
 * Represents a paginated response
 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
  };
};

/**
 * Represents a date range for filtering data
 */
export type DateRange = {
  startDate: string;
  endDate: string;
};

/**
 * Represents a theme in the application
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Represents user preferences
 */
export type UserPreferences = {
  theme: Theme;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
  privacySettings: {
    shareData: boolean;
    anonymizedResearch: boolean;
  };
  displayUnits: {
    weight: 'kg' | 'lbs';
    height: 'cm' | 'ft';
    temperature: 'c' | 'f';
    glucose: 'mmol/L' | 'mg/dL';
  };
};
