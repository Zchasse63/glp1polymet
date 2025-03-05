
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // This import is necessary for toBeInTheDocument matcher
import RecommendationList from './RecommendationList';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { Recommendation } from '@/types/insightTypes';

// Mock the hooks and utilities
jest.mock('@/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    isBookmarked: (id: string) => id === 'rec1',
    toggleBookmark: jest.fn(),
  }),
}));

jest.mock('@/utils/performance', () => ({
  useComponentPerformance: () => ({
    trackMount: () => jest.fn(),
  }),
}));

const mockToast = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  toast: (...args: any[]) => mockToast(...args),
}));

describe('RecommendationList', () => {
  const mockRecommendations: Recommendation[] = [
    {
      id: 'rec1',
      title: 'Drink more water',
      description: 'Stay hydrated for better health',
      type: 'general',
      iconType: 'general',
      color: 'blue',
      impact: 'medium',
      actionLabel: 'Learn more',
      actionLink: '/water'
    },
    {
      id: 'rec2',
      title: 'Exercise daily',
      description: 'Regular exercise improves health',
      type: 'activity',
      iconType: 'activity',
      color: 'green',
      impact: 'high',
      actionLabel: 'Start now',
      actionLink: '/exercise'
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders recommendation cards', () => {
    renderWithProviders(<RecommendationList recommendations={mockRecommendations} />);
    
    expect(screen.getByText('Drink more water')).toBeInTheDocument();
    expect(screen.getByText('Exercise daily')).toBeInTheDocument();
  });

  it('handles empty recommendations', () => {
    renderWithProviders(<RecommendationList recommendations={[]} />);
    
    expect(screen.queryByText('Drink more water')).not.toBeInTheDocument();
  });
  
  it('calls handleRecommendationClick when action button is clicked', () => {
    renderWithProviders(<RecommendationList recommendations={mockRecommendations} />);
    
    // Find and click a recommendation action button
    const actionButton = screen.getAllByText(/Learn more|Start now/)[0];
    fireEvent.click(actionButton);
    
    // Check if toast was called
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.any(String),
        description: expect.stringContaining("saved this recommendation"),
      })
    );
  });
  
  it('calls handleBookmarkToggle when bookmark button is clicked', () => {
    const { toggleBookmark } = require('@/hooks/useBookmarks').useBookmarks();
    renderWithProviders(<RecommendationList recommendations={mockRecommendations} />);
    
    // Find and click bookmark buttons (using aria-label)
    const bookmarkButtons = screen.getAllByRole('button', { 
      name: /Remove bookmark|Bookmark recommendation/
    });
    fireEvent.click(bookmarkButtons[0]);
    
    // Verify the bookmark toggle function was called
    expect(toggleBookmark).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.stringContaining("Bookmark"),
      })
    );
  });
});
