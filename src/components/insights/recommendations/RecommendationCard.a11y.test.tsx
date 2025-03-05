
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import RecommendationCard from './RecommendationCard';
import { 
  Recommendation, 
  RecommendationType, 
  RecommendationIconType 
} from '@/types/insightTypes';
import { vi } from 'vitest';
import { BookmarkIcon, BookmarkFilledIcon } from '@radix-ui/react-icons';

describe('RecommendationCard Accessibility', () => {
  const mockRecommendation: Recommendation = {
    id: '123',
    title: 'Sample Recommendation',
    description: 'This is a description of the recommendation',
    type: RecommendationType.EXERCISE,
    iconType: RecommendationIconType.ACTIVITY,
    color: 'green',
    impact: 'medium',
    actionLabel: 'Learn More',
    actionLink: '/recommendations/123'
  };

  const mockOnActionClick = vi.fn();
  const mockOnBookmarkToggle = vi.fn();

  // Define bookmark icons
  const bookmarkIcon = <BookmarkIcon className="h-4 w-4" />;
  const bookmarkFilledIcon = <BookmarkFilledIcon className="h-4 w-4" />;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onActionClick={mockOnActionClick}
        index={0}
        isBookmarked={false}
        onBookmarkToggle={mockOnBookmarkToggle}
        bookmarkIcon={bookmarkIcon}
        bookmarkFilledIcon={bookmarkFilledIcon}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have appropriate ARIA roles and labels', () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onActionClick={mockOnActionClick}
        index={0}
        isBookmarked={false}
        onBookmarkToggle={mockOnBookmarkToggle}
        bookmarkIcon={bookmarkIcon}
        bookmarkFilledIcon={bookmarkFilledIcon}
      />
    );

    // Card should have appropriate region role
    const card = screen.getByRole('region');
    expect(card).toBeInTheDocument();
    expect(card).toHaveAccessibleName(mockRecommendation.title);

    // Action button should have accessible name
    const actionButton = screen.getByRole('button', { name: mockRecommendation.actionLabel });
    expect(actionButton).toBeInTheDocument();
  });

  it('should have proper keyboard navigation', async () => {
    render(
      <RecommendationCard
        recommendation={mockRecommendation}
        onActionClick={mockOnActionClick}
        index={0}
        isBookmarked={false}
        onBookmarkToggle={mockOnBookmarkToggle}
        bookmarkIcon={bookmarkIcon}
        bookmarkFilledIcon={bookmarkFilledIcon}
      />
    );

    const user = userEvent.setup();
    
    // Tab to the bookmark button
    await user.tab();
    const bookmarkButton = document.activeElement;
    expect(bookmarkButton).toHaveAttribute('aria-label', 'Bookmark recommendation');
    
    // Press the bookmark button
    await user.keyboard('{Enter}');
    expect(mockOnBookmarkToggle).toHaveBeenCalledTimes(1);
    
    // Tab to the action button
    await user.tab();
    const actionButton = document.activeElement;
    expect(actionButton).toHaveTextContent(mockRecommendation.actionLabel);
    
    // Press the action button
    await user.keyboard('{Enter}');
    expect(mockOnActionClick).toHaveBeenCalledTimes(1);
  });

  it('should display bookmarked state correctly', () => {
    render(
      <RecommendationCard
        isBookmarked={true}
        recommendation={mockRecommendation}
        onActionClick={mockOnActionClick}
        index={0}
        onBookmarkToggle={mockOnBookmarkToggle}
        bookmarkIcon={bookmarkIcon}
        bookmarkFilledIcon={bookmarkFilledIcon}
      />
    );

    const bookmarkButton = screen.getByRole('button', { name: /bookmark/i });
    expect(bookmarkButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('should announce impact level through appropriate visual and aria properties', () => {
    const { rerender } = render(
      <RecommendationCard
        onBookmarkToggle={mockOnBookmarkToggle}
        onActionClick={mockOnActionClick}
        recommendation={mockRecommendation}
        index={0}
        isBookmarked={false}
        bookmarkIcon={bookmarkIcon}
        bookmarkFilledIcon={bookmarkFilledIcon}
      />
    );

    // Check medium impact (default in our mock)
    const impactBadge = screen.getByText(/medium impact/i);
    expect(impactBadge).toBeInTheDocument();

    // Rerender with high impact
    const highImpactRecommendation = {
      ...mockRecommendation,
      impact: 'high'
    };

    rerender(
      <RecommendationCard
        recommendation={highImpactRecommendation}
        onActionClick={mockOnActionClick}
        index={0}
        isBookmarked={false}
        onBookmarkToggle={mockOnBookmarkToggle}
        bookmarkIcon={bookmarkIcon}
        bookmarkFilledIcon={bookmarkFilledIcon}
      />
    );

    const highImpactBadge = screen.getByText(/high impact/i);
    expect(highImpactBadge).toBeInTheDocument();

    // Rerender with low impact
    const lowImpactRecommendation = {
      ...mockRecommendation,
      impact: 'low'
    };

    rerender(
      <RecommendationCard
        recommendation={lowImpactRecommendation}
        onActionClick={mockOnActionClick}
        index={0}
        isBookmarked={false}
        onBookmarkToggle={mockOnBookmarkToggle}
        bookmarkIcon={bookmarkIcon}
        bookmarkFilledIcon={bookmarkFilledIcon}
      />
    );

    const lowImpactBadge = screen.getByText(/low impact/i);
    expect(lowImpactBadge).toBeInTheDocument();
  });
});
