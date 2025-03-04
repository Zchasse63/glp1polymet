
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parse JSON with error handling
 * @param str The JSON string to parse
 * @param fallback Fallback value if parsing fails
 * @returns Parsed object or fallback
 */
export function safeJsonParse<T>(str: string | null, fallback: T): T {
  if (!str) return fallback;
  
  try {
    return JSON.parse(str) as T;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
}

/**
 * Format a date string to display format
 * @param dateStr Date string in ISO format
 * @param defaultValue Default value if date is invalid
 * @returns Formatted date string
 */
export function formatDate(dateStr: string, defaultValue: string = "Invalid date"): string {
  try {
    const date = parseISO(dateStr);
    if (!isValid(date)) return defaultValue;
    return format(date, "MMM dd, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return defaultValue;
  }
}

/**
 * Validate an email address
 * @param email Email to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate random ID for entities
 * @returns Random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Deep clone an object
 * @param obj Object to clone
 * @returns Cloned object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Truncate text with ellipsis
 * @param text Text to truncate
 * @param length Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Get authenticated user from localStorage
 * @returns User object or null
 */
export function getAuthenticatedUser() {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing user JSON:", error);
    return null;
  }
}

/**
 * Set authenticated user in localStorage
 * @param user User object
 */
export function setAuthenticatedUser(user: any) {
  localStorage.setItem("user", JSON.stringify(user));
}

/**
 * Remove authenticated user from localStorage
 */
export function removeAuthenticatedUser() {
  localStorage.removeItem("user");
}

/**
 * Check if user is authenticated
 * @returns Boolean indicating if user is authenticated
 */
export function isUserAuthenticated(): boolean {
  return !!getAuthenticatedUser();
}

/**
 * Format error message for display
 * @param error Error object or string
 * @returns Formatted error message
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

/**
 * Delay function for async operations (useful for simulating API calls in development)
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
