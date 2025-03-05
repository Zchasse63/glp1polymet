
/**
 * CorrelationLoadingState Component
 * 
 * Loading state placeholder for correlation data visualization.
 * Following CodeFarm Development Methodology:
 * - User-Centric Design: Provides visual feedback during loading
 * - Sustainable Code: Simple, focused component
 * - Accessibility: Properly structured for screen readers
 */
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const CorrelationLoadingState: React.FC = () => {
  return (
    <div className="space-y-4" role="status" aria-label="Loading correlation data">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
      
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between">
            <Skeleton className="h-5 w-[120px]" />
            <Skeleton className="h-5 w-[60%]" />
          </div>
        ))}
      </div>
      
      <div className="h-[200px]">
        <Skeleton className="h-full w-full" />
      </div>
      
      <div className="flex items-center space-x-2">
        <Skeleton className="h-3 w-3 rounded-sm" />
        <Skeleton className="h-3 w-[80px]" />
        <Skeleton className="h-3 w-3 rounded-sm" />
        <Skeleton className="h-3 w-[80px]" />
      </div>
    </div>
  );
};

export default CorrelationLoadingState;
