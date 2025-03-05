
import { ErrorLogger } from '../errorHandling';

/**
 * CSRF Protection Module
 * 
 * Following CodeFarm Development Methodology:
 * - Security-First: Protection against CSRF attacks
 * - User-Centric Design: Transparent protection with minimal user impact
 */

// Configuration for CSRF protection
export interface CSRFConfig {
  tokenKey: string;
  headerName: string;
  cookieName: string;
  refreshThreshold: number; // in seconds
}

// Default configuration
const csrfConfig: CSRFConfig = {
  tokenKey: 'csrf_token',
  headerName: 'X-CSRF-Token',
  cookieName: 'csrf',
  refreshThreshold: 30 * 60 // 30 minutes
};

/**
 * Generate a new CSRF token
 * @returns New CSRF token
 */
function generateCSRFToken(): string {
  // Generate a random token
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get the current CSRF token, generating a new one if needed
 * @returns CSRF token
 */
export function getCSRFToken(): string | null {
  try {
    // Check if token exists in localStorage
    let token = localStorage.getItem(csrfConfig.tokenKey);
    const timestamp = localStorage.getItem(`${csrfConfig.tokenKey}_time`);
    
    // If token doesn't exist or is expired, generate a new one
    if (!token || !timestamp || isTokenExpired(parseInt(timestamp, 10))) {
      token = generateCSRFToken();
      setCSRFToken(token);
    }
    
    return token;
  } catch (error) {
    ErrorLogger.warning(
      'Failed to get CSRF token',
      'CSRF_TOKEN_ERROR',
      { error }
    );
    return null;
  }
}

/**
 * Set a new CSRF token
 * @param token CSRF token
 */
function setCSRFToken(token: string): void {
  try {
    localStorage.setItem(csrfConfig.tokenKey, token);
    localStorage.setItem(`${csrfConfig.tokenKey}_time`, Date.now().toString());
    
    // Also set as a cookie for server-side validation
    document.cookie = `${csrfConfig.cookieName}=${token}; path=/; SameSite=Strict; Secure`;
  } catch (error) {
    ErrorLogger.warning(
      'Failed to set CSRF token',
      'CSRF_TOKEN_ERROR',
      { error }
    );
  }
}

/**
 * Check if a token is expired
 * @param timestamp Token timestamp
 * @returns Whether token is expired
 */
function isTokenExpired(timestamp: number): boolean {
  const expirationTime = timestamp + (csrfConfig.refreshThreshold * 1000);
  return Date.now() > expirationTime;
}

/**
 * Add CSRF token to headers
 * @param headers Headers object to add token to
 */
function addCSRFToken(headers: Headers): void {
  const token = getCSRFToken();
  if (token) {
    headers.set(csrfConfig.headerName, token);
  }
}

/**
 * Intercept fetch requests to add CSRF token
 */
function interceptFetchRequests(): void {
  const originalFetch = window.fetch;
  
  window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Clone the init object to avoid modifying the original
    const modifiedInit: RequestInit = init ? { ...init } : {};
    
    // Only add CSRF token for requests to same origin
    if (typeof input === 'string' && (input.startsWith('/') || input.startsWith(window.location.origin))) {
      // Initialize headers if they don't exist
      if (!modifiedInit.headers) {
        modifiedInit.headers = new Headers();
      }
      
      // Handle the headers based on their type
      if (modifiedInit.headers instanceof Headers) {
        addCSRFToken(modifiedInit.headers);
      } else {
        // Convert HeadersInit to Record<string, string> safely
        const headerRecord: Record<string, string> = {};
        
        // Handle different types of HeadersInit
        if (Array.isArray(modifiedInit.headers)) {
          // It's an array of [name, value] pairs
          modifiedInit.headers.forEach(([key, value]) => {
            headerRecord[key] = value;
          });
        } else {
          // It's a record object
          Object.entries(modifiedInit.headers).forEach(([key, value]) => {
            headerRecord[key] = value;
          });
        }
        
        // Add CSRF token
        modifiedInit.headers = {
          ...headerRecord,
          [csrfConfig.headerName]: getCSRFToken() || ''
        };
      }
    }
    
    return originalFetch.call(window, input, modifiedInit);
  };
}

/**
 * Initialize CSRF protection
 */
export function initCSRFProtection(): void {
  try {
    // Generate initial token
    getCSRFToken();
    
    // Intercept fetch requests
    interceptFetchRequests();
    
    console.log('CSRF protection initialized');
  } catch (error) {
    ErrorLogger.error(
      'Failed to initialize CSRF protection',
      'CSRF_INIT_ERROR',
      { error }
    );
  }
}
