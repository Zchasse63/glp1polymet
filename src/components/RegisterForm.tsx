
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SSOButtons } from "./SSOButtons";
import { ErrorLogger } from "@/utils/errorHandling";
import { useComponentPerformance } from "@/utils/performance/useComponentPerformance";
import { RegisterFormData } from "@/types/authentication";
import { RegisterFormFields } from "./register/RegisterFormFields";
import { RegisterTerms } from "./register/RegisterTerms";

interface RegisterFormProps {
  onSuccess: () => void;
}

// Registration form validation schema
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must include uppercase, lowercase, and numbers"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  marketingEmails: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const performance = useComponentPerformance("RegisterForm");
  
  // Initialize form
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
      marketingEmails: false,
    },
  });

  // Check if we should show password strength
  const watchPassword = form.watch("password");
  const showPasswordStrength = watchPassword.length > 0;

  // Form submission handler
  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setRegisterError(null);
    
    try {
      // Track registration attempt performance
      await performance.trackAsyncOperation("registration", async () => {
        // In a real app, this would call an API
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulate API call
        console.log("Registering user:", data);
        
        // Notify about successful registration
        onSuccess();
      });
    } catch (error) {
      // Log the error
      ErrorLogger.error(
        "Registration failed", 
        "REGISTRATION_ERROR", 
        { email: data.email },
        error,
        true,
        "We couldn't create your account. Please try again."
      );
      
      if (error instanceof Error) {
        setRegisterError(error.message);
      } else {
        setRegisterError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information to create an account
        </p>
      </div>

      <SSOButtons />

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form Fields Component */}
          <RegisterFormFields 
            form={form} 
            showPasswordStrength={showPasswordStrength} 
          />
          
          {/* Terms and Marketing Component */}
          <RegisterTerms form={form} />
          
          {/* Error Display */}
          {registerError && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
              {registerError}
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
