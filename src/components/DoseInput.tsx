
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
}

export function DoseInput({ form }: DoseInputProps) {
  return (
    <FormField
      control={form.control}
      name="dose"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dose</FormLabel>
          <FormControl>
            <Input placeholder="e.g. 500mg" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
