
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useAuth } from '@/contexts/AuthContext';
import { ScreenReaderAnnouncement } from '@/utils/accessibility';
import { usePageChangeAnnouncer } from '@/utils/a11y/usePageChangeAnnouncer';
import {
  SuspenseIndex,
  SuspenseAuthPage,
  SuspenseHealthPage,
  SuspenseInsightsPage,
  SuspenseMedicationPage,
  SuspenseUserProfilePage,
  SuspenseAppSettingsPage,
  SuspenseAppIntegrationsPage,
  SuspenseSubscriptionPage,
  SuspenseNotFound
} from './LazyRoutes';

// Protected Route component that redirects to login if not authenticated
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Routes with accessibility enhancements
export const AppRoutes = () => {
  // Announce page changes to screen readers
  const { pageTitle, pageAnnouncement } = usePageChangeAnnouncer();

  return (
    <>
      {/* Announce page changes to screen readers */}
      <ScreenReaderAnnouncement message={pageAnnouncement} />
      
      {/* Update document title when it changes */}
      {pageTitle && <title>{pageTitle}</title>}
      
      <ErrorBoundary>
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<SuspenseAuthPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <SuspenseIndex />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/health" 
            element={
              <ProtectedRoute>
                <SuspenseHealthPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/insights" 
            element={
              <ProtectedRoute>
                <SuspenseInsightsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/medications" 
            element={
              <ProtectedRoute>
                <SuspenseMedicationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <SuspenseUserProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SuspenseAppSettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/integrations" 
            element={
              <ProtectedRoute>
                <SuspenseAppIntegrationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscription" 
            element={
              <ProtectedRoute>
                <SuspenseSubscriptionPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fall-back routes */}
          <Route path="*" element={<SuspenseNotFound />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
};
