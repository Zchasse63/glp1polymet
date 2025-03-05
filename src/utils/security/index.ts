
/**
 * Security Utils Index
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First: Centralized security controls
 * - Modular Design: Composable security features
 */

// Export content security utilities
export { 
  initContentSecurity,
  sanitizeHTML,
  isUrlSafe
} from './contentSecurity';

// Export CSRF protection utilities
export {
  initCSRFProtection,
  getCSRFToken
} from './csrfProtection';

// Export input sanitization utilities
export {
  sanitizeInput,
  validateEmail,
  validatePhone,
  validateUrl
} from './inputSanitization';

// Export secure storage utilities
export {
  secureStore,
  secureRetrieve,
  secureDelete,
  clearSecureStorage
} from './secureStorage';

// Export types
export * from './types';

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
