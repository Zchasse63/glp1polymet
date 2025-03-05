
/**
 * Integration Types
 * 
 * Following CodeFarm architecture principles:
 * - Strong Typing: Comprehensive type definitions
 * - Documentation: Detailed JSDoc comments
 * - Modularity: Separation of concerns
 */

/**
 * Available health data integration providers
 */
export type IntegrationProvider = 
  | 'apple_health'
  | 'google_fit'
  | 'fitbit'
  | 'garmin'
  | 'whoop'
  | 'oura'
  | 'withings'
  | 'myfitnesspal'
  | 'strava'
  | 'peloton'
  | 'freestyle_libre'
  | 'dexcom'
  | 'manual';

/**
 * Status of integration connection
 */
export type IntegrationStatus = 
  | 'connected'
  | 'disconnected'
  | 'error'
  | 'pending'
  | 'expired';

/**
 * Data types available from integrations
 */
export type IntegrationDataType = 
  | 'weight'
  | 'activity'
  | 'steps'
  | 'sleep'
  | 'heart_rate'
  | 'blood_pressure'
  | 'glucose'
  | 'nutrition'
  | 'medication'
  | 'water'
  | 'workout';

/**
 * Permission scope for integration data access
 */
export type IntegrationScope = 
  | 'read'
  | 'write'
  | 'read_write';

/**
 * Integration connection details
 */
export interface IntegrationConnection {
  /** Unique identifier */
  id: string;
  /** User who owns this connection */
  userId: string;
  /** Integration provider */
  provider: IntegrationProvider;
  /** Current status */
  status: IntegrationStatus;
  /** When connection was established */
  connectedAt: string;
  /** When connection was last synced */
  lastSyncedAt?: string;
  /** When connection expires (if applicable) */
  expiresAt?: string;
  /** Error message if status is 'error' */
  errorMessage?: string;
  /** Access token (should be stored securely) */
  accessToken?: string;
  /** Refresh token (should be stored securely) */
  refreshToken?: string;
  /** Data types authorized for this connection */
  authorizedDataTypes: IntegrationDataType[];
  /** Permission scopes granted */
  scopes: IntegrationScope[];
  /** Provider-specific settings */
  settings?: Record<string, any>;
}

/**
 * Integration data sync options
 */
export interface SyncOptions {
  /** Whether to force a full sync */
  forceFullSync?: boolean;
  /** Start date for sync range */
  startDate?: string;
  /** End date for sync range */
  endDate?: string;
  /** Specific data types to sync */
  dataTypes?: IntegrationDataType[];
  /** Whether to overwrite existing data */
  overwriteExisting?: boolean;
}

/**
 * Integration sync result
 */
export interface SyncResult {
  /** Whether sync was successful */
  success: boolean;
  /** Data types that were synced */
  syncedDataTypes: IntegrationDataType[];
  /** Number of new records added */
  newRecords: number;
  /** Number of existing records updated */
  updatedRecords: number;
  /** Errors that occurred during sync */
  errors?: {
    dataType: IntegrationDataType;
    message: string;
  }[];
  /** When sync was started */
  startedAt: string;
  /** When sync was completed */
  completedAt: string;
}

/**
 * Data sharing consent for integrations
 */
export interface DataSharingConsent {
  /** User who provided consent */
  userId: string;
  /** Integration provider */
  provider: IntegrationProvider;
  /** Data types user has consented to share */
  consentedDataTypes: IntegrationDataType[];
  /** Whether data can be used for research */
  researchConsent: boolean;
  /** Whether data can be shared with third parties */
  thirdPartyConsent: boolean;
  /** When consent was given */
  consentDate: string;
}
