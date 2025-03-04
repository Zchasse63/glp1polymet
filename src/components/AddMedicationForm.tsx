
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { MedicationSearch } from "@/components/MedicationSearch";
import { DoseInput } from "@/components/DoseInput";
import { FrequencySelect } from "@/components/FrequencySelect";
import { FormActions } from "@/components/FormActions";
import { medicationSchema, MedicationFormValues } from "@/schemas/medicationSchema";

interface AddMedicationFormProps {
  onSubmit: (data: MedicationFormValues) => void;
  onCancel: () => void;
}

export function AddMedicationForm({ onSubmit, onCancel }: AddMedicationFormProps) {
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dose: "",
      frequency: "",
      unit: "",
      totalDose: undefined,
    },
  });

  const handleSubmit = (data: MedicationFormValues) => {
    try {
      onSubmit(data);
      form.reset();
      toast({
        title: "Medication added",
        description: `${data.name} has been added to your medications.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add medication. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <MedicationSearch form={form} />
        <DoseInput form={form} />
        <FrequencySelect form={form} />
        <FormActions onCancel={onCancel} />
      </form>
    </Form>
  );
}
