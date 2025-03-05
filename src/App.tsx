
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRoutes from "./routes/AppRoutes";
import { EnhancedErrorBoundary } from "./utils/errorHandling";
import { createQueryClient } from "./lib/queryClient";
import { useEffect } from "react";
import { setupGlobalErrorHandlers } from "./utils/errorHandling";
import { useSkipLink } from "./utils/accessibilityUtils";

// Create a QueryClient instance with enhanced configuration
const queryClient = createQueryClient();

const App = () => {
  // Set up global error handlers
  useEffect(() => {
    setupGlobalErrorHandlers();
  }, []);
  
  // Add skip link for keyboard accessibility
  const { skipLinkComponent } = useSkipLink('app-main-content');
  
  return (
    <EnhancedErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ThemeProvider>
              <HelmetProvider>
                {skipLinkComponent}
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <main id="app-main-content">
                    <AppRoutes />
                  </main>
                </BrowserRouter>
              </HelmetProvider>
            </ThemeProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
};

export default App;
