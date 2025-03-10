
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { RegisterFormValues } from "@/components/RegisterForm";

interface RegisterFormFieldsProps {
  form: UseFormReturn<RegisterFormValues>;
  isLoading?: boolean;
}

export function RegisterFormFields({ form, isLoading = false }: RegisterFormFieldsProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium">Username</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter your username" 
                className="border-input focus-visible:ring-primary/70 transition-colors"
                isLoading={isLoading}
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium">Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="border-input focus-visible:ring-primary/70 transition-colors"
                isLoading={isLoading}
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium">Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Create a strong password" 
                className="border-input focus-visible:ring-primary/70 transition-colors"
                isLoading={isLoading}
                {...field} 
              />
            </FormControl>
            <PasswordStrengthIndicator password={field.value} />
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Confirm your password" 
                className="border-input focus-visible:ring-primary/70 transition-colors"
                isLoading={isLoading}
                {...field} 
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
}
