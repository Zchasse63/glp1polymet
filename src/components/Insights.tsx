
/**
 * Insights Component
 * 
 * Following CodeFarm Development Methodology:
 * - Holistic Development: Combines various insight modules into a cohesive experience
 * - User-Centric Design: Progressive disclosure of complex health data
 * - Sustainable Code: Modular architecture with clear separation of concerns
 * - Error Containment: Error boundaries to isolate component failures
 * 
 * @returns React component that renders the Insights page content
 */
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import InsightsHeader from "./insights/InsightsHeader";
import WeeklyProgressSummary from "./insights/WeeklyProgressSummary";
import WeightLossCorrelations from "./insights/WeightLossCorrelations";
import PersonalizedRecommendations from "./insights/PersonalizedRecommendations";
import ErrorBoundary from "@/components/ErrorBoundary";

// Animation variants for staggered entry
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0]
    }
  }
};

const Insights: React.FC = () => {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      // Simulate data loading
      const timer = setTimeout(() => {
        setIsDataLoaded(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, refreshTrigger]);
  
  // Handle manual refresh of all insights data
  const handleRefreshData = () => {
    setIsDataLoaded(false);
    setRefreshTrigger(prev => prev + 1);
    
    toast({
      title: "Refreshing insights",
      description: "Your health insights are being updated with the latest data."
    });
  };
  
  // Handle authentication loading state
  if (authLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-80 w-full" />
      </div>
    );
  }
  
  // Handle unauthenticated state
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
        <h2 className="text-2xl font-semibold mb-2">Sign in to view your insights</h2>
        <p className="text-muted-foreground mb-6">
          Your personalized health analysis and recommendations await
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ErrorBoundary>
        <InsightsHeader onRefresh={handleRefreshData} />
      </ErrorBoundary>
      
      <AnimatePresence>
        {isDataLoaded ? (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <ErrorBoundary>
                <WeeklyProgressSummary />
              </ErrorBoundary>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ErrorBoundary>
                <WeightLossCorrelations />
              </ErrorBoundary>
            </motion.div>
            
            <motion.div variants={itemVariants}>
              <ErrorBoundary>
                <PersonalizedRecommendations />
              </ErrorBoundary>
            </motion.div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-80 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Insights;
