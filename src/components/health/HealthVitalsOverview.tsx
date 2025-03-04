
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Activity, 
  Droplet, 
  Utensils, 
  Brain, 
  Moon, 
  TrendingUp, 
  TrendingDown
} from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";

interface HealthVitalsOverviewProps {
  vitals: {
    heartRate: { current: number; trend: number };
    bloodPressure: { systolic: number; diastolic: number; trend: number };
    steps: { current: number; trend: number };
    sleep: { hours: number; minutes: number; trend: number };
    water: { current: number; trend: number };
    calories: { current: number; trend: number };
    glucose: { current: number; trend: number };
  };
}

export const HealthVitalsOverview = ({ vitals }: HealthVitalsOverviewProps) => {
  // Prepare metrics data
  const metricsData = [
    {
      title: "Heart Rate",
      value: vitals.heartRate.current.toString(),
      unit: "bpm",
      icon: <Heart className="w-4 h-4 text-white" />,
      iconBgColor: "rgba(239, 68, 68, 0.8)",
      trend: vitals.heartRate.trend > 0 
        ? `+${vitals.heartRate.trend}%` 
        : `${vitals.heartRate.trend}%`,
      trendIcon: vitals.heartRate.trend > 0 
        ? <TrendingUp className="w-3 h-3 mr-1" /> 
        : <TrendingDown className="w-3 h-3 mr-1" />,
      trendColor: vitals.heartRate.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
    {
      title: "Blood Pressure",
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: "mmHg",
      icon: <Activity className="w-4 h-4 text-white" />,
      iconBgColor: "rgba(6, 182, 212, 0.8)",
      trend: vitals.bloodPressure.trend > 0 
        ? `+${vitals.bloodPressure.trend}%` 
        : `${vitals.bloodPressure.trend}%`,
      trendIcon: vitals.bloodPressure.trend > 0 
        ? <TrendingUp className="w-3 h-3 mr-1" /> 
        : <TrendingDown className="w-3 h-3 mr-1" />,
      trendColor: vitals.bloodPressure.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
    {
      title: "Steps",
      value: vitals.steps.current.toLocaleString(),
      unit: "steps",
      icon: <Activity className="w-4 h-4 text-white" />,
      iconBgColor: "rgba(79, 70, 229, 0.8)",
      trend: vitals.steps.trend > 0 
        ? `+${vitals.steps.trend}%` 
        : `${vitals.steps.trend}%`,
      trendIcon: vitals.steps.trend > 0 
        ? <TrendingUp className="w-3 h-3 mr-1" /> 
        : <TrendingDown className="w-3 h-3 mr-1" />,
      trendColor: vitals.steps.trend > 0 
        ? "text-green-500" 
        : "text-red-500",
    },
    {
      title: "Sleep",
      value: `${vitals.sleep.hours}h ${vitals.sleep.minutes}m`,
      unit: "",
      icon: <Moon className="w-4 h-4 text-white" />,
      iconBgColor: "rgba(139, 92, 246, 0.8)",
      trend: vitals.sleep.trend > 0 
        ? `+${vitals.sleep.trend}%` 
        : `${vitals.sleep.trend}%`,
      trendIcon: vitals.sleep.trend > 0 
        ? <TrendingUp className="w-3 h-3 mr-1" /> 
        : <TrendingDown className="w-3 h-3 mr-1" />,
      trendColor: vitals.sleep.trend > 0 
        ? "text-green-500" 
        : "text-red-500",
    },
    {
      title: "Water",
      value: vitals.water.current.toString(),
      unit: "L",
      icon: <Droplet className="w-4 h-4 text-white" />,
      iconBgColor: "rgba(59, 130, 246, 0.8)",
      trend: vitals.water.trend > 0 
        ? `+${vitals.water.trend}%` 
        : `${vitals.water.trend}%`,
      trendIcon: vitals.water.trend > 0 
        ? <TrendingUp className="w-3 h-3 mr-1" /> 
        : <TrendingDown className="w-3 h-3 mr-1" />,
      trendColor: vitals.water.trend > 0 
        ? "text-green-500" 
        : "text-red-500",
    },
    {
      title: "Calories",
      value: vitals.calories.current.toLocaleString(),
      unit: "kcal",
      icon: <Utensils className="w-4 h-4 text-white" />,
      iconBgColor: "rgba(16, 185, 129, 0.8)",
      trend: vitals.calories.trend > 0 
        ? `+${vitals.calories.trend}%` 
        : `${vitals.calories.trend}%`,
      trendIcon: vitals.calories.trend > 0 
        ? <TrendingUp className="w-3 h-3 mr-1" /> 
        : <TrendingDown className="w-3 h-3 mr-1" />,
      trendColor: vitals.calories.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
    {
      title: "Glucose",
      value: vitals.glucose.current.toString(),
      unit: "mg/dL",
      icon: <Brain className="w-4 h-4 text-white" />,
      iconBgColor: "rgba(245, 158, 11, 0.8)",
      trend: vitals.glucose.trend > 0 
        ? `+${vitals.glucose.trend}%` 
        : `${vitals.glucose.trend}%`,
      trendIcon: vitals.glucose.trend > 0 
        ? <TrendingUp className="w-3 h-3 mr-1" /> 
        : <TrendingDown className="w-3 h-3 mr-1" />,
      trendColor: vitals.glucose.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Today's Vitals</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {metricsData.map((metric, index) => (
          <MetricCard
            key={metric.title}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            iconBgColor={metric.iconBgColor}
            trend={metric.trend}
            trendIcon={metric.trendIcon}
            trendColor={metric.trendColor}
            animationDelay={`${0.1 + index * 0.05}s`}
            isLoaded={true}
          />
        ))}
      </div>
    </section>
  );
};

export default HealthVitalsOverview;
