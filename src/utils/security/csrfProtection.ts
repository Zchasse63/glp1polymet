
/**
 * CSRF Protection
 * 
 * Cross-Site Request Forgery protection utilities
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Robust CSRF defenses
 * - Modularity: Isolated, reusable implementation
 */

import { CSRFConfig } from './types';

// Default CSRF configuration
const defaultCSRFConfig: CSRFConfig = {
  cookieName: 'XSRF-TOKEN',
  headerName: 'X-XSRF-TOKEN',
  tokenLength: 32,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 86400 // 24 hours
  }
};

// Current configuration
let csrfConfig: CSRFConfig = { ...defaultCSRFConfig };

/**
 * Configure CSRF protection
 * @param config CSRF configuration options
 */
export function configureCSRF(config: Partial<CSRFConfig> = {}): void {
  csrfConfig = {
    ...defaultCSRFConfig,
    ...config,
    cookieOptions: {
      ...defaultCSRFConfig.cookieOptions,
      ...(config.cookieOptions || {})
    }
  };
}

/**
 * Generate a random CSRF token
 * @param length Length of the token
 * @returns Random token string
 */
export function generateCSRFToken(length: number = csrfConfig.tokenLength): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  // Use crypto API if available for better randomness
  if (window.crypto && window.crypto.getRandomValues) {
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    
    for (let i = 0; i < length; i++) {
      token += charset[values[i] % charset.length];
    }
  } else {
    // Fallback to Math.random() if crypto API not available
    for (let i = 0; i < length; i++) {
      token += charset[Math.floor(Math.random() * charset.length)];
    }
  }
  
  return token;
}

/**
 * Store CSRF token in a cookie
 * @param token CSRF token to store
 */
export function storeCSRFToken(token: string): void {
  const { cookieName, cookieOptions } = csrfConfig;
  const expires = new Date(Date.now() + cookieOptions.maxAge * 1000).toUTCString();
  
  // Create cookie with security options
  document.cookie = `${cookieName}=${token}; path=${cookieOptions.path}; expires=${expires}; ${
    cookieOptions.secure ? 'secure;' : ''
  } ${cookieOptions.httpOnly ? 'httpOnly;' : ''} SameSite=${cookieOptions.sameSite}`;
}

/**
 * Retrieve CSRF token from cookies
 * @returns CSRF token or null if not found
 */
export function getCSRFToken(): string | null {
  const { cookieName } = csrfConfig;
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === cookieName) {
      return value;
    }
  }
  
  return null;
}

/**
 * Initialize CSRF protection by generating and storing a token
 * @returns The generated CSRF token
 */
export function initCSRFProtection(): string {
  const token = generateCSRFToken();
  storeCSRFToken(token);
  return token;
}

/**
 * Add CSRF token to a request headers object
 * @param headers Request headers object
 * @returns Updated headers object with CSRF token
 */
export function addCSRFToken(headers: Record<string, string> = {}): Record<string, string> {
  const token = getCSRFToken();
  
  if (token) {
    return {
      ...headers,
      [csrfConfig.headerName]: token
    };
  }
  
  return headers;
}

/**
 * Create a fetch wrapper that automatically adds CSRF tokens
 * @returns Enhanced fetch function with CSRF protection
 */
export function createCSRFProtectedFetch(): typeof fetch {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    // Get current CSRF token
    const token = getCSRFToken();
    
    if (!token) {
      // Initialize new token if none exists
      initCSRFProtection();
    }
    
    // Clone and modify the request init object
    const enhancedInit: RequestInit = {
      ...init,
      headers: {
        ...(init?.headers || {}),
        [csrfConfig.headerName]: getCSRFToken() || initCSRFProtection()
      }
    };
    
    // Call original fetch with enhanced init
    return fetch(input, enhancedInit);
  };
}
