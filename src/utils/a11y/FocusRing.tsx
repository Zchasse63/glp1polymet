
import React, { useState } from 'react';

/**
 * Enhanced focus indicator component for keyboard navigation
 */
export function FocusRing({ 
  children, 
  active = true, 
  className = '',
}: { 
  children: React.ReactNode; 
  active?: boolean;
  className?: string;
}) {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  
  const handleFocus = () => {
    setIsFocusVisible(true);
  };
  
  const handleBlur = () => {
    setIsFocusVisible(false);
  };
  
  return (
    <div
      className={`focus-ring ${isFocusVisible && active ? 'ring-2 ring-offset-2 ring-blue-500 ring-offset-background outline-none' : ''} ${className}`}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
    </div>
  );
}
