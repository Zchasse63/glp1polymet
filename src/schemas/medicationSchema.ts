
import * as z from "zod";

// Define the validation schema
export const medicationSchema = z.object({
  name: z.string().min(2, "Medication name must be at least 2 characters"),
  dose: z.string().min(1, "Dose is required"),
  frequency: z.string().min(1, "Frequency is required"),
  unit: z.string().optional(),
  totalDose: z.number().optional(),
});

export type MedicationFormValues = z.infer<typeof medicationSchema>;
