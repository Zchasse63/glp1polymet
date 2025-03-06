
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./dashboard/DashboardHeader";
import MedicationTracker from "./dashboard/MedicationTracker";
import HealthMetrics from "./dashboard/HealthMetrics";
import WeightProgress from "./dashboard/WeightProgress";
import { useDashboardData } from "../hooks/useDashboardData";
import { useMetricPreferences } from "@/hooks/useMetricPreferences";
import { useMedicationPreferences } from "@/hooks/useMedicationPreferences";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { 
    weightData, 
    medications, 
    healthMetrics 
  } = useDashboardData();
  
  // Use preferences hooks for metrics and medications
  const { selectedMetrics } = useMetricPreferences();
  const { selectedMedications } = useMedicationPreferences();
  
  // Transform the health metrics to include the JSX elements
  const transformedHealthMetrics = healthMetrics.map(metric => {
    const Icon = metric.icon;
    const TrendIcon = metric.trendIcon;
    
    return {
      ...metric,
      icon: <Icon className={`h-4 w-4 ${metric.title === 'Heart Rate' ? 'text-rose-500 animate-pulse-subtle' : 
                              metric.title === 'Weight' ? 'text-green-500' : 
                              metric.title === 'Sleep' ? 'text-indigo-500' : 'text-primary'}`} />,
      trendIcon: TrendIcon ? <TrendIcon className="h-3 w-3 mr-1" /> : undefined
    };
  });
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  
  // Handle navigation
  const handleNavigateToMedications = () => {
    navigate("/medications");
  };
  
  const handleNavigateToHealth = () => {
    navigate("/health");
  };
  
  const handleNavigateToSettings = () => {
    navigate("/settings");
  };
  
  const handleViewDetails = () => {
    navigate("/health");
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <DashboardHeader 
        userName="Eric" 
        isLoaded={isLoaded} 
      />

      {/* Today's Metrics */}
      <HealthMetrics 
        metrics={transformedHealthMetrics} 
        isLoaded={isLoaded} 
        onViewAll={handleNavigateToHealth} 
      />

      {/* Medication Overview */}
      <MedicationTracker 
        medications={medications} 
        isLoaded={isLoaded} 
        onViewAll={handleNavigateToMedications} 
      />

      {/* Weight Progress */}
      <WeightProgress 
        weightData={weightData} 
        isLoaded={isLoaded} 
        onViewDetails={handleViewDetails} 
      />
    </div>
  );
};

export default Dashboard;
