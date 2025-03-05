
import React from 'react';
import { render, screen } from '@testing-library/react';
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

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
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

  it('renders recommendation cards', () => {
    renderWithProviders(<RecommendationList recommendations={mockRecommendations} />);
    
    expect(screen.getByText('Drink more water')).toBeInTheDocument();
    expect(screen.getByText('Exercise daily')).toBeInTheDocument();
  });

  it('handles empty recommendations', () => {
    renderWithProviders(<RecommendationList recommendations={[]} />);
    
    expect(screen.queryByText('Drink more water')).not.toBeInTheDocument();
  });
});
