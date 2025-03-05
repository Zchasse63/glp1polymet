
/**
 * Performance tests for Analytics Manager
 */
import analytics from './AnalyticsManager';
import { EventCategory, EventPriority } from './types';
import { measureTestPerformance, expectPerformanceToBeWithin } from '../performance/performanceTestUtils';

describe('Analytics Manager Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should track events efficiently', async () => {
    // Prepare test data
    const testEvent = {
      name: 'test_event',
      category: EventCategory.USER_JOURNEY,
      priority: EventPriority.LOW,
      properties: {
        testProp: 'test value'
      }
    };
    
    // Benchmark tracking 100 events
    const { duration } = await measureTestPerformance(async () => {
      for (let i = 0; i < 100; i++) {
        analytics.trackEvent(testEvent);
      }
    });
    
    // With no providers, this should be very fast (<50ms for 100 events)
    expect(duration).toBeLessThan(50);
  });
  
  it('should identify users efficiently', async () => {
    const { duration } = await measureTestPerformance(async () => {
      analytics.identify('test-user', { role: 'tester' });
    });
    
    // User identification should be fast
    expect(duration).toBeLessThan(10);
  });
});
