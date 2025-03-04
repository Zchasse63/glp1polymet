
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ProgressJourney from "./pages/ProgressJourney";
import MedicationTracker from "./pages/MedicationTracker";
import Insights from "./pages/Insights";

const queryClient = new QueryClient();

// AppRoutes component manages the routes and navigation
function AppRoutes() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");

  // Effect to sync route with currentPage state
  useEffect(() => {
    // Map routes to page names
    const routeToPage = {
      "/": "dashboard",
      "/medications": "medication",
      "/progress": "progress",
      "/insights": "insights",
    };

    // Set the current page based on the route
    const path = location.pathname;
    if (routeToPage[path as keyof typeof routeToPage]) {
      setCurrentPage(routeToPage[path as keyof typeof routeToPage]);
    }
  }, [location]);

  // Effect to handle navigation when currentPage changes
  useEffect(() => {
    // Map page names to routes
    const pageToRoute = {
      "dashboard": "/",
      "medication": "/medications",
      "progress": "/progress",
      "insights": "/insights",
    };

    // Navigate to the appropriate route when currentPage changes
    const route = pageToRoute[currentPage as keyof typeof pageToRoute];
    if (route && location.pathname !== route) {
      navigate(route);
    }
  }, [currentPage, navigate, location.pathname]);

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/progress" element={<ProgressJourney />} />
        <Route path="/medications" element={<MedicationTracker />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
