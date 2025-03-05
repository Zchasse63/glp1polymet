
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';

/**
 * Create a fresh Query Client for each test
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
}

/**
 * Custom render function that includes all providers
 * Simplifies test setup and ensures consistency
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient;
  route?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    queryClient = createTestQueryClient(),
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Set up window.location for router tests
  window.history.pushState({}, 'Test page', route);

  function AllTheProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <ThemeProvider>
              <HelmetProvider>
                <BrowserRouter>{children}</BrowserRouter>
              </HelmetProvider>
            </ThemeProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
}

/**
 * Custom async utilities
 */
export const waitForLoadingToFinish = async () => {
  // This utility can be expanded based on application loading indicators
  return await Promise.resolve();
};

/**
 * Custom test data generator for health metrics
 */
export const generateTestHealthData = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      id: `test-data-${i}`,
      date: date.toISOString().split('T')[0],
      weight: 180 - (i * 0.2),
      sleepHours: 7 + Math.random(),
      caloriesConsumed: 2000 - (i * 10),
      stressLevel: Math.floor(Math.random() * 10),
      stepCount: 8000 + Math.floor(Math.random() * 4000)
    });
  }
  
  return data;
};

/**
 * Mock local storage for tests
 */
export class LocalStorageMock {
  private store: { [key: string]: string } = {};

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

/**
 * Setup global mocks for tests
 */
export function setupTestEnvironment() {
  // Mock localStorage
  global.localStorage = new LocalStorageMock() as unknown as Storage;

  // Mock IntersectionObserver
  class IntersectionObserverMock {
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock
  });

  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
