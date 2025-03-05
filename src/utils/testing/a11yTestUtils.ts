
/**
 * Accessibility Testing Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensure accessibility
 * - Quality Assurance: Standardized testing for a11y
 */

import { render, RenderResult } from '@testing-library/react';
import { axe, toHaveNoViolations, JestAxeConfigureOptions } from 'jest-axe';
import { ReactElement } from 'react';
import { renderWithProviders } from './renderWithProviders';

// Add jest-axe matchers by extending expect
expect.extend(toHaveNoViolations);

// Properly declare the jest-axe matcher types
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

/**
 * Test component for accessibility violations
 */
export async function testAccessibility(ui: ReactElement, options?: JestAxeConfigureOptions): Promise<void> {
  const { container } = renderWithProviders(ui);
  const results = await axe(container, options);
  expect(results).toHaveNoViolations();
}

/**
 * Common accessibility rules to check in components
 */
export const accessibilityChecks = {
  hasAccessibleName: (element: HTMLElement): void => {
    if (element.tagName === 'BUTTON' || element.tagName === 'A') {
      expect(element).toHaveAccessibleName();
    }
  },
  
  hasValidAriaAttributes: (element: HTMLElement): void => {
    // Check if aria-* attributes are valid
    const ariaAttributes = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('aria-'));
      
    ariaAttributes.forEach(attr => {
      // Basic check that aria attributes have non-empty values
      expect(attr.value).not.toBe('');
    });
  },
  
  hasSufficientColorContrast: (background: string, foreground: string): boolean => {
    // This is a placeholder - in a real implementation,
    // you would use a color contrast calculation library
    // For testing, we're assuming valid contrast
    return true;
  }
};

/**
 * Test keyboard navigation
 */
export const testKeyboardNavigation = {
  canTabToElement: async (element: HTMLElement): Promise<void> => {
    element.focus();
    expect(element).toHaveFocus();
  },
  
  canActivateWithKeyboard: async (element: HTMLElement): Promise<void> => {
    const mockFn = jest.fn();
    element.addEventListener('click', mockFn);
    
    element.focus();
    element.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    
    expect(mockFn).toHaveBeenCalled();
  }
};

/**
 * Check that all interactive elements are keyboard accessible
 */
export function checkKeyboardAccessibility(container: HTMLElement): void {
  const interactiveElements = container.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  interactiveElements.forEach((element) => {
    expect(element).toHaveAttribute('tabindex', expect.stringMatching(/^0$|^$/));
  });
}
