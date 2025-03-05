
/**
 * Performance Testing Utilities
 * 
 * Following CodeFarm Development Methodology:
 * - Performance Optimization: Testing performance metrics
 * - Continuous Learning: Capturing performance data
 */

import { performanceTracker } from './PerformanceTracker';
import { PerformanceEventType } from './types';

/**
 * Mock performance tracker for testing
 */
export const mockPerformanceTracker = () => {
  const originalTracker = { ...performanceTracker };
  const mockTracker = {
    start: jest.fn().mockReturnValue('mock-metric-id'),
    end: jest.fn().mockReturnValue(10), // 10ms mock duration
    setThreshold: jest.fn(),
    setThrottleConfig: jest.fn(),
    setMaxMetricsPerType: jest.fn(),
    flushMetrics: jest.fn(),
    getAllMetrics: jest.fn().mockReturnValue([]),
    cleanupMocks: () => {
      // Restore original tracker
      Object.assign(performanceTracker, originalTracker);
    }
  };
  
  // Replace tracker methods with mocks
  Object.assign(performanceTracker, mockTracker);
  
  return mockTracker;
};

/**
 * Create a performance test wrapper
 */
export const withPerformanceTracking = (testFn: () => void, metricName: string) => {
  return () => {
    const metricId = performanceTracker.start(
      metricName, 
      PerformanceEventType.COMPONENT_RENDER
    );
    
    try {
      // Run the test
      testFn();
    } finally {
      // End tracking
      performanceTracker.end(metricId);
    }
  };
};

/**
 * Measure test execution time
 */
export const measureTestPerformance = async <T>(
  testFn: () => Promise<T> | T
): Promise<{ result: T, duration: number }> => {
  const startTime = performance.now();
  const result = await testFn();
  const endTime = performance.now();
  
  return {
    result,
    duration: endTime - startTime
  };
};

/**
 * Assert performance is within expected range
 */
export const expectPerformanceToBeWithin = (
  actual: number,
  expected: number, 
  tolerance: number = 0.25 // 25% tolerance by default
): void => {
  const min = expected * (1 - tolerance);
  const max = expected * (1 + tolerance);
  
  expect(actual).toBeGreaterThanOrEqual(min);
  expect(actual).toBeLessThanOrEqual(max);
};
