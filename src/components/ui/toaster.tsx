
import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { AccessibleToast } from "./accessible-toast";

/**
 * Toaster Component
 * 
 * Renders a toast notification container with accessibility enhancements
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensures toast notifications are accessible
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <AccessibleToast
            key={id}
            title={title}
            description={description}
            action={action}
            // Set assertive for high priority toasts like errors
            assertive={props.variant === "destructive"}
            {...props}
          />
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
