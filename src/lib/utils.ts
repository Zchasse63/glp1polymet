
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
