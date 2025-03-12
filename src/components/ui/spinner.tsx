
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  ariaLabel?: string;
  color?: "primary" | "secondary" | "muted";
}

export const Spinner = ({ 
  size = "md", 
  className,
  ariaLabel = "Loading",
  color = "primary" 
}: SpinnerProps) => {
  const isReducedMotion = useReducedMotion();
  
  const sizeClass = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }[size];
  
  const colorClass = {
    primary: "text-primary",
    secondary: "text-secondary-foreground",
    muted: "text-muted-foreground"
  }[color];
  
  const animationClass = isReducedMotion 
    ? "animate-pulse" 
    : "animate-spin";
  
  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className="inline-flex items-center justify-center"
    >
      <Loader2 
        className={cn(
          animationClass, 
          colorClass, 
          sizeClass, 
          "will-change-transform transition-all duration-250",
          className
        )} 
      />
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};
