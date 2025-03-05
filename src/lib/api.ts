import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { EventCategory, EventPriority, trackFeatureUsage, trackError } from '@/utils/eventTracking';

// Utility type to make certain properties required
type RequireAtLeastOne<T, Keys extends keyof T = keyof T> =
    Pick<T, Exclude<keyof T, Keys>>
    & { [K in Keys]-?: Pick<T, K> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys]

type ApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD';
  headers?: Record<string, string>;
  json?: any;
  formData?: FormData;
  query?: Record<string, string | number | boolean | undefined>;
  skipAuthRefresh?: boolean;
  skipJsonParse?: boolean;
  timeout?: number; // Timeout in milliseconds
};

type ApiCallArgs = [string] | [string, ApiOptions];

/**
 * Centralized API client for making HTTP requests.
 * @param {string} url - The endpoint URL.
 * @param {ApiOptions} options - Configuration for the request.
 * @returns {Promise<any>} - The parsed JSON response.
 *
 * @example
 * const data = await api('/users', { method: 'POST', json: { name: 'John' } });
 */
export async function api<T = any>(...args: ApiCallArgs): Promise<T> {
  const url = args[0];
  const options: ApiOptions = args[1] || {};
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Default headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if user is authenticated
  // This assumes the backend expects a simple user ID-based auth
  // Replace with proper JWT or token implementation based on your auth system
  if (isAuthenticated && user) {
    headers['Authorization'] = `Bearer ${user.id}`;
  }

  // Prepare the request options
  const requestOptions: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  // Handle query parameters
  let requestUrl = url;
  if (options.query) {
    const queryParams = new URLSearchParams();
    for (const key in options.query) {
      if (options.query[key] !== undefined) {
        queryParams.append(key, String(options.query[key]));
      }
    }
    const queryString = queryParams.toString();
    requestUrl += queryString ? `?${queryString}` : '';
  }

  // If this is a GET, don't send a body
  if (options.method === 'GET' || options.method === 'HEAD') {
    // No body for GET/HEAD requests
  } else if (options.json) {
    headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(options.json);
  } else if (options.formData) {
    // Handle form data
    requestOptions.body = options.formData;
  }

  // Add a timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    toast({
      title: "Request timed out",
      description: "The server took too long to respond.",
      variant: "destructive",
    });
  }, options.timeout || 15000); // Default timeout of 15 seconds

  requestOptions.signal = controller.signal;

  try {
    // Make the API call
    const response = await fetch(requestUrl, requestOptions);
    clearTimeout(timeoutId);

    // Check if authentication failed
    if (response.status === 401 && !options.skipAuthRefresh) {
      // Since we don't have refreshToken functionality in the current auth context,
      // we'll just notify the user they need to log in again
      toast({
        title: "Authentication error",
        description: "Your session has expired. Please log in again.",
        variant: "destructive",
      });
      
      // Track the authentication failure
      trackError(new Error('Authentication failed'), { url }, EventPriority.HIGH);
      
      throw new Error('Authentication failed. Please log in again.');
    }

    // Check for a successful response
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // Track successful API call
    trackFeatureUsage('api_call', { 
      endpoint: url,
      method: options.method || 'GET' 
    });

    // Parse and return the data
    return options.skipJsonParse ? await response.blob() : await response.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    // Handle different types of errors
    if (error.name === 'AbortError') {
      // Handle timeout errors
      console.error('API request timed out:', url);
      trackError(error, { url, timeout: options.timeout || 15000 }, EventPriority.HIGH);
      toast({
        title: "Request timed out",
        description: "The server took too long to respond.",
        variant: "destructive",
      });
    } else {
      // Handle other API request errors
      console.error('API request failed:', error);
      trackError(error, { url }, EventPriority.HIGH);
      toast({
        title: "API error",
        description: error.message || "Something went wrong with the API request.",
        variant: "destructive",
      });
    }
    throw error; // Re-throw the error to be caught by the calling function
  }
}
