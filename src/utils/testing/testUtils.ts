
/**
 * Common Test Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Sustainable Code: Reusable testing utilities
 * - Continuous Learning: Standardized testing approach
 */
import { ReactElement } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './renderWithProviders';

/**
 * Find element by text content
 */
export const findByText = async (text: string | RegExp): Promise<HTMLElement> => {
  return await screen.findByText(text);
};

/**
 * Wait for element to be removed
 */
export const waitForElementToBeRemoved = async (element: HTMLElement): Promise<void> => {
  return await waitFor(() => expect(element).not.toBeInTheDocument());
};

/**
 * Helper to test toast notifications
 */
export const expectToastToBeShown = async (toastMatcher: string | RegExp): Promise<void> => {
  const toast = jest.requireMock('@/components/ui/use-toast').toast;
  await waitFor(() => {
    expect(toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringMatching(toastMatcher) || expect.any(String),
        description: expect.stringMatching(toastMatcher) || expect.any(String),
      })
    );
  });
};

/**
 * Renders component with recommended testing utilities
 */
export const renderComponent = (ui: ReactElement) => {
  return {
    user: userEvent.setup(),
    ...renderWithProviders(ui),
  };
};

/**
 * Click helper with user-event
 */
export const clickElement = async (element: HTMLElement): Promise<void> => {
  const user = userEvent.setup();
  await user.click(element);
};

/**
 * Form input helper with user-event
 */
export const typeIntoInput = async (
  inputElement: HTMLElement, 
  value: string
): Promise<void> => {
  const user = userEvent.setup();
  await user.type(inputElement, value);
};

/**
 * Clear input and type new value
 */
export const clearAndType = async (
  inputElement: HTMLElement,
  value: string
): Promise<void> => {
  const user = userEvent.setup();
  await user.clear(inputElement);
  await user.type(inputElement, value);
};

/**
 * Select option from dropdown
 */
export const selectOption = async (
  selectElement: HTMLElement,
  optionText: string
): Promise<void> => {
  const user = userEvent.setup();
  await user.selectOptions(
    selectElement, 
    screen.getByRole('option', { name: optionText })
  );
};

/**
 * Wait for loading state to be complete
 * This is useful when testing components that have loading states
 */
export const waitForLoadingToComplete = async (): Promise<void> => {
  // Try to find common loading indicators
  const loadingElements = screen.queryAllByText(/loading|spinner|please wait/i);
  
  if (loadingElements.length > 0) {
    await waitFor(() => {
      loadingElements.forEach(element => {
        expect(element).not.toBeInTheDocument();
      });
    });
  }
};

/**
 * Mock implementation for ResizeObserver which is not available in JSDOM
 */
export const setupResizeObserverMock = (): void => {
  class ResizeObserverMock {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  global.ResizeObserver = ResizeObserverMock as any;
};

/**
 * Clean up mocks after tests
 */
export const cleanupMocks = (): void => {
  jest.clearAllMocks();
};
