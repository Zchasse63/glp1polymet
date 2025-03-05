
import * as z from "zod";

/**
 * Centralized validation schemas using the Zod library
 * Following the Strategy pattern for different validation strategies
 */

// Email validation with custom error messages
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

// Password validation with strength requirements
export const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must contain at least one number"
  );

// Username validation
export const usernameSchema = z
  .string()
  .min(1, "Username is required")
  .min(3, "Username must be at least 3 characters")
  .max(50, "Username must be less than 50 characters")
  .refine(
    (username) => /^[a-zA-Z0-9_]+$/.test(username),
    "Username can only contain letters, numbers, and underscores"
  );

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

// Registration form schema
export const registerSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Profile update schema
export const profileUpdateSchema = z.object({
  username: usernameSchema.optional(),
  displayName: z.string().max(50, "Display name must be less than 50 characters").optional(),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
});

// Password reset schema
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Common validation functions
export const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return errors;
};

// Password strength indicator (returns 0-100)
export const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length contribution (up to 25 points)
  strength += Math.min(25, password.length * 2);
  
  // Character variety contribution
  if (/[A-Z]/.test(password)) strength += 15; // Uppercase
  if (/[a-z]/.test(password)) strength += 15; // Lowercase
  if (/[0-9]/.test(password)) strength += 15; // Numbers
  if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special characters
  
  // Penalize repeated characters
  const repeats = password.length - new Set(password.split('')).size;
  strength -= repeats * 5;
  
  // Ensure the result is between 0 and 100
  return Math.max(0, Math.min(100, strength));
};
