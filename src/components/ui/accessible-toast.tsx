
import React, { useEffect } from 'react';
import { 
  Toast, 
  ToastProps, 
  ToastAction,
  ToastActionElement, 
  ToastDescription,
  ToastTitle, 
  ToastClose
} from '@/components/ui/toast';
import { ScreenReaderAnnouncement } from '@/utils/accessibility';

interface AccessibleToastProps extends ToastProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
  assertive?: boolean;
}

/**
 * AccessibleToast Component
 * 
 * Enhances the regular toast with screen reader announcements
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Makes toasts accessible to screen reader users
 */
export function AccessibleToast({
  title,
  description,
  action,
  assertive = false,
  ...props
}: AccessibleToastProps) {
  // Prepare message for screen reader
  const screenReaderMessage = `${title ? title + '. ' : ''}${typeof description === 'string' ? description : ''}`;
  
  return (
    <>
      {/* Announce toast content to screen readers */}
      {screenReaderMessage && (
        <ScreenReaderAnnouncement 
          message={screenReaderMessage} 
          assertive={assertive} 
        />
      )}
      
      {/* Render the visual toast */}
      <Toast {...props}>
        <div className="grid gap-1">
          {title && <ToastTitle>{title}</ToastTitle>}
          {description && (
            <ToastDescription>{description}</ToastDescription>
          )}
        </div>
        {action}
        <ToastClose />
      </Toast>
    </>
  );
}

export { ToastAction };
