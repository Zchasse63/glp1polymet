
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
          <FormControl>
            <Input 
              placeholder="e.g. 500mg" 
              className="border-input focus-visible:ring-primary/70"
              isLoading={isLoading}
              {...field} 
            />
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
