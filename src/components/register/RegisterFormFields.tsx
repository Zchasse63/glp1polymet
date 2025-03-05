
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/types/authentication';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { AccessibleLabel } from '@/utils/accessibility';

interface RegisterFormFieldsProps {
  form: UseFormReturn<RegisterFormData>;
  showPasswordStrength: boolean;
}

/**
 * RegisterFormFields Component
 * 
 * Separates form fields from the main RegisterForm component for better maintainability
 * Following CodeFarm Development Methodology:
 * - Single Responsibility: Focuses only on form field rendering
 * - User-Centric Design: Includes accessibility enhancements
 */
export function RegisterFormFields({ form, showPasswordStrength }: RegisterFormFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <AccessibleLabel htmlFor={field.name} className="text-sm font-medium">
              Full Name
            </AccessibleLabel>
            <FormControl>
              <Input
                id={field.name}
                placeholder="Enter your full name"
                {...field}
                aria-describedby="name-description"
              />
            </FormControl>
            <FormDescription id="name-description">
              This is how we'll address you in the app.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <AccessibleLabel htmlFor={field.name} className="text-sm font-medium">
              Email
            </AccessibleLabel>
            <FormControl>
              <Input
                id={field.name}
                type="email"
                placeholder="Enter your email address"
                autoComplete="email"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <AccessibleLabel htmlFor={field.name} className="text-sm font-medium">
              Password
            </AccessibleLabel>
            <FormControl>
              <Input
                id={field.name}
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                {...field}
                aria-describedby="password-description"
              />
            </FormControl>
            <FormDescription id="password-description">
              Use 8+ characters with a mix of letters, numbers & symbols.
            </FormDescription>
            {showPasswordStrength && (
              <PasswordStrengthIndicator password={field.value} />
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <AccessibleLabel htmlFor={field.name} className="text-sm font-medium">
              Confirm Password
            </AccessibleLabel>
            <FormControl>
              <Input
                id={field.name}
                type="password"
                autoComplete="new-password"
                placeholder="Confirm your password"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
