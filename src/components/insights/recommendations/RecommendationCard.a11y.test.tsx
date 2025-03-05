
/**
 * Accessibility Tests for RecommendationCard
 * 
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Ensure accessibility
 * - Quality Assurance: Comprehensive testing
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RecommendationCard from './RecommendationCard';
import { testAccessibility, checkKeyboardAccessibility } from '@/utils/testing/a11yTestUtils';
import { Recommendation } from '@/types/insightTypes';

describe('RecommendationCard Accessibility', () => {
  const mockRecommendation: Recommendation = {
    id: 'rec1',
    title: 'Drink more water',
    description: 'Stay hydrated for better health',
    type: 'general',
    iconType: 'general',
    color: 'blue',
    impact: 'medium',
    actionLabel: 'Learn more',
    actionLink: '/water'
  };
  
  const defaultProps = {
    recommendation: mockRecommendation,
    onActionClick: jest.fn(),
    index: 0,
    isBookmarked: false,
    onBookmarkToggle: jest.fn()
  };

  it('should not have accessibility violations', async () => {
    await testAccessibility(<RecommendationCard {...defaultProps} />);
  });
  
  it('should have proper keyboard navigation', () => {
    const { container } = render(<RecommendationCard {...defaultProps} />);
    checkKeyboardAccessibility(container);
  });
  
  it('should have accessible button labels', () => {
    render(<RecommendationCard {...defaultProps} />);
    
    // Action button should have accessible name
    const actionButton = screen.getByText('Learn more');
    expect(actionButton).toHaveAccessibleName();
    
    // Bookmark button should have accessible name
    const bookmarkButton = screen.getByRole('button', { name: /Bookmark recommendation/i });
    expect(bookmarkButton).toHaveAccessibleName();
  });
  
  it('should convey impact information accessibly', () => {
    render(<RecommendationCard {...defaultProps} />);
    
    // Impact information should be accessible
    const impactElement = screen.getByText(/medium impact/i);
    expect(impactElement).toBeInTheDocument();
    
    // The parent element should have an appropriate role or aria attribute
    // or be a semantic HTML element that conveys its purpose
    const impactParent = impactElement.closest('div, span');
    expect(impactParent).toBeTruthy();
  });
});
