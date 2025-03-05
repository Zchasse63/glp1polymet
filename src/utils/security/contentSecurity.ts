
/**
 * Content Security
 * 
 * Utilities for implementing and managing Content Security Policy
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Robust content security
 * - User-Centric Design: Balance security with functionality
 */

/**
 * Apply Content Security Policy meta tag to document head
 * @param policy CSP policy string
 */
export function applyCSP(policy: string): void {
  // Check if a CSP meta tag already exists
  const existingTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
  
  if (existingTag) {
    // Update existing tag
    existingTag.setAttribute('content', policy);
  } else {
    // Create new meta tag
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'Content-Security-Policy');
    metaTag.setAttribute('content', policy);
    document.head.appendChild(metaTag);
  }
}

/**
 * Generate a default strict Content Security Policy
 * @returns CSP policy string
 */
export function generateStrictCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https:",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'self'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

/**
 * Generate a moderate Content Security Policy suitable for most apps
 * @returns CSP policy string
 */
export function generateModerateCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https:",
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: https:",
    "font-src 'self' data: https:",
    "connect-src 'self' https:",
    "media-src 'self' https:",
    "object-src 'none'",
    "frame-src 'self' https:",
    "frame-ancestors 'self'",
    "form-action 'self' https:",
    "base-uri 'self'",
    "upgrade-insecure-requests",
  ].join('; ');
}

/**
 * Generate a development-friendly Content Security Policy
 * @returns CSP policy string
 */
export function generateDevCSP(): string {
  return [
    "default-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
    "connect-src * 'unsafe-inline' 'unsafe-eval' data: blob:",
  ].join('; ');
}

/**
 * Apply security headers for iframe protection
 */
export function applyIframeProtection(): void {
  // X-Frame-Options
  const xFrameOptions = document.createElement('meta');
  xFrameOptions.setAttribute('http-equiv', 'X-Frame-Options');
  xFrameOptions.setAttribute('content', 'SAMEORIGIN');
  document.head.appendChild(xFrameOptions);
  
  // Referrer-Policy
  const referrerPolicy = document.createElement('meta');
  referrerPolicy.setAttribute('name', 'referrer');
  referrerPolicy.setAttribute('content', 'strict-origin-when-cross-origin');
  document.head.appendChild(referrerPolicy);
  
  // X-Content-Type-Options
  const contentTypeOptions = document.createElement('meta');
  contentTypeOptions.setAttribute('http-equiv', 'X-Content-Type-Options');
  contentTypeOptions.setAttribute('content', 'nosniff');
  document.head.appendChild(contentTypeOptions);
}

/**
 * Initialize content security for the application
 * @param environment Application environment
 */
export function initContentSecurity(environment: 'development' | 'production' = 'production'): void {
  // Apply appropriate CSP based on environment
  if (environment === 'development') {
    applyCSP(generateDevCSP());
  } else {
    applyCSP(generateModerateCSP());
  }
  
  // Apply iframe protection
  applyIframeProtection();
}
