
/**
 * Type Safety Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Type Safety: Ensuring runtime type validation
 * - Error Handling: Consistent handling of type errors
 */
import { z } from 'zod';
import { ErrorLogger } from './errorHandling';
import { ErrorGroup } from './errorHandling/types';

/**
 * Parse and validate data against a Zod schema with error handling
 * @param data The data to validate
 * @param schema The Zod schema to validate against
 * @param options Options for error handling
 * @returns Validated data or fallback
 */
export function parseData<T extends z.ZodType>(
  data: unknown, 
  schema: T, 
  options: {
    fallback?: z.infer<T>;
    errorCode?: string;
    errorMessage?: string;
    logError?: boolean;
  } = {}
): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (error) {
    if (options.logError !== false) {
      ErrorLogger.error(
        options.errorMessage || 'Data validation failed',
        options.errorCode || 'DATA_VALIDATION_ERROR',
        { 
          receivedData: JSON.stringify(data).substring(0, 500),
          validationError: error instanceof Error ? error.message : String(error)
        },
        error,
        false
      );
    }
    
    // Return fallback if provided
    if ('fallback' in options) {
      return options.fallback as z.infer<T>;
    }
    
    // Re-throw to allow caller to handle
    throw error;
  }
}

/**
 * Safely access a property with type checking
 * @param obj The object to access
 * @param key The key to access
 * @param defaultValue Default value if property doesn't exist or is wrong type
 * @returns The property value or default value
 */
export function getTypeSafe<T, K extends keyof T>(
  obj: T | null | undefined, 
  key: K, 
  defaultValue: T[K]
): T[K] {
  if (!obj) return defaultValue;
  return (obj[key] !== undefined && obj[key] !== null) ? obj[key] : defaultValue;
}

/**
 * Validate a record of values against a schema
 * @param record Record to validate
 * @param schema Schema for validation
 * @returns Object with validation results
 */
export function validateRecord<T extends Record<string, unknown>>(
  record: T,
  schema: z.ZodObject<any>
): { 
  isValid: boolean; 
  validatedData?: z.infer<typeof schema>;
  errors?: Record<string, string[]>;
} {
  try {
    const result = schema.safeParse(record);
    if (result.success) {
      return { isValid: true, validatedData: result.data };
    } else {
      const errors: Record<string, string[]> = {};
      
      result.error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      
      return { isValid: false, errors };
    }
  } catch (error) {
    ErrorLogger.error(
      'Schema validation failed',
      'SCHEMA_VALIDATION_ERROR',
      { schema: schema.description },
      error,
      false
    );
    
    return { isValid: false };
  }
}
