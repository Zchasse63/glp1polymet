
import React, { useCallback, useEffect, useRef } from 'react';

/**
 * Custom hook for debouncing function calls
 * Optimizes performance by limiting the rate at which functions are executed
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Custom hook to detect when an element is visible in the viewport
 * Helps optimize rendering of off-screen components
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = { threshold: 0.1 }
): boolean {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isVisible;
}

/**
 * Optimized list component that only renders items in view
 * Significantly improves performance for long lists
 */
export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  windowHeight,
  overscan = 3
}: {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  windowHeight: number;
  overscan?: number;
}): JSX.Element {
  const [scrollTop, setScrollTop] = React.useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        setScrollTop(containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Calculate visible range with overscan
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + windowHeight) / itemHeight) + overscan
  );

  // Create an array of items to render
  const visibleItems = items.slice(startIndex, endIndex + 1);

  return (
    <div
      ref={containerRef}
      style={{ height: windowHeight, overflow: 'auto', position: 'relative' }}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, localIndex) => {
          const index = startIndex + localIndex;
          return (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: index * itemHeight,
                height: itemHeight,
                width: '100%'
              }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Component that defers rendering until after the initial page load
 * Improves perceived performance by prioritizing critical UI
 */
export function DeferredRender({
  children,
  delay = 100
}: {
  children: React.ReactNode;
  delay?: number;
}): JSX.Element {
  const [shouldRender, setShouldRender] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return shouldRender ? <>{children}</> : null;
}
