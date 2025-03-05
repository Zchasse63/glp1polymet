
/**
 * Accessibility testing utilities
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensure accessibility
 * - Continuous Learning: Apply best practices
 * - Quality Assurance: Comprehensive testing
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
 * Check keyboard accessibility of a component
 * Verifies that all interactive elements are keyboard accessible
 */
export function checkKeyboardAccessibility(container: HTMLElement): void {
  // Find all potentially interactive elements
  const interactiveElements = container.querySelectorAll(
    'button, [role="button"], a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  // Ensure there are interactive elements
  expect(interactiveElements.length).toBeGreaterThan(0);
  
  // Check each element for keyboard accessibility
  interactiveElements.forEach(element => {
    // Elements should be focusable
    const tabIndex = element.getAttribute('tabindex');
    expect(tabIndex === null || parseInt(tabIndex) >= 0).toBe(true);
    
    // Check for click handlers or href for links
    if (element.tagName === 'A') {
      expect(element).toHaveAttribute('href');
    }
    
    // Check buttons have accessible attributes
    if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
      expect(element).not.toHaveAttribute('aria-hidden', 'true');
      // Either element has accessible name or it has aria-labelledby/aria-label
      const hasAccessibleName = element.textContent?.trim().length > 0 || 
                               element.getAttribute('aria-label') !== null || 
                               element.getAttribute('aria-labelledby') !== null;
      expect(hasAccessibleName).toBe(true);
    }
  });
}

/**
 * Simulates keyboard navigation through a component
 * Returns elements in the order they would be focused
 */
export function getTabbableElements(container: HTMLElement): HTMLElement[] {
  // Get all elements that can receive focus
  const elements = Array.from(container.querySelectorAll(
    'button, [role="button"], a, input, select, textarea, [tabindex="0"]'
  )) as HTMLElement[];
  
  // Filter out hidden elements and those with negative tabindex
  const visibleElements = elements.filter(el => {
    // Check if element or its ancestor is hidden
    const isVisible = !el.hidden && 
                     window.getComputedStyle(el).display !== 'none' && 
                     window.getComputedStyle(el).visibility !== 'hidden';
    
    // Check tabindex
    const tabIndex = el.getAttribute('tabindex');
    const isValidTabIndex = tabIndex === null || parseInt(tabIndex) >= 0;
    
    return isVisible && isValidTabIndex;
  });
  
  return visibleElements;
}

/**
 * Test focus handling in a modal or dialog
 */
export function testModalFocusTrap(container: HTMLElement): void {
  const tabbableElements = getTabbableElements(container);
  
  // Modal should have at least one focusable element
  expect(tabbableElements.length).toBeGreaterThan(0);
  
  // First element should be focusable
  expect(tabbableElements[0].tabIndex).not.toBe(-1);
  
  // Last element should be focusable
  expect(tabbableElements[tabbableElements.length - 1].tabIndex).not.toBe(-1);
}
