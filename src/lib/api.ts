
/**
 * API Client Module
 * 
 * Following CodeFarm Development Methodology:
 * - Sustainable Code: Consistent error handling and type safety
 * - Modular Design: Decoupled API layer for maintainability
 * - Continuous Learning: Flexible to accommodate changing requirements
 * 
 * This module provides a typed API client for making HTTP requests
 * with consistent error handling, retries, and logging.
 */

import { measureApiCall } from '@/utils/performanceMonitoring';
import { ErrorLogger, ErrorSeverity } from '@/utils/errorHandling';

// API error class for consistent error handling
export class ApiError extends Error {
  status: number;
  code: string;
  data?: any;
  
  constructor(message: string, status: number, code: string = 'UNKNOWN_ERROR', data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.data = data;
  }
}

// Request options type
export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  data?: any;
  cache?: RequestCache;
  retry?: number;
  retryDelay?: number;
  timeout?: number;
}

// Response type with helpers
export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
  ok: boolean;
}

// Main API client class
class ApiClient {
  private baseUrl: string;
  private defaultOptions: ApiRequestOptions;
  
  constructor(baseUrl: string = '', defaultOptions: ApiRequestOptions = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      retry: 1,
      retryDelay: 1000,
      timeout: 30000,
      ...defaultOptions
    };
  }
  
  // Set the base URL
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }
  
  // Set default options
  setDefaultOptions(options: ApiRequestOptions): void {
    this.defaultOptions = {
      ...this.defaultOptions,
      ...options,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      }
    };
  }
  
  // Set authentication token
  setAuthToken(token: string | null): void {
    const headers = { ...this.defaultOptions.headers } as Record<string, string>;
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete headers['Authorization'];
    }
    
    this.defaultOptions.headers = headers;
  }
  
  // Main request method with retries and error handling
  async request<T>(path: string, options: ApiRequestOptions = {}): Promise<ApiResponse<T>> {
    const url = this.buildUrl(path, options.params);
    const mergedOptions = this.mergeOptions(options);
    const { retry, retryDelay, timeout, ...fetchOptions } = mergedOptions;
    
    // Track request performance
    return measureApiCall(
      `API_${fetchOptions.method || 'GET'}_${path}`,
      this.executeRequest<T>(url, fetchOptions, retry || 0, retryDelay || 1000, timeout),
      { url, method: fetchOptions.method }
    );
  }
  
  // Execute a request with timeout and retries
  private async executeRequest<T>(
    url: string,
    options: RequestInit,
    retries: number,
    retryDelay: number,
    timeout?: number
  ): Promise<ApiResponse<T>> {
    try {
      // Create an AbortController for request timeout
      const controller = new AbortController();
      let timeoutId: number | undefined;
      
      if (timeout) {
        timeoutId = window.setTimeout(() => controller.abort(), timeout);
      }
      
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal
        });
        
        // Clear timeout if request completes
        if (timeoutId) clearTimeout(timeoutId);
        
        // Check if response is OK (status 200-299)
        if (response.ok) {
          // Parse response data
          let data: T;
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            data = await response.json();
          } else {
            // Handle non-JSON responses
            const text = await response.text();
            try {
              data = JSON.parse(text) as T;
            } catch {
              data = text as unknown as T;
            }
          }
          
          return {
            data,
            status: response.status,
            headers: response.headers,
            ok: true
          };
        }
        
        // Handle error responses
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          try {
            errorData = await response.text();
          } catch {
            errorData = null;
          }
        }
        
        const errorCode = errorData?.code || 'API_ERROR';
        const errorMessage = errorData?.message || `API request failed with status ${response.status}`;
        
        throw new ApiError(errorMessage, response.status, errorCode, errorData);
      } finally {
        // Ensure timeout is cleared
        if (timeoutId) clearTimeout(timeoutId);
      }
    } catch (error) {
      // Handle aborted requests (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'REQUEST_TIMEOUT');
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (retries > 0) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          
          // Retry the request with one less retry
          return this.executeRequest<T>(url, options, retries - 1, retryDelay, timeout);
        }
        
        throw new ApiError('Network error', 0, 'NETWORK_ERROR');
      }
      
      // Re-throw API errors
      if (error instanceof ApiError) {
        // Log API errors
        ErrorLogger.error(
          error.message,
          error.code,
          {
            url,
            method: options.method,
            status: error.status,
            data: error.data
          },
          error
        );
        
        throw error;
      }
      
      // Handle other errors
      const apiError = new ApiError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
        'UNKNOWN_ERROR',
        error
      );
      
      ErrorLogger.error(
        apiError.message,
        apiError.code,
        {
          url,
          method: options.method
        },
        error
      );
      
      throw apiError;
    }
  }
  
  // Build URL with query parameters
  private buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    let url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      }
      
      const queryString = queryParams.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    
    return url;
  }
  
  // Merge default options with request options
  private mergeOptions(options: ApiRequestOptions): ApiRequestOptions {
    const { data, ...rest } = options;
    
    const mergedOptions: ApiRequestOptions = {
      ...this.defaultOptions,
      ...rest,
      headers: {
        ...this.defaultOptions.headers,
        ...options.headers
      }
    };
    
    // Add request body if data is provided
    if (data !== undefined) {
      if (
        typeof data === 'object' && 
        data !== null && 
        !(data instanceof FormData) && 
        !(data instanceof Blob) &&
        !(data instanceof ArrayBuffer)
      ) {
        mergedOptions.body = JSON.stringify(data);
      } else {
        mergedOptions.body = data as BodyInit;
        
        // Remove Content-Type for FormData (let browser set it with boundary)
        if (data instanceof FormData) {
          const headers = mergedOptions.headers as Record<string, string>;
          delete headers['Content-Type'];
        }
      }
    }
    
    return mergedOptions;
  }
  
  // Convenience methods for common HTTP methods
  async get<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const response = await this.request<T>(path, {
      ...options,
      method: 'GET'
    });
    return response.data;
  }
  
  async post<T>(path: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    const response = await this.request<T>(path, {
      ...options,
      method: 'POST',
      data
    });
    return response.data;
  }
  
  async put<T>(path: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    const response = await this.request<T>(path, {
      ...options,
      method: 'PUT',
      data
    });
    return response.data;
  }
  
  async patch<T>(path: string, data?: any, options: ApiRequestOptions = {}): Promise<T> {
    const response = await this.request<T>(path, {
      ...options,
      method: 'PATCH',
      data
    });
    return response.data;
  }
  
  async delete<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    const response = await this.request<T>(path, {
      ...options,
      method: 'DELETE'
    });
    return response.data;
  }
}

// Create default API client instance
const api = new ApiClient('/api');

export default api;
