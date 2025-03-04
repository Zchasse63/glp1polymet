
import React, { useState, useEffect } from "react";
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
  const [filteredMedications, setFilteredMedications] = useState(commonMedications);

  // Update filtered medications whenever search value changes
  useEffect(() => {
    if (searchValue === "") {
      setFilteredMedications(commonMedications);
    } else {
      const filtered = commonMedications.filter(med => 
        med.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredMedications(filtered);
    }
  }, [searchValue]);

  // Function to handle selection from autocomplete
  const handleMedicationSelect = (selectedValue: string) => {
    const medication = commonMedications.find(med => med.name === selectedValue);
    if (medication) {
      form.setValue("name", medication.name);
      form.setValue("dose", medication.dose);
      form.setValue("unit", medication.unit);
      form.setValue("totalDose", medication.totalDose);
    } else {
      // If it's a custom entry, just set the name
      form.setValue("name", selectedValue);
    }
    setOpen(false);
  };

  // Allow users to add custom entries that don't exist in the list
  const handleCustomEntry = () => {
    if (searchValue.trim() !== "") {
      form.setValue("name", searchValue);
      setOpen(false);
    }
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
                  type="button" // Prevent form submission
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
            <PopoverContent className="w-[300px] p-0 shadow-[0_0_15px_rgba(0,0,0,0.1)]" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search medications..." 
                  value={searchValue}
                  onValueChange={setSearchValue}
                  className="h-9"
                />
                <CommandEmpty>
                  <div className="px-2 py-3 text-sm text-center">
                    <p>No medication found.</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2"
                      onClick={handleCustomEntry}
                    >
                      Add "{searchValue}"
                    </Button>
                  </div>
                </CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {filteredMedications.map((medication) => (
                    <CommandItem
                      key={medication.name}
                      value={medication.name}
                      onSelect={handleMedicationSelect}
                      className="cursor-pointer"
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
