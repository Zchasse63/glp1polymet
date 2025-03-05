
/**
 * Content Security Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Comprehensive protection against XSS and injection
 * - Adaptable: Different policies for different environments
 */

// Generate a strict Content Security Policy (CSP) for production
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
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join('; ');
}

// Generate a moderate CSP for staging
export function generateModerateCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // More permissive for testing
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https:",
    "media-src 'self'",
    "object-src 'none'",
    "frame-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'"
  ].join('; ');
}

// Generate a permissive CSP for development
export function generateDevCSP(): string {
  return [
    "default-src * 'unsafe-inline' 'unsafe-eval'",
    "img-src * data: blob:",
    "font-src * data:",
    "connect-src *",
    "frame-src *"
  ].join('; ');
}

// Apply a CSP to the document
export function applyCSP(policy: string): void {
  if (typeof document === 'undefined') return;
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = policy;
  document.head.appendChild(meta);
}

// Apply iframe protection
export function applyIframeProtection(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  // Prevent this site from being embedded in iframes on other domains
  const meta = document.createElement('meta');
  meta.httpEquiv = 'X-Frame-Options';
  meta.content = 'SAMEORIGIN';
  document.head.appendChild(meta);
  
  // Modern approach using CSP frame-ancestors
  const cspMeta = document.createElement('meta');
  cspMeta.httpEquiv = 'Content-Security-Policy';
  cspMeta.content = "frame-ancestors 'self'";
  document.head.appendChild(cspMeta);
  
  // Attempt to break out of iframes if somehow embedded
  if (window.top !== window.self) {
    window.top.location = window.self.location;
  }
}

// Initialize content security based on environment
export function initContentSecurity(environment: 'development' | 'production' = 'production'): void {
  if (typeof document === 'undefined') return;
  
  // Apply the appropriate CSP based on environment
  if (environment === 'development') {
    applyCSP(generateDevCSP());
  } else {
    applyCSP(generateStrictCSP());
    applyIframeProtection();
  }
  
  // Add additional security headers
  if (typeof document !== 'undefined') {
    // Prevent MIME type sniffing
    const noSniff = document.createElement('meta');
    noSniff.httpEquiv = 'X-Content-Type-Options';
    noSniff.content = 'nosniff';
    document.head.appendChild(noSniff);
    
    // Enable XSS protection in older browsers
    const xssProtection = document.createElement('meta');
    xssProtection.httpEquiv = 'X-XSS-Protection';
    xssProtection.content = '1; mode=block';
    document.head.appendChild(xssProtection);
    
    // Strict transport security
    const hsts = document.createElement('meta');
    hsts.httpEquiv = 'Strict-Transport-Security';
    hsts.content = 'max-age=31536000; includeSubDomains; preload';
    document.head.appendChild(hsts);
  }
}
