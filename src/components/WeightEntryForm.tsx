
import React from "react";
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
});

type WeightFormValues = z.infer<typeof weightEntrySchema>;

interface WeightEntryFormProps {
  onSubmit: (data: { weight: number; date: string }) => void;
}

export function WeightEntryForm({ onSubmit }: WeightEntryFormProps) {
  const form = useForm<WeightFormValues>({
    resolver: zodResolver(weightEntrySchema),
    defaultValues: {
      weight: "",
    },
  });

  const handleSubmit = (data: WeightFormValues) => {
    try {
      const weight = parseFloat(data.weight);
      if (isNaN(weight)) {
        throw new Error("Invalid weight value");
      }
      
      const today = format(new Date(), "yyyy-MM-dd");
      onSubmit({ weight, date: today });
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
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (lbs)</FormLabel>
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

        <Button type="submit" className="w-full">Record Weight</Button>
      </form>
    </Form>
  );
}
