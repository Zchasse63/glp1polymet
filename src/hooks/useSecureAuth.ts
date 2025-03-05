
import { useState, useEffect, useCallback } from 'react';
import { ErrorLogger } from '@/utils/errorHandling';
import { ErrorGroup } from '@/utils/errorHandling/types';

// Define the cookie options type
type CookieOptions = {
  path?: string;
  domain?: string;
  maxAge?: number;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
};

/**
 * Hook for secure authentication token management
 * Following CodeFarm Development Methodology:
 * - Sustainable Code: Centralized auth token management
 * - Security-First Approach: More secure than localStorage
 */
export function useSecureAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  
  // Initialize auth state on mount
  useEffect(() => {
    try {
      // Check for auth cookie
      const hasAuthCookie = document.cookie
        .split('; ')
        .some(cookie => cookie.startsWith('auth_session='));
        
      // Check for refresh token in memory
      const refreshToken = sessionStorage.getItem('refresh_token');
      
      setIsAuthenticated(hasAuthCookie || Boolean(refreshToken));
    } catch (error) {
      ErrorLogger.error(
        'Failed to initialize auth state',
        'AUTH_INIT_ERROR',
        {},
        error
      );
      setIsAuthenticated(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);
  
  /**
   * Set a secure cookie
   */
  const setCookie = useCallback((name: string, value: string, options: CookieOptions = {}) => {
    try {
      const defaultOptions: CookieOptions = {
        path: '/',
        secure: window.location.protocol === 'https:',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      };
      
      const cookieOptions = { ...defaultOptions, ...options };
      let cookieString = `${name}=${encodeURIComponent(value)}`;
      
      if (cookieOptions.path) cookieString += `; path=${cookieOptions.path}`;
      if (cookieOptions.domain) cookieString += `; domain=${cookieOptions.domain}`;
      if (cookieOptions.maxAge) cookieString += `; max-age=${cookieOptions.maxAge}`;
      if (cookieOptions.secure) cookieString += '; secure';
      if (cookieOptions.sameSite) cookieString += `; samesite=${cookieOptions.sameSite}`;
      
      // Note: httpOnly cookies can only be set by the server,
      // but we include this option for completeness
      if (cookieOptions.httpOnly) cookieString += '; httponly';
      
      document.cookie = cookieString;
      
      return true;
    } catch (error) {
      ErrorLogger.error(
        'Failed to set cookie',
        'COOKIE_SET_ERROR',
        { name },
        error,
        false
      );
      return false;
    }
  }, []);
  
  /**
   * Get a cookie by name
   */
  const getCookie = useCallback((name: string): string | null => {
    try {
      const cookies = document.cookie.split('; ');
      const cookie = cookies.find(c => c.startsWith(`${name}=`));
      
      if (!cookie) return null;
      
      return decodeURIComponent(cookie.split('=')[1]);
    } catch (error) {
      ErrorLogger.error(
        'Failed to get cookie',
        'COOKIE_GET_ERROR',
        { name },
        error,
        false
      );
      return null;
    }
  }, []);
  
  /**
   * Remove a cookie by name
   */
  const removeCookie = useCallback((name: string, options: Omit<CookieOptions, 'maxAge'> = {}) => {
    try {
      // To delete a cookie, set it with a maxAge of 0
      setCookie(name, '', { ...options, maxAge: 0 });
      return true;
    } catch (error) {
      ErrorLogger.error(
        'Failed to remove cookie',
        'COOKIE_REMOVE_ERROR',
        { name },
        error,
        false
      );
      return false;
    }
  }, [setCookie]);
  
  /**
   * Store auth tokens securely
   */
  const storeAuthTokens = useCallback((tokens: { accessToken: string; refreshToken: string }, rememberMe: boolean = false) => {
    try {
      // Store access token in a cookie (ideally would be httpOnly from server)
      setCookie('auth_session', tokens.accessToken, {
        secure: true,
        sameSite: 'strict',
        maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined // 30 days if remember me, otherwise session
      });
      
      // Store refresh token
      if (rememberMe) {
        // If remember me, store in a longer-lived cookie
        setCookie('refresh_token', tokens.refreshToken, {
          secure: true,
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 90 // 90 days
        });
      } else {
        // If not remember me, store in sessionStorage (memory only)
        sessionStorage.setItem('refresh_token', tokens.refreshToken);
      }
      
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      ErrorLogger.error(
        'Failed to store auth tokens',
        'AUTH_TOKEN_STORE_ERROR',
        {},
        error,
        true,
        'There was a problem logging in. Please try again.'
      );
      return false;
    }
  }, [setCookie]);
  
  /**
   * Clear all auth tokens
   */
  const clearAuthTokens = useCallback(() => {
    try {
      // Remove cookies
      removeCookie('auth_session');
      removeCookie('refresh_token');
      
      // Clear sessionStorage
      sessionStorage.removeItem('refresh_token');
      
      setIsAuthenticated(false);
      return true;
    } catch (error) {
      ErrorLogger.error(
        'Failed to clear auth tokens',
        'AUTH_TOKEN_CLEAR_ERROR',
        {},
        error,
        true,
        'There was a problem logging out. Please try again.'
      );
      return false;
    }
  }, [removeCookie]);
  
  /**
   * Get the current access token
   */
  const getAccessToken = useCallback((): string | null => {
    return getCookie('auth_session');
  }, [getCookie]);
  
  /**
   * Get the current refresh token
   */
  const getRefreshToken = useCallback((): string | null => {
    // Try cookie first
    const cookieToken = getCookie('refresh_token');
    if (cookieToken) return cookieToken;
    
    // Fall back to sessionStorage
    return sessionStorage.getItem('refresh_token');
  }, [getCookie]);
  
  /**
   * Generate anti-CSRF token for sensitive operations
   */
  const generateCsrfToken = useCallback((): string => {
    const token = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
                 
    // Store in sessionStorage
    sessionStorage.setItem('csrf_token', token);
    
    return token;
  }, []);
  
  /**
   * Validate a CSRF token
   */
  const validateCsrfToken = useCallback((token: string): boolean => {
    const storedToken = sessionStorage.getItem('csrf_token');
    
    if (!storedToken || storedToken !== token) {
      ErrorLogger.warning(
        'CSRF token validation failed',
        'CSRF_VALIDATION_ERROR',
        {},
        null,
        false
      );
      return false;
    }
    
    // Remove the token after use (one-time use)
    sessionStorage.removeItem('csrf_token');
    
    return true;
  }, []);
  
  return {
    isAuthenticated,
    authLoading,
    storeAuthTokens,
    clearAuthTokens,
    getAccessToken,
    getRefreshToken,
    generateCsrfToken,
    validateCsrfToken
  };
}
