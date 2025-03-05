
/**
 * Content Security Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Implement content security policies
 * - User-Centric Design: Secure experience without disrupting UX
 */

// Generate a strict Content Security Policy
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

// Generate a moderate Content Security Policy (more permissive)
export function generateModerateCSP(): string {
  return [
    "default-src 'self'",
    "script-src 'self' https: 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' https: 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' https:",
    "connect-src 'self' https:",
    "media-src 'self' https:",
    "object-src 'none'",
    "frame-src 'self' https:",
    "base-uri 'self'",
    "form-action 'self' https:",
    "frame-ancestors 'self'"
  ].join('; ');
}

// Generate a development Content Security Policy (very permissive)
export function generateDevCSP(): string {
  return [
    "default-src * 'unsafe-inline' 'unsafe-eval'",
    "script-src * 'unsafe-inline' 'unsafe-eval'",
    "style-src * 'unsafe-inline'",
    "img-src * data: blob:",
    "font-src * data:",
    "connect-src * ws: wss:",
    "media-src *",
    "object-src *",
    "frame-src *",
    "base-uri *",
    "form-action *",
    "frame-ancestors *"
  ].join('; ');
}

// Apply a Content Security Policy to the document
export function applyCSP(policy: string): void {
  if (typeof document === 'undefined') return;
  
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = policy;
  document.head.appendChild(meta);
}

// Apply iframe protection
export function applyIframeProtection(): void {
  if (typeof window === 'undefined') return;
  
  if (window.self !== window.top) {
    // If the page is loaded in an iframe, you can take protective measures
    // like redirecting to the top level or displaying a warning
    window.top.location.href = window.self.location.href;
  }
}

// Initialize content security features
export function initContentSecurity(environment: 'development' | 'production' = 'production'): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  // Apply the appropriate CSP based on environment
  if (environment === 'development') {
    applyCSP(generateDevCSP());
  } else {
    applyCSP(generateStrictCSP());
  }
  
  // Apply iframe protection
  applyIframeProtection();
}
