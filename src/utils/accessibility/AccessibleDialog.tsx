
import React, { useEffect, useRef } from 'react';
import { useFocusTrap } from './useFocusTrap';

interface AccessibleDialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  description?: string;
  ariaLabel?: string;
  autoFocus?: boolean;
}

/**
 * AccessibleDialog Component
 * 
 * Creates a modal dialog with proper keyboard navigation and screen reader support
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensures dialogs are accessible to all users
 */
export function AccessibleDialog({
  isOpen,
  title,
  onClose,
  children,
  className,
  description,
  ariaLabel,
  autoFocus = true
}: AccessibleDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  
  // Use the focus trap hook
  const { trapFocus, releaseFocus } = useFocusTrap();
  
  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
  
  // Set up focus trap when dialog opens
  useEffect(() => {
    if (isOpen && dialogRef.current) {
      // Small delay to ensure the dialog is fully rendered
      const timeoutId = setTimeout(() => {
        trapFocus(dialogRef.current as HTMLElement, autoFocus);
      }, 50);
      
      return () => {
        clearTimeout(timeoutId);
        releaseFocus();
      };
    }
  }, [isOpen, trapFocus, releaseFocus, autoFocus]);
  
  // Prevent scroll on body when dialog is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby={description ? "dialog-description" : undefined}
      aria-label={ariaLabel}
      className={`fixed inset-0 z-50 flex items-center justify-center ${className || ''}`}
      ref={dialogRef}
    >
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Dialog content */}
      <div className="relative bg-background p-6 rounded-lg shadow-lg max-w-md w-full focus:outline-none">
        <h2 id="dialog-title" className="text-xl font-semibold mb-2">
          {title}
        </h2>
        
        {description && (
          <p id="dialog-description" className="text-muted-foreground mb-4">
            {description}
          </p>
        )}
        
        {children}
        
        {/* Close button - placed at the beginning of tab order for keyboard users */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>
    </div>
  );
}
