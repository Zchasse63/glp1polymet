
import * as React from "react"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isLoading?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isLoading, ...props }, ref) => {
    const isReducedMotion = useReducedMotion();
    
    return (
      <div className="relative">
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors md:text-sm",
            isLoading && "pr-10",
            className
          )}
          ref={ref}
          disabled={isLoading || props.disabled}
          {...props}
        />
        {isLoading && (
          <div className={cn(
            "absolute right-3 top-1/2 transform -translate-y-1/2",
            isReducedMotion ? "opacity-80" : "animate-spin"
          )}>
            <svg 
              className="h-4 w-4 text-muted-foreground" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
