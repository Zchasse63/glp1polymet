
import React, { lazy, Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner';

// Loading component for Suspense fallback
const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <Spinner size="large" />
  </div>
);

// Lazy loaded pages with Suspense
export const LazyIndex = lazy(() => import('@/pages/Index'));
export const LazyAuthPage = lazy(() => import('@/pages/AuthPage'));
export const LazyHealthPage = lazy(() => import('@/pages/HealthPage'));
export const LazyInsightsPage = lazy(() => import('@/pages/InsightsPage'));
export const LazyMedicationPage = lazy(() => import('@/pages/MedicationPage'));
export const LazyUserProfilePage = lazy(() => import('@/pages/UserProfilePage'));
export const LazyAppSettingsPage = lazy(() => import('@/pages/AppSettingsPage'));
export const LazyAppIntegrationsPage = lazy(() => import('@/pages/AppIntegrationsPage'));
export const LazySubscriptionPage = lazy(() => import('@/pages/SubscriptionPage'));
export const LazyNotFound = lazy(() => import('@/pages/NotFound'));

// HOC to apply Suspense with loading fallback to any component
export const withSuspense = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

// Create Suspense-wrapped exports of all lazy components
export const SuspenseIndex = withSuspense(LazyIndex);
export const SuspenseAuthPage = withSuspense(LazyAuthPage);
export const SuspenseHealthPage = withSuspense(LazyHealthPage);
export const SuspenseInsightsPage = withSuspense(LazyInsightsPage);
export const SuspenseMedicationPage = withSuspense(LazyMedicationPage);
export const SuspenseUserProfilePage = withSuspense(LazyUserProfilePage);
export const SuspenseAppSettingsPage = withSuspense(LazyAppSettingsPage);
export const SuspenseAppIntegrationsPage = withSuspense(LazyAppIntegrationsPage);
export const SuspenseSubscriptionPage = withSuspense(LazySubscriptionPage);
export const SuspenseNotFound = withSuspense(LazyNotFound);
