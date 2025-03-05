
import React, { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

/**
 * Calculate password strength score (0-100)
 * @param password The password to evaluate
 * @returns A score from 0-100
 */
function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let score = 0;
  
  // Add points for length
  score += Math.min(password.length * 4, 30);
  
  // Add points for character variety
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  
  // Add points for complexity
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) score += 10;
  if (/(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9])/.test(password)) score += 15;
  
  return Math.min(score, 100);
}

/**
 * Get description and color based on password strength
 * @param strength The numeric strength score (0-100)
 * @returns Object with text and color
 */
function getStrengthInfo(strength: number): { text: string; color: string; ariaLabel: string } {
  if (strength < 30) {
    return { 
      text: "Weak", 
      color: "bg-red-500",
      ariaLabel: "Password strength: Weak. Your password is not secure enough."
    };
  } else if (strength < 60) {
    return { 
      text: "Fair", 
      color: "bg-orange-500",
      ariaLabel: "Password strength: Fair. Consider making your password stronger."
    };
  } else if (strength < 80) {
    return { 
      text: "Good", 
      color: "bg-yellow-500",
      ariaLabel: "Password strength: Good. Your password is reasonably secure."
    };
  } else {
    return { 
      text: "Strong", 
      color: "bg-green-500",
      ariaLabel: "Password strength: Strong. Your password is very secure."
    };
  }
}

/**
 * PasswordStrengthIndicator Component
 * 
 * Visual indicator of password strength with accessibility support
 */
export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  // Calculate strength and get info about it
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  const strengthInfo = useMemo(() => getStrengthInfo(strength), [strength]);
  
  return (
    <div className="mt-2">
      <div className="flex justify-between mb-1">
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Password Strength:
        </span>
        <span className="text-xs font-medium">{strengthInfo.text}</span>
      </div>
      <div 
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700"
        role="progressbar"
        aria-valuenow={strength}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={strengthInfo.ariaLabel}
      >
        <div
          className={`h-full ${strengthInfo.color} transition-all duration-300`}
          style={{ width: `${strength}%` }}
        />
      </div>
    </div>
  );
}
