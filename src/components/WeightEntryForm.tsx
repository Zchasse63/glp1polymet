
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Define the validation schema
const weightEntrySchema = z.object({
  weight: z
    .string()
    .min(1, "Weight is required")
    .refine(
      (val) => {
        const num = parseFloat(val);
        return !isNaN(num) && num > 0 && num < 1000;
      },
      { message: "Weight must be a valid number between 0 and 1000" }
    ),
  unit: z.enum(["lbs", "kg"]).default("lbs"),
});

type WeightFormValues = z.infer<typeof weightEntrySchema>;

interface WeightEntryFormProps {
  onSubmit: (data: { weight: number; date: string; unit: string }) => void;
}

export function WeightEntryForm({ onSubmit }: WeightEntryFormProps) {
  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      weight: "",
      unit: "lbs",
    },
  });

  const handleSubmit = (data: WeightFormValues) => {
    try {
      const weight = parseFloat(data.weight);
      if (isNaN(weight)) {
        throw new Error("Invalid weight value");
      }
      
      const today = format(new Date(), "yyyy-MM-dd");
      onSubmit({ weight, date: today, unit: data.unit });
      form.reset();
      
      toast({
        title: "Weight recorded",
        description: `Your weight has been recorded for today.`,
      });
    } catch (error) {
      console.error("Error adding weight entry:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to record weight. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Weight</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter your weight" 
                    {...field} 
                    step="0.1"
                    min="0"
                    max="999.9"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem className="w-24">
                <FormLabel>Unit</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="lbs">lbs</SelectItem>
                    <SelectItem value="kg">kg</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">Record Weight</Button>
      </form>
    </Form>
  );
}
