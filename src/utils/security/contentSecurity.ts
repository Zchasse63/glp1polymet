
import { ErrorLogger } from '../errorHandling';

/**
 * Content Security Module
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First: Protect against XSS and other content injection attacks
 * - Sustainable Code: Centralized security controls
 */

// CSP configuration for different environments
export interface CSPConfig {
  defaultSrc: string[];
  scriptSrc: string[];
  styleSrc: string[];
  imgSrc: string[];
  connectSrc: string[];
  fontSrc: string[];
  objectSrc: string[];
  mediaSrc: string[];
  frameSrc: string[];
  reportUri?: string;
  reportOnly: boolean;
}

// Default CSP Configuration
const cspConfig: Record<'development' | 'production', CSPConfig> = {
  development: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Looser in dev for hot reloading
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "https://api.dicebear.com"],
    connectSrc: ["'self'", "ws:", "wss:", "https://xngupqmwtbncjkegbhys.supabase.co"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'self'"],
    reportOnly: true
  },
  production: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'"],
    styleSrc: ["'self'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "https://api.dicebear.com"],
    connectSrc: ["'self'", "https://xngupqmwtbncjkegbhys.supabase.co"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'self'"],
    reportUri: "/api/csp-report",
    reportOnly: false
  }
};

/**
 * Initialize Content Security Policy
 * @param environment The current environment
 */
export function initContentSecurity(environment: 'development' | 'production' = 'production'): void {
  try {
    // Only apply CSP if running in browser
    if (typeof document === 'undefined') {
      return;
    }
    
    const config = cspConfig[environment];
    
    // Build CSP string
    const cspString = [
      `default-src ${config.defaultSrc.join(' ')}`,
      `script-src ${config.scriptSrc.join(' ')}`,
      `style-src ${config.styleSrc.join(' ')}`,
      `img-src ${config.imgSrc.join(' ')}`,
      `connect-src ${config.connectSrc.join(' ')}`,
      `font-src ${config.fontSrc.join(' ')}`,
      `object-src ${config.objectSrc.join(' ')}`,
      `media-src ${config.mediaSrc.join(' ')}`,
      `frame-src ${config.frameSrc.join(' ')}`,
    ].join('; ');
    
    // Create meta tag for CSP
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
    metaTag.content = cspString;
    
    // Add report-uri if specified
    if (config.reportUri) {
      metaTag.content += `; report-uri ${config.reportUri}`;
    }
    
    // Add meta tag to head
    document.head.appendChild(metaTag);
    
    console.log(`Content Security Policy (${environment}) initialized`);
  } catch (error) {
    ErrorLogger.error(
      'Failed to initialize Content Security Policy',
      'CSP_INIT_ERROR',
      { error, environment }
    );
  }
}

/**
 * Sanitize HTML content to prevent XSS
 * @param html HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHTML(html: string): string {
  try {
    // Use DOMPurify if available
    if (typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(html);
    }
    
    // Fallback basic sanitization
    const element = document.createElement('div');
    element.textContent = html;
    return element.innerHTML;
  } catch (error) {
    ErrorLogger.warning(
      'HTML sanitization failed, returning empty string',
      'HTML_SANITIZE_ERROR',
      { error }
    );
    return '';
  }
}

/**
 * Validate a URL for safety
 * @param url URL to validate
 * @param allowedProtocols List of allowed protocols
 * @returns Whether the URL is safe
 */
export function isUrlSafe(url: string, allowedProtocols: string[] = ['https:', 'http:']): boolean {
  try {
    const parsedUrl = new URL(url);
    return allowedProtocols.includes(parsedUrl.protocol);
  } catch (error) {
    return false;
  }
}
