
/**
 * Security Utils Index
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First: Centralized security controls
 * - Modular Design: Composable security features
 */

// Import content security utilities
import { 
  initContentSecurity,
  sanitizeHTML,
  isUrlSafe
} from './contentSecurity';

// Import CSRF protection utilities
import {
  initCSRFProtection,
  getCSRFToken,
  addCSRFToken,
  protectedFetch,
  configureCSRF
} from './csrfProtection';

// Import input sanitization utilities
import {
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateUrl,
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeForDatabase,
  configureSanitizer
} from './inputSanitization';

// Import secure storage utilities
import {
  secureStore,
  secureRetrieve,
  secureDelete,
  clearSecureStorage,
  secureLocalStorage,
  getFromSecureLocalStorage,
  removeFromSecureLocalStorage,
  configureSecureStorage
} from './secureStorage';

// Export types
export * from './types';

// Re-export all utility functions
export {
  // Content security exports
  initContentSecurity,
  sanitizeHTML,
  isUrlSafe,
  
  // CSRF protection exports
  initCSRFProtection,
  getCSRFToken,
  addCSRFToken,
  protectedFetch,
  configureCSRF,
  
  // Input sanitization exports
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateUrl,
  sanitizeHtml,
  sanitizeText,
  sanitizeUrl,
  sanitizeEmail,
  sanitizeForDatabase,
  configureSanitizer,
  
  // Secure storage exports
  secureStore,
  secureRetrieve,
  secureDelete,
  clearSecureStorage,
  secureLocalStorage,
  getFromSecureLocalStorage,
  removeFromSecureLocalStorage,
  configureSecureStorage
};

/**
 * Initialize all security features
 * @param environment Application environment
 */
export function initSecurity(environment: 'development' | 'production' = 'production'): void {
  // Initialize CSRF protection
  initCSRFProtection();
  
  // Initialize content security policy
  initContentSecurity(environment);
  
  console.log(`Security initialized (${environment} mode)`);
}
