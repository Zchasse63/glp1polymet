
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MedicationFormValues } from "@/schemas/medicationSchema";
import { Spinner } from "@/components/ui/spinner";

interface DoseInputProps {
  form: UseFormReturn<MedicationFormValues>;
  isLoading?: boolean;
}

export function DoseInput({ form, isLoading = false }: DoseInputProps) {
  return (
    <FormField
      control={form.control}
      name="dose"
      render={({ field }) => (
        <FormItem className="space-y-2 animate-fade-in">
          <FormLabel className="text-sm font-medium">Dose</FormLabel>
          <div className="relative">
            <FormControl>
              <Input 
                placeholder="e.g. 500mg" 
                className="border-input focus-visible:ring-primary/70 pr-8"
                disabled={isLoading}
                {...field} 
              />
            </FormControl>
            {isLoading && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Spinner size="xs" color="muted" />
              </div>
            )}
          </div>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
