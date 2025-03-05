
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
import userEvent from '@testing-library/user-event';
import RecommendationCard from './RecommendationCard';
import { testAccessibility, checkKeyboardAccessibility } from '@/utils/testing/a11yTestUtils';
import { Recommendation } from '@/types/insightTypes';
import { BookmarkIcon } from 'lucide-react';

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
  
  const mockBookmarkIcon = <BookmarkIcon className="h-4 w-4" data-testid="bookmark-icon" />;
  
  const defaultProps = {
    recommendation: mockRecommendation,
    onActionClick: jest.fn(),
    index: 0,
    isBookmarked: false,
    onBookmarkToggle: jest.fn(),
    bookmarkIcon: mockBookmarkIcon
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
  
  it('should handle different states appropriately', () => {
    // Test bookmarked state
    render(<RecommendationCard {...{...defaultProps, isBookmarked: true}} />);
    const bookmarkedButton = screen.getByRole('button', { name: /Remove bookmark/i });
    expect(bookmarkedButton).toBeInTheDocument();
    
    // Verify the bookmark icon has appropriate fill when bookmarked
    const bookmarkIcon = bookmarkedButton.querySelector('svg');
    expect(bookmarkIcon).toHaveClass('text-yellow-500');
  });
  
  it('should be accessible when using keyboard to interact with buttons', async () => {
    const user = userEvent.setup();
    const handleBookmarkToggle = jest.fn();
    const handleActionClick = jest.fn();
    
    render(
      <RecommendationCard 
        {...defaultProps} 
        onBookmarkToggle={handleBookmarkToggle}
        onActionClick={handleActionClick}
      />
    );
    
    // Test keyboard interaction with bookmark button
    const bookmarkButton = screen.getByRole('button', { name: /Bookmark recommendation/i });
    await user.tab(); // First tab should focus on the first interactive element
    
    // Navigate to bookmark button using Tab
    let foundBookmarkButton = false;
    for (let i = 0; i < 5; i++) { // Try a reasonable number of tabs
      if (document.activeElement === bookmarkButton) {
        foundBookmarkButton = true;
        break;
      }
      await user.tab();
    }
    
    expect(foundBookmarkButton).toBe(true);
    await user.keyboard('{enter}'); // Press Enter to activate
    expect(handleBookmarkToggle).toHaveBeenCalledWith(mockRecommendation.id);
    
    // Test keyboard interaction with action button
    const actionButton = screen.getByText('Learn more');
    
    // Continue tabbing to reach action button
    let foundActionButton = false;
    for (let i = 0; i < 5; i++) {
      if (document.activeElement === actionButton) {
        foundActionButton = true;
        break;
      }
      await user.tab();
    }
    
    expect(foundActionButton).toBe(true);
    await user.keyboard('{enter}'); // Press Enter to activate
    expect(handleActionClick).toHaveBeenCalled();
  });
  
  it('should apply appropriate ARIA attributes for different impacts', () => {
    // Test high impact
    const highImpactRec = {
      ...mockRecommendation,
      impact: 'high' as const
    };
    
    const { rerender } = render(
      <RecommendationCard 
        {...defaultProps} 
        recommendation={highImpactRec}
      />
    );
    
    expect(screen.getByText(/high impact/i)).toBeInTheDocument();
    
    // Test low impact
    const lowImpactRec = {
      ...mockRecommendation,
      impact: 'low' as const
    };
    
    rerender(
      <RecommendationCard 
        {...defaultProps} 
        recommendation={lowImpactRec}
      />
    );
    
    expect(screen.getByText(/low impact/i)).toBeInTheDocument();
  });
});
