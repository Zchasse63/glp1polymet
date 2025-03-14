
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./dashboard/DashboardHeader";
import MedicationTracker from "./dashboard/MedicationTracker";
import HealthMetrics from "./dashboard/HealthMetrics";
import { useDashboardData } from "../hooks/useDashboardData";
import { useMetricPreferences } from "@/hooks/useMetricPreferences";
import { useMedicationPreferences } from "@/hooks/useMedicationPreferences";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  const { 
    medications, 
    healthMetrics 
  } = useDashboardData();
  
  const { 
    selectedMetrics 
  } = useMetricPreferences();
  const { 
    selectedMedications 
  } = useMedicationPreferences();
  
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
  
  const filteredMedications = medications.filter(medication => 
    selectedMedications.includes(medication.id)
  );

  useEffect(() => {
    // Small delay to ensure the CSS transitions have time to initialize
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleNavigateToMedications = () => {
    navigate("/medications");
  };
  
  const handleNavigateToHealth = () => {
    navigate("/health");
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto space-y-8">
      <DashboardHeader 
        userName="Eric" 
        isLoaded={isLoaded} 
      />

      <HealthMetrics 
        metrics={transformedHealthMetrics} 
        isLoaded={isLoaded} 
        onViewAll={handleNavigateToHealth} 
      />

      <MedicationTracker 
        medications={filteredMedications} 
        isLoaded={isLoaded} 
        onViewAll={handleNavigateToMedications} 
      />
    </div>
  );
};

export default Dashboard;
