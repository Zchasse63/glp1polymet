
/**
 * CSRF Protection Module
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First: Protection against Cross-Site Request Forgery attacks
 * - Modular Design: Standalone security component
 */

import { CSRFConfig } from './types';
import { ErrorLogger } from '../errorHandling';

// Default CSRF configuration
const defaultCSRFConfig: CSRFConfig = {
  cookieName: 'csrf_token',
  headerName: 'X-CSRF-Token',
  tokenLength: 32,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 3600 // 1 hour
  }
};

// Current configuration
let csrfConfig: CSRFConfig = { ...defaultCSRFConfig };

/**
 * Configure CSRF protection
 * @param config Custom CSRF configuration
 */
export function configureCSRF(config: Partial<CSRFConfig>): void {
  csrfConfig = { ...defaultCSRFConfig, ...config };
}

/**
 * Generate a random CSRF token
 * @returns Random token string
 */
function generateToken(): string {
  const array = new Uint8Array(csrfConfig.tokenLength);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Set CSRF token cookie
 * @param token CSRF token
 */
function setCSRFCookie(token: string): void {
  const { cookieName, cookieOptions } = csrfConfig;
  const expires = new Date(Date.now() + cookieOptions.maxAge * 1000).toUTCString();
  
  document.cookie = `${cookieName}=${token}; expires=${expires}; path=${cookieOptions.path}; ${
    cookieOptions.secure ? 'secure;' : ''
  } ${cookieOptions.httpOnly ? 'httpOnly;' : ''} samesite=${cookieOptions.sameSite}`;
}

/**
 * Get CSRF token from cookie
 * @returns CSRF token or null if not found
 */
function getCSRFCookieToken(): string | null {
  const { cookieName } = csrfConfig;
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  
  for (const cookie of cookies) {
    if (cookie.startsWith(`${cookieName}=`)) {
      return cookie.substring(cookieName.length + 1);
    }
  }
  
  return null;
}

/**
 * Initialize CSRF protection
 * @returns Whether initialization was successful
 */
export function initCSRFProtection(): boolean {
  try {
    // Only apply CSRF protection if running in browser
    if (typeof document === 'undefined') {
      return false;
    }
    
    // Generate and set token if not exists
    let token = getCSRFCookieToken();
    
    if (!token) {
      token = generateToken();
      setCSRFCookie(token);
    }
    
    console.log('CSRF protection initialized');
    return true;
  } catch (error) {
    ErrorLogger.error(
      'Failed to initialize CSRF protection',
      'CSRF_INIT_ERROR',
      { error }
    );
    return false;
  }
}

/**
 * Get CSRF token for use in requests
 * @returns CSRF token or null if not available
 */
export function getCSRFToken(): string | null {
  return getCSRFCookieToken();
}

/**
 * Add CSRF token to fetch options
 * @param options Fetch options object
 * @returns Updated fetch options with CSRF token
 */
export function addCSRFToken(options: RequestInit = {}): RequestInit {
  const token = getCSRFToken();
  
  if (!token) {
    console.warn('CSRF token not available');
    return options;
  }
  
  const headers = new Headers(options.headers || {});
  headers.append(csrfConfig.headerName, token);
  
  return {
    ...options,
    headers
  };
}

/**
 * Protect a fetch request with CSRF token
 * @param url URL to fetch
 * @param options Fetch options
 * @returns Promise resolving to fetch response
 */
export function protectedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const protectedOptions = addCSRFToken(options);
  return fetch(url, protectedOptions);
}
