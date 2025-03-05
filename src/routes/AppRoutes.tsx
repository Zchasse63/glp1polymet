
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import HealthPage from "../pages/HealthPage";
import MedicationPage from "../pages/MedicationPage";
import InsightsPage from "../pages/InsightsPage";
import AuthPage from "../pages/AuthPage";
import UserProfilePage from "../pages/UserProfilePage";
import AppSettingsPage from "../pages/AppSettingsPage";
import SubscriptionPage from "../pages/SubscriptionPage";
import AppIntegrationsPage from "../pages/AppIntegrationsPage";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const AppRoutes = () => {
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

export default AppRoutes;
