
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { loginSchema } from "@/utils/validationUtils";
import { Loader2 } from "lucide-react";
import { ErrorLogger } from "@/utils/errorHandling";
import { ErrorGroup, ErrorSeverity } from "@/utils/errorHandling/types";
import { AccessibleLabel } from "@/utils/accessibility";

// Define the form values type from our schema
type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Login Form Component
 * Implements the Command Pattern for encapsulating
 * login requests as objects
 * 
 * Following CodeFarm principles:
 * - User-Centric Design: Accessible form
 * - Error Handling: Consistent error handling
 * - Security-First Approach: Secure authentication
 */
export function LoginForm() {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get the intended destination from the location state, if any
  const from = location.state?.from?.pathname || "/";
  
  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Form submission handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Start performance tracking for login
      console.time('login-flow');
      
      await login(data.email, data.password, data.rememberMe);
      
      // End performance tracking
      console.timeEnd('login-flow');
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate to the intended destination
      navigate(from, { replace: true });
    } catch (err) {
      // Log error with ErrorLogger
      ErrorLogger.error(
        "Login failed",
        "LOGIN_FORM_ERROR",
        { email: data.email }, // Don't log password
        err,
        true,
        "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(onSubmit)} 
        className="space-y-4"
        aria-label="Login form"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <AccessibleLabel htmlFor="email" required>Email</AccessibleLabel>
              <FormControl>
                <Input 
                  id="email"
                  placeholder="your@email.com" 
                  {...field} 
                  autoComplete="email"
                  disabled={isSubmitting}
                  aria-required="true"
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
              <AccessibleLabel htmlFor="password" required>Password</AccessibleLabel>
              <FormControl>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  {...field} 
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  aria-required="true"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-2">
              <FormControl>
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <AccessibleLabel htmlFor="rememberMe">Remember me</AccessibleLabel>
              </div>
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              <span>Logging in...</span>
              <span className="sr-only">Please wait while logging in</span>
            </>
          ) : (
            "Log in"
          )}
        </Button>
        
        {/* Display error message in an accessible way */}
        {error && (
          <div 
            className="text-sm text-destructive text-center mt-2"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        
        <div className="text-center text-sm mt-4">
          <a 
            href="#"
            className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            onClick={(e) => {
              e.preventDefault();
              // Show toast for password reset (normally would navigate to reset page)
              toast({
                title: "Password Reset",
                description: "Password reset functionality is coming soon."
              });
            }}
          >
            Forgot your password?
          </a>
        </div>
      </form>
    </Form>
  );
}
