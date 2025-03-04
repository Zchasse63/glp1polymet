
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  TrendingUpIcon,
  ActivityIcon,
  HeartIcon,
  MoonIcon,
} from "lucide-react";

// Import the new component files
import DashboardHeader from "./dashboard/DashboardHeader";
import MedicationTracker from "./dashboard/MedicationTracker";
import HealthMetrics from "./dashboard/HealthMetrics";
import WeightProgress from "./dashboard/WeightProgress";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Sample weight data
  const weightData = [
    { date: "Jan 1", weight: 210 },
    { date: "Jan 15", weight: 208 },
    { date: "Feb 1", weight: 205 },
    { date: "Feb 15", weight: 202 },
    { date: "Mar 1", weight: 198 },
    { date: "Mar 15", weight: 195 },
    { date: "Apr 1", weight: 192 },
  ];

  // Sample medication data
  const medications = [
    {
      id: "ozempic",
      name: "Ozempic",
      dose: "0.5mg",
      frequency: "Weekly",
      lastTaken: "3 days ago",
      nextDose: "In 4 days",
      level: "2.5mg",
      totalAmount: "5mg",
      color: "hsl(var(--chart-1))",
    },
    {
      id: "mounjaro",
      name: "Mounjaro",
      dose: "5mg",
      frequency: "Weekly",
      lastTaken: "Today",
      nextDose: "In 7 days",
      level: "4.5mg",
      totalAmount: "5mg",
      color: "hsl(var(--chart-2))",
    },
  ];
  
  // Handle navigation
  const handleNavigateToMedications = () => {
    navigate("/medications");
  };
  
  const handleNavigateToHealth = () => {
    navigate("/health");
  };
  
  const handleViewDetails = () => {
    navigate("/health");
  };

  // Health metrics data
  const healthMetrics = [
    {
      title: "Weight",
      value: "185.6",
      unit: "lbs",
      icon: <TrendingUpIcon className="h-4 w-4 text-green-500" />,
      iconBgColor: "hsl(var(--chart-3)/15)",
      trend: "-0.8%",
      trendIcon: <TrendingUpIcon className="h-3 w-3 mr-1" />,
      trendColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Activity",
      value: "6,254",
      unit: "steps",
      icon: <ActivityIcon className="h-4 w-4 text-primary" />,
      iconBgColor: "hsl(var(--chart-1)/15)",
      trend: "+12%",
      trendIcon: <TrendingUpIcon className="h-3 w-3 mr-1" />,
      trendColor: "text-primary",
    },
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      icon: <HeartIcon className="h-4 w-4 text-rose-500 animate-pulse-subtle" />,
      iconBgColor: "hsl(var(--chart-4)/15)",
      status: "Normal",
      statusColor: "text-green-600 dark:text-green-400",
    },
    {
      title: "Sleep",
      value: "7h 32m",
      icon: <MoonIcon className="h-4 w-4 text-indigo-500" />,
      iconBgColor: "hsl(var(--chart-2)/15)",
      trend: "+8%",
      trendIcon: <TrendingUpIcon className="h-3 w-3 mr-1" />,
      trendColor: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <DashboardHeader 
        userName="Eric" 
        isLoaded={isLoaded} 
      />

      {/* Medication Overview */}
      <MedicationTracker 
        medications={medications} 
        isLoaded={isLoaded} 
        onViewAll={handleNavigateToMedications} 
      />

      {/* Today's Metrics */}
      <HealthMetrics 
        metrics={healthMetrics} 
        isLoaded={isLoaded} 
        onViewAll={handleNavigateToHealth} 
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
