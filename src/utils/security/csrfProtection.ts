
/**
 * CSRF Protection Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Prevent cross-site request forgery attacks
 * - User-Centric Design: Transparent protection without disrupting UX
 */

import { CSRFConfig, SecurityLevel } from './types';

// Default CSRF configuration
let csrfConfig: CSRFConfig = {
  cookieName: 'csrf_token',
  headerName: 'X-CSRF-Token',
  tokenLength: 32,
  cookieOptions: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 86400 // 24 hours
  }
};

// Configure CSRF protection
export function configureCSRF(config: Partial<CSRFConfig>): void {
  csrfConfig = { ...csrfConfig, ...config };
}

// Generate a new CSRF token
export function generateCSRFToken(): string {
  const array = new Uint8Array(csrfConfig.tokenLength);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Get the current CSRF token
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  return document.cookie
    .split('; ')
    .find(row => row.startsWith(`${csrfConfig.cookieName}=`))
    ?.split('=')[1] || null;
}

// Add a CSRF token to a request
export function addCSRFToken(headers: Headers | Record<string, string>): Headers | Record<string, string> {
  const token = getCSRFToken();
  
  if (!token) return headers;
  
  if (headers instanceof Headers) {
    headers.append(csrfConfig.headerName, token);
    return headers;
  } else {
    return {
      ...headers,
      [csrfConfig.headerName]: token
    };
  }
}

// Create a fetch wrapper with CSRF protection
export function createCSRFProtectedFetch(
  originalFetch: typeof fetch = window.fetch
): typeof fetch {
  return (input: RequestInfo | URL, init?: RequestInit) => {
    const modifiedInit = { ...init };
    
    if (!modifiedInit.headers) {
      modifiedInit.headers = {};
    }
    
    // Fix: Explicitly handle the headers as either Headers or Record<string, string>
    if (modifiedInit.headers instanceof Headers) {
      // It's already a Headers object, use it directly
      addCSRFToken(modifiedInit.headers);
    } else {
      // It's a record object or HeadersInit, convert to Record<string, string>
      modifiedInit.headers = {
        ...(typeof modifiedInit.headers === 'object' ? Object.fromEntries(
          Object.entries(modifiedInit.headers)
        ) : {}),
        [csrfConfig.headerName]: getCSRFToken() || ''
      };
    }
    
    return originalFetch(input, modifiedInit);
  };
}

// Initialize CSRF protection
export function initCSRFProtection(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  // Generate and set a CSRF token if one doesn't exist
  if (!getCSRFToken()) {
    const token = generateCSRFToken();
    const cookieOptions = Object.entries(csrfConfig.cookieOptions)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
    
    document.cookie = `${csrfConfig.cookieName}=${token}; ${cookieOptions}`;
  }
  
  // Override the global fetch with a CSRF-protected version
  const originalFetch = window.fetch;
  window.fetch = createCSRFProtectedFetch(originalFetch);
}
