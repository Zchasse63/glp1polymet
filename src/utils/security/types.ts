
/**
 * Security Types
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Define strong types for security utilities
 * - Documentation: Clear interface definitions
 */

// CSRF Token configuration
export interface CSRFConfig {
  cookieName: string;
  headerName: string;
  tokenLength: number;
  cookieOptions: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    path: string;
    maxAge: number;
  };
}

// Storage encryption configuration
export interface StorageEncryptionConfig {
  algorithm: string;
  secretKey: string;
  ivLength: number;
}

// Input sanitization configuration
export interface SanitizationConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  disallowedTagsMode: 'escape' | 'remove' | 'recursiveEscape';
}

// Security level for different operations
export enum SecurityLevel {
  LOW = 'low',        // Basic protection
  MEDIUM = 'medium',  // Standard protection
  HIGH = 'high',      // Enhanced protection
  CRITICAL = 'critical' // Maximum protection
}
