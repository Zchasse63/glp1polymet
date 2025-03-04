import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import HealthPage from "./pages/HealthPage";
import MedicationPage from "./pages/MedicationPage";
import InsightsPage from "./pages/InsightsPage";
import AuthPage from "./pages/AuthPage";
import UserProfilePage from "./pages/UserProfilePage";
import AppSettingsPage from "./pages/AppSettingsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import AppIntegrationsPage from "./pages/AppIntegrationsPage";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const AppRoutes = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme as "light" | "dark");
    
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    localStorage.setItem("theme", initialTheme);
  }, []);
  
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
      <Route path="/health" element={<PrivateRoute><HealthPage /></PrivateRoute>} />
      <Route path="/medications" element={<PrivateRoute><MedicationPage /></PrivateRoute>} />
      <Route path="/insights" element={<PrivateRoute><InsightsPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><UserProfilePage /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><AppSettingsPage /></PrivateRoute>} />
      <Route path="/subscription" element={<PrivateRoute><SubscriptionPage /></PrivateRoute>} />
      <Route path="/integrations" element={<PrivateRoute><AppIntegrationsPage /></PrivateRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
