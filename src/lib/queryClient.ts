import { QueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

/**
 * Create a custom QueryClient with optimized configuration
 * 
 * Following CodeFarm principles:
 * - Robust Error Handling: Global error management
 * - Optimized Performance: Smart retry and caching configuration
 * - User-Centric Design: Non-intrusive error notifications
 */
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Caching strategy
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        
        // Error handling
        retry: (failureCount, error) => {
          // Don't retry if it's a 4xx error (client error)
          if (error instanceof Error && 'status' in error && typeof error.status === 'number') {
            if (error.status >= 400 && error.status < 500) {
              return false;
            }
          }
          
          // Otherwise retry up to 2 times
          return failureCount < 2;
        },
        
        // Show toast on error - updated for React Query v5
        meta: {
          onError: (error: Error) => {
            console.error('Query error:', error);
            toast({
              title: "Data loading failed",
              description: error instanceof Error ? error.message : "An unexpected error occurred",
              variant: "destructive",
            });
          }
        }
      },
      mutations: {
        // Show toast on error - updated for React Query v5
        meta: {
          onError: (error: Error) => {
            console.error('Mutation error:', error);
            toast({
              title: "Operation failed",
              description: error instanceof Error ? error.message : "An unexpected error occurred",
              variant: "destructive",
            });
          }
          // Show toast on success (commented out to avoid too many toasts)
          // onSuccess: () => {
          //   toast({
          //     title: "Success",
          //     description: "Operation completed successfully",
          //   });
          // }
        }
      }
    }
  });
};
