
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { RegisterFormFields } from "@/components/register/RegisterFormFields";
import { RegisterTerms } from "@/components/register/RegisterTerms";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { RegisterFormProps } from "@/types/authentication";

// Registration validation schema
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Valid email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Derive the type from the schema
export type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setIsLoading(true);
      await registerUser(values.username, values.email, values.password);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error instanceof Error 
          ? error.message 
          : "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Enter your information to get started
        </p>
      </div>
      
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <RegisterFormFields form={form} />
        
        <RegisterTerms form={form} />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </div>
  );
}
