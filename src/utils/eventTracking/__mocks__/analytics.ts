
/**
 * Mock analytics module for testing
 */

const analytics = {
  trackEvent: jest.fn(),
  identify: jest.fn(),
  setUserProperties: jest.fn(),
  pageView: jest.fn(),
  addProvider: jest.fn(),
  removeProvider: jest.fn(),
  getProvider: jest.fn(),
  initialize: jest.fn().mockResolvedValue(true),
  configure: jest.fn(),
};

export default analytics;

// Re-export utility types for tests
export { EventCategory, EventPriority } from '../types';
