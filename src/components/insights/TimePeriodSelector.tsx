
/**
 * TimePeriodSelector Component
 * 
 * A component that allows users to select different time periods for insights analysis.
 * Following CodeFarm principles:
 * - User-Centric Design: Simple, intuitive interface for data filtering
 * - Sustainable Code: Reusable component with clear responsibilities
 * - Separation of Concerns: UI selection separate from data handling
 */
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type TimePeriod = "7days" | "30days" | "90days" | "6months" | "1year";

interface TimePeriodSelectorProps {
  selectedPeriod: TimePeriod;
  onChange: (period: TimePeriod) => void;
}

const TimePeriodSelector: React.FC<TimePeriodSelectorProps> = ({
  selectedPeriod,
  onChange,
}) => {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: "7days", label: "Last 7 days" },
    { value: "30days", label: "Last 30 days" },
    { value: "90days", label: "Last 90 days" },
    { value: "6months", label: "Last 6 months" },
    { value: "1year", label: "Last year" },
  ];

  const getDisplayLabel = (value: TimePeriod): string => {
    return periods.find((p) => p.value === value)?.label || "Select period";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 text-sm"
        >
          <CalendarDays className="h-4 w-4" />
          <span>{getDisplayLabel(selectedPeriod)}</span>
          <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {periods.map((period) => (
          <DropdownMenuItem
            key={period.value}
            onClick={() => onChange(period.value)}
            className={
              selectedPeriod === period.value ? "bg-muted/50 font-medium" : ""
            }
          >
            {period.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TimePeriodSelector;
