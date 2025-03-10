
import React from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MedicationFormValues } from "@/schemas/medicationSchema";

interface FrequencySelectProps {
  form: UseFormReturn<MedicationFormValues>;
  isLoading?: boolean;
}

export function FrequencySelect({ form, isLoading = false }: FrequencySelectProps) {
  return (
    <FormField
      control={form.control}
      name="frequency"
      render={({ field }) => (
        <FormItem className="space-y-2 animate-fade-in">
          <FormLabel className="text-sm font-medium">Frequency</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoading}
            >
              <SelectTrigger className="focus-visible:ring-primary/70 transition-colors">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent className="max-h-[280px]">
                <SelectItem value="Once daily">Once daily</SelectItem>
                <SelectItem value="Twice daily">Twice daily</SelectItem>
                <SelectItem value="Three times daily">Three times daily</SelectItem>
                <SelectItem value="Four times daily">Four times daily</SelectItem>
                <SelectItem value="Once weekly">Once weekly</SelectItem>
                <SelectItem value="Twice weekly">Twice weekly</SelectItem>
                <SelectItem value="As needed">As needed</SelectItem>
                <SelectItem value="Every other day">Every other day</SelectItem>
                <SelectItem value="Every morning">Every morning</SelectItem>
                <SelectItem value="Every evening">Every evening</SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
