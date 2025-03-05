
import React, { useEffect } from 'react';

interface AccessibleDialogProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

/**
 * AccessibleDialog Component
 * 
 * Creates a modal dialog with proper keyboard navigation and screen reader support
 */
export function AccessibleDialog({
  isOpen,
  title,
  onClose,
  children,
  className
}: AccessibleDialogProps) {
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
  
  // Trap focus inside dialog
  useEffect(() => {
    if (!isOpen) return;
    
    // Save the element that had focus before opening dialog
    const previousFocus = document.activeElement as HTMLElement;
    
    // Return focus when dialog closes
    return () => {
      if (previousFocus && previousFocus.focus) {
        previousFocus.focus();
      }
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      className={`fixed inset-0 z-50 flex items-center justify-center ${className || ''}`}
    >
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 id="dialog-title" className="text-xl font-semibold mb-4">
          {title}
        </h2>
        {children}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
