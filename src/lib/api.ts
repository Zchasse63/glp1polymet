
import { toast } from "@/components/ui/use-toast";

// Generic type for API responses
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

/**
 * Fetches data from local storage with error handling
 * @param key The storage key to fetch
 * @returns ApiResponse with data or error
 */
export async function fetchFromStorage<T>(key: string): Promise<ApiResponse<T>> {
  try {
    const storedData = localStorage.getItem(key);
    
    if (!storedData) {
      return { data: null, error: null };
    }
    
    const parsedData = JSON.parse(storedData) as T;
    return { data: parsedData, error: null };
  } catch (error) {
    console.error(`Error fetching ${key} from storage:`, error);
    return { 
      data: null, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}

/**
 * Saves data to local storage with error handling
 * @param key The storage key
 * @param data The data to store
 * @returns ApiResponse indicating success or failure
 */
export async function saveToStorage<T>(key: string, data: T): Promise<ApiResponse<boolean>> {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return { data: true, error: null };
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
    return { 
      data: false, 
      error: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
}

/**
 * Generic error handler for API operations
 * @param error The error object or message
 * @param fallbackMessage Fallback message if error is not an Error object
 */
export function handleApiError(error: unknown, fallbackMessage: string = "An error occurred"): void {
  console.error("API Error:", error);
  
  const errorMessage = error instanceof Error 
    ? error.message 
    : typeof error === 'string' 
      ? error 
      : fallbackMessage;
  
  toast({
    variant: "destructive",
    title: "Error",
    description: errorMessage,
  });
}
