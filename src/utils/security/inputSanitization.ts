
/**
 * Input Sanitization
 * 
 * Functions for sanitizing user input to prevent XSS and injection attacks
 * Following CodeFarm Development Methodology:
 * - Security-First Approach: Thorough input validation
 * - User-Centric Design: Balance security with usability
 */

import DOMPurify from 'dompurify';
import { SanitizationConfig, SecurityLevel } from './types';

// Default configuration for input sanitization
const defaultSanitizationConfig: SanitizationConfig = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br'],
  allowedAttributes: {
    'a': ['href', 'title', 'target', 'rel'],
  },
  disallowedTagsMode: 'escape'
};

/**
 * Configure DOMPurify with security settings
 * @param config Sanitization configuration
 */
export function configureSanitizer(config: Partial<SanitizationConfig> = {}): void {
  const mergedConfig = { ...defaultSanitizationConfig, ...config };
  
  DOMPurify.setConfig({
    ALLOWED_TAGS: mergedConfig.allowedTags,
    ALLOWED_ATTR: Object.entries(mergedConfig.allowedAttributes).flatMap(([_, attrs]) => attrs),
    FORBID_TAGS: ['script', 'style', 'iframe', 'frame', 'object', 'embed', 'form'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onmouseout', 'onfocus', 'onblur'],
    FORCE_BODY: true,
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
  });
}

/**
 * Sanitize HTML input to prevent XSS attacks
 * @param input HTML string to sanitize
 * @param level Security level
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(input: string, level: SecurityLevel = SecurityLevel.MEDIUM): string {
  if (!input) return '';
  
  // Apply different security levels
  switch (level) {
    case SecurityLevel.LOW:
      // Basic sanitization, allows most HTML
      return DOMPurify.sanitize(input, {
        ADD_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'img', 'span', 'div'],
        ADD_ATTR: ['src', 'alt', 'class', 'id', 'style']
      });
      
    case SecurityLevel.HIGH:
      // Strict sanitization, only basic formatting
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
      });
      
    case SecurityLevel.CRITICAL:
      // Maximum sanitization, plain text only
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: [],
        ALLOWED_ATTR: [],
      });
      
    case SecurityLevel.MEDIUM:
    default:
      // Standard sanitization with default config
      return DOMPurify.sanitize(input);
  }
}

/**
 * Sanitize plain text input to prevent injection
 * @param input Text to sanitize
 * @returns Sanitized text string
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  // Use DOMPurify with no tags allowed to get plain text
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize and validate URL
 * @param url URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    // Validate URL format
    new URL(url);
    
    // Remove potential JavaScript URLs
    if (url.toLowerCase().startsWith('javascript:')) {
      return '';
    }
    
    // Sanitize the URL
    return DOMPurify.sanitize(url, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
    });
  } catch (e) {
    // Invalid URL
    return '';
  }
}

/**
 * Sanitize user input for database queries to prevent SQL injection
 * Note: This is a basic implementation - for real protection use parameterized queries
 * @param input Text to sanitize
 * @returns Sanitized input safe for queries
 */
export function sanitizeForDatabase(input: string): string {
  if (!input) return '';
  
  // Escape special characters used in SQL
  return input
    .replace(/'/g, "''")
    .replace(/\\/g, "\\\\")
    .replace(/\0/g, "\\0")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t")
    .replace(/\x1a/g, "\\Z");
}

/**
 * Validate and sanitize email address
 * @param email Email to validate
 * @returns Sanitized email or empty string if invalid
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  // Basic email regex validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email)) {
    return '';
  }
  
  // Sanitize the email
  return sanitizeText(email);
}
