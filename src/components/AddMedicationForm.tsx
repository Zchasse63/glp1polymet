
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
  FormDescription,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { CheckIcon, SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Common medications database
const commonMedications = [
  { name: "Ozempic", dose: "0.5mg", unit: "mg", totalDose: 0.5 },
  { name: "Metformin", dose: "500mg", unit: "mg", totalDose: 500 },
  { name: "Vitamin D", dose: "2000IU", unit: "IU", totalDose: 2000 },
  { name: "Atorvastatin", dose: "10mg", unit: "mg", totalDose: 10 },
  { name: "Lisinopril", dose: "20mg", unit: "mg", totalDose: 20 },
  { name: "Levothyroxine", dose: "75mcg", unit: "mcg", totalDose: 75 },
  { name: "Amlodipine", dose: "5mg", unit: "mg", totalDose: 5 },
  { name: "Omeprazole", dose: "20mg", unit: "mg", totalDose: 20 },
  { name: "Sertraline", dose: "50mg", unit: "mg", totalDose: 50 },
  { name: "Albuterol", dose: "90mcg", unit: "mcg", totalDose: 90 },
  { name: "Gabapentin", dose: "300mg", unit: "mg", totalDose: 300 },
  { name: "Simvastatin", dose: "40mg", unit: "mg", totalDose: 40 },
  { name: "Hydrochlorothiazide", dose: "25mg", unit: "mg", totalDose: 25 },
  { name: "Amoxicillin", dose: "500mg", unit: "mg", totalDose: 500 },
  { name: "Ibuprofen", dose: "200mg", unit: "mg", totalDose: 200 },
];

// Define the validation schema
const medicationSchema = z.object({
  name: z.string().min(2, "Medication name must be at least 2 characters"),
  dose: z.string().min(1, "Dose is required"),
  frequency: z.string().min(1, "Frequency is required"),
  unit: z.string().optional(),
  totalDose: z.number().optional(),
});

type MedicationFormValues = z.infer<typeof medicationSchema>;

interface AddMedicationFormProps {
  onSubmit: (data: MedicationFormValues) => void;
  onCancel: () => void;
}

export function AddMedicationForm({ onSubmit, onCancel }: AddMedicationFormProps) {
  const [open, setOpen] = useState(false);
  
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

  // Function to handle selection from autocomplete
  const handleMedicationSelect = (medication: typeof commonMedications[0]) => {
    form.setValue("name", medication.name);
    form.setValue("dose", medication.dose);
    form.setValue("unit", medication.unit);
    form.setValue("totalDose", medication.totalDose);
    setOpen(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Medication Name</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? commonMedications.find(
                            (medication) => medication.name === field.value
                          )?.name || field.value
                        : "Search medications..."}
                      <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search medications..." />
                    <CommandEmpty>No medication found.</CommandEmpty>
                    <CommandGroup className="max-h-[300px] overflow-auto">
                      {commonMedications.map((medication) => (
                        <CommandItem
                          key={medication.name}
                          value={medication.name}
                          onSelect={() => handleMedicationSelect(medication)}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              medication.name === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {medication.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select from common medications or type your own
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Once daily">Once daily</SelectItem>
                    <SelectItem value="Twice daily">Twice daily</SelectItem>
                    <SelectItem value="Three times daily">Three times daily</SelectItem>
                    <SelectItem value="Once weekly">Once weekly</SelectItem>
                    <SelectItem value="As needed">As needed</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Medication</Button>
        </div>
      </form>
    </Form>
  );
}
