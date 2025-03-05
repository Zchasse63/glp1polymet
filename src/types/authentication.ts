
/**
 * Authentication Types
 * 
 * Following CodeFarm architecture principles:
 * - Strong Typing: Comprehensive type definitions
 * - Documentation: Detailed JSDoc comments
 * - Modularity: Separation of concerns
 */

/**
 * User authentication state
 */
export type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

/**
 * User authentication methods
 */
export type AuthMethod = 'email' | 'google' | 'github' | 'sso' | 'apple';

/**
 * Basic user profile information from auth provider
 */
export interface UserProfile {
  /** Unique user identifier */
  id: string;
  /** User's display name */
  displayName?: string;
  /** User's email address */
  email?: string;
  /** URL to user's avatar image */
  avatarUrl?: string;
  /** Last sign in timestamp */
  lastSignIn?: string;
  /** Authentication method used */
  authMethod?: AuthMethod;
}

/**
 * Registration form data structure
 */
export interface RegisterFormData {
  /** User's full name */
  name: string;
  /** User's email address */
  email: string;
  /** User's chosen password */
  password: string;
  /** Password confirmation for validation */
  confirmPassword: string;
  /** Whether terms and conditions were accepted */
  termsAccepted: boolean;
  /** Whether marketing emails were opted into */
  marketingEmails?: boolean;
}

/**
 * Authentication error types
 */
export type AuthErrorType = 
  | 'invalid_credentials'
  | 'user_not_found'
  | 'email_in_use'
  | 'weak_password'
  | 'expired_session'
  | 'network_error'
  | 'unknown';

/**
 * Authentication error details
 */
export interface AuthError {
  /** Type of error that occurred */
  type: AuthErrorType;
  /** Human-readable error message */
  message: string;
  /** Original error object or details */
  details?: any;
}

/**
 * User permission levels
 */
export type UserRole = 'admin' | 'user' | 'premium' | 'trial';

/**
 * User permissions for different features
 */
export interface UserPermissions {
  /** Can access premium insights */
  viewPremiumInsights: boolean;
  /** Can export data */
  exportData: boolean;
  /** Can access advanced correlations */
  advancedCorrelations: boolean;
  /** Can integrate with third-party services */
  thirdPartyIntegrations: boolean;
  /** Can access beta features */
  betaFeatures: boolean;
}

/**
 * Authentication context state
 */
export interface AuthState {
  /** Current authentication status */
  status: AuthStatus;
  /** User profile if authenticated */
  user: UserProfile | null;
  /** User role */
  role: UserRole | null;
  /** User permissions */
  permissions: UserPermissions | null;
  /** Last authentication error */
  error: AuthError | null;
  /** Whether authentication is in progress */
  isLoading: boolean;
}

/**
 * Login form data structure
 */
export interface LoginFormData {
  email: string;
  password: string;
}

/**
 * Login form props
 */
export interface LoginFormProps {
  onSuccess: () => void;
}

/**
 * Register form props
 */
export interface RegisterFormProps {
  onSuccess: () => void;
}
