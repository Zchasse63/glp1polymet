
/**
 * Security Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Comprehensive security utilities
 * - Modular Architecture: Segregated security concerns
 * - Documentation: Clear security capabilities
 */

// Re-export security types
export {
  SecurityLevel,
  type CSRFConfig,
  type StorageEncryptionConfig,
  type SanitizationConfig
} from './types';

// Re-export input sanitization utilities
export {
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeForDatabase,
  configureSanitizer
} from './inputSanitization';

// Re-export CSRF protection utilities
export {
  configureCSRF,
  generateCSRFToken,
  getCSRFToken,
  initCSRFProtection,
  addCSRFToken,
  createCSRFProtectedFetch
} from './csrfProtection';

// Re-export secure storage utilities
export {
  configureSecureStorage,
  secureLocalStorage,
  getFromSecureLocalStorage,
  removeFromSecureLocalStorage,
  secureSessionStorage,
  getFromSecureSessionStorage,
  removeFromSecureSessionStorage
} from './secureStorage';

// Re-export content security utilities
export {
  applyCSP,
  generateStrictCSP,
  generateModerateCSP,
  generateDevCSP,
  applyIframeProtection,
  initContentSecurity
} from './contentSecurity';

/**
 * Initialize all security features
 * @param environment Application environment
 */
export function initSecurity(environment: 'development' | 'production' = 'production'): void {
  // Initialize CSRF protection
  initCSRFProtection();
  
  // Initialize content security
  initContentSecurity(environment);
}
