
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { SearchIcon, CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { commonMedications } from "@/data/commonMedications";
import { MedicationFormValues } from "@/schemas/medicationSchema";

interface MedicationSearchProps {
  form: UseFormReturn<MedicationFormValues>;
}

export function MedicationSearch({ form }: MedicationSearchProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Function to handle selection from autocomplete
  const handleMedicationSelect = (value: string) => {
    const medication = commonMedications.find(med => med.name === value);
    if (medication) {
      form.setValue("name", medication.name);
      form.setValue("dose", medication.dose);
      form.setValue("unit", medication.unit);
      form.setValue("totalDose", medication.totalDose);
    } else {
      // If it's a custom entry, just set the name
      form.setValue("name", value);
    }
    setOpen(false);
  };

  return (
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
                  type="button" // Add type="button" to prevent form submission
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default to avoid any navigation
                    setOpen(true);
                  }}
                >
                  {field.value
                    ? field.value
                    : "Search medications..."}
                  <SearchIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search medications..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                />
                <CommandEmpty>No medication found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {commonMedications
                    .filter(med => 
                      med.name.toLowerCase().includes(searchValue.toLowerCase())
                    )
                    .map((medication) => (
                      <CommandItem
                        key={medication.name}
                        value={medication.name}
                        onSelect={handleMedicationSelect}
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
  );
}
