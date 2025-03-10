
import React from "react";
import { CheckIcon, FilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * FilterDropdown Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Intuitive filtering interface
 * - Accessibility: ARIA compliant dropdown menu
 */
export interface FilterOption {
  id: string;
  label: string;
}

interface FilterDropdownProps {
  label?: string;
  options: FilterOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  className?: string;
}

export function FilterDropdown({
  label = "Filter",
  options,
  selected,
  onChange,
  className,
}: FilterDropdownProps) {
  const toggleOption = (id: string) => {
    if (selected.includes(id)) {
      onChange(selected.filter(item => item !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  const activeFiltersCount = selected.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={className}
          aria-label={activeFiltersCount > 0 ? `${label}: ${activeFiltersCount} active` : label}
        >
          <FilterIcon className="h-4 w-4 mr-2" />
          <span>{label}</span>
          {activeFiltersCount > 0 && (
            <span className="ml-1 rounded-full bg-primary w-5 h-5 flex items-center justify-center text-xs text-white">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.id}
              className="cursor-pointer flex items-center justify-between"
              onClick={() => toggleOption(option.id)}
            >
              <span>{option.label}</span>
              {selected.includes(option.id) && (
                <CheckIcon className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {activeFiltersCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearAll}
              >
                Clear all filters
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
