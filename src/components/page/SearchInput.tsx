
import React, { useState, useEffect } from "react";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * SearchInput Component
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Intuitive search with clear button
 * - Performance: Debounced search to prevent excessive callbacks
 */
interface SearchInputProps {
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  className?: string;
  debounceMs?: number;
}

export function SearchInput({
  onChange,
  placeholder = "Search...",
  value: externalValue,
  className,
  debounceMs = 300,
}: SearchInputProps) {
  const [value, setValue] = useState(externalValue || "");
  
  // Handle external value changes
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue);
    }
  }, [externalValue]);

  // Debounce the onChange callback
  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(value);
    }, debounceMs);

    return () => {
      clearTimeout(handler);
    };
  }, [value, onChange, debounceMs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleClear = () => {
    setValue("");
    onChange("");
  };

  return (
    <div className={cn("relative", className)}>
      <SearchIcon 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" 
      />
      
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-9 pr-8"
      />
      
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-500"
          aria-label="Clear search"
        >
          <XIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
