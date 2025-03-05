
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import RecommendationList from './RecommendationList';
import { renderWithProviders } from '@/utils/testing/renderWithProviders';
import { Recommendation } from '@/types/insightTypes';
import { renderComponent, expectToastToBeShown } from '@/utils/testing/testUtils';
import { ErrorLogger } from '@/utils/errorHandling';

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

// Mock ErrorLogger
jest.mock('@/utils/errorHandling', () => ({
  ErrorLogger: {
    error: jest.fn(),
  },
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
  
  it('calls handleRecommendationClick when action button is clicked', async () => {
    const { user } = renderComponent(<RecommendationList recommendations={mockRecommendations} />);
    
    // Find and click a recommendation action button
    const actionButton = screen.getAllByText(/Learn more|Start now/)[0];
    await user.click(actionButton);
    
    // Check if toast was called
    await expectToastToBeShown(/Drink more water/);
    expect(mockToast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.any(String),
        description: expect.stringContaining("saved this recommendation"),
      })
    );
  });
  
  it('calls handleBookmarkToggle when bookmark button is clicked', async () => {
    const { toggleBookmark } = require('@/hooks/useBookmarks').useBookmarks();
    const { user } = renderComponent(<RecommendationList recommendations={mockRecommendations} />);
    
    // Find and click bookmark buttons (using aria-label)
    const bookmarkButtons = screen.getAllByRole('button', { 
      name: /Remove bookmark|Bookmark recommendation/
    });
    await user.click(bookmarkButtons[0]);
    
    // Verify the bookmark toggle function was called
    expect(toggleBookmark).toHaveBeenCalled();
    await expectToastToBeShown(/Bookmark/);
  });

  it('handles errors when clicking action button', async () => {
    // Setup console.error mock to prevent actual console errors in tests
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    // Mock console.log to verify logging
    const originalConsoleLog = console.log;
    console.log = jest.fn();
    
    // Setup toast to throw an error
    mockToast.mockImplementationOnce(() => {
      throw new Error('Toast error');
    });
    
    renderComponent(<RecommendationList recommendations={mockRecommendations} />);
    
    // Find and click a recommendation action button
    const actionButton = screen.getAllByText(/Learn more|Start now/)[0];
    fireEvent.click(actionButton);
    
    // Verify error was logged
    await waitFor(() => {
      expect(ErrorLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to process recommendation click'),
        'RECOMMENDATION_CLICK_ERROR',
        expect.any(Object),
        expect.any(Error),
        true,
        expect.any(String)
      );
    });
    
    // Restore console methods
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
  });

  it('handles errors when toggling bookmarks', async () => {
    const { toggleBookmark } = require('@/hooks/useBookmarks').useBookmarks();
    toggleBookmark.mockImplementationOnce(() => {
      throw new Error('Bookmark error');
    });
    
    renderComponent(<RecommendationList recommendations={mockRecommendations} />);
    
    // Find and click bookmark button
    const bookmarkButtons = screen.getAllByRole('button', { 
      name: /Remove bookmark|Bookmark recommendation/
    });
    fireEvent.click(bookmarkButtons[0]);
    
    // Verify error was logged
    await waitFor(() => {
      expect(ErrorLogger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed to toggle bookmark'),
        'BOOKMARK_TOGGLE_ERROR',
        expect.any(Object),
        expect.any(Error),
        true,
        expect.any(String)
      );
    });
  });
});
