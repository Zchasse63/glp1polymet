
/**
 * Main Application Component
 * 
 * Following CodeFarm Development Methodology:
 * - Holistic Development: Integration of all architectural components
 * - Sustainable Code: Clean component hierarchy
 * - User-Centric Design: Consistent user experience
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nProvider } from "./lib/i18n";
import AppRoutes from "./routes/AppRoutes";
import { EnhancedErrorBoundary, setupGlobalErrorHandlers } from "./utils/errorHandling";
import { createQueryClient } from "./lib/queryClient";
import { useEffect } from "react";
import { initPerformanceMonitoring } from "./utils/performance"; // Updated import path
import { useSkipLink } from "./utils/accessibilityUtils";

// Create a QueryClient instance with enhanced configuration
const queryClient = createQueryClient();

const App = () => {
  // Set up global error handlers
  useEffect(() => {
    setupGlobalErrorHandlers();
    initPerformanceMonitoring();
  }, []);
  
  // Add skip link for keyboard accessibility
  const { skipLinkComponent } = useSkipLink('app-main-content');
  
  return (
    <EnhancedErrorBoundary>
      <I18nProvider>
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
      </I18nProvider>
    </EnhancedErrorBoundary>
  );
};

export default App;
