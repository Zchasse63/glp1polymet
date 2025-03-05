
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RegisterFormValues } from "@/components/RegisterForm";

interface RegisterTermsProps {
  form: UseFormReturn<RegisterFormValues>;
}

export function RegisterTerms({ form }: RegisterTermsProps) {
  return (
    <FormField
      control={form.control}
      name="termsAccepted"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              I accept the <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
