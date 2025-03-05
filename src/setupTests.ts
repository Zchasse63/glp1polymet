
// Jest setup file
import '@testing-library/jest-dom';

// Add any global mocks here
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Set up global test environment
beforeAll(() => {
  // Configure global test environment
  console.error = jest.fn();
});

afterAll(() => {
  // Clean up global mocks
  jest.restoreAllMocks();
});

