
import { 
  Heart, 
  Activity, 
  Droplet, 
  Utensils, 
  Brain, 
  Moon, 
  TrendingUp, 
  TrendingDown,
  HeartPulse
} from "lucide-react";
import React from "react";

export interface VitalsData {
  heartRate: { current: number; trend: number };
  bloodPressure: { systolic: number; diastolic: number; trend: number };
  steps: { current: number; trend: number };
  sleep: { hours: number; minutes: number; trend: number };
  water: { current: number; trend: number };
  calories: { current: number; trend: number };
  glucose: { current: number; trend: number };
  hrv: { current: number; trend: number };
}

export interface MetricData {
  title: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  iconBgColor: string;
  trend: string;
  trendIcon: React.ReactNode;
  trendColor: string;
}

export const formatVitalsData = (vitals: VitalsData): MetricData[] => {
  return [
    {
      title: "Heart Rate",
      value: vitals.heartRate.current.toString(),
      unit: "bpm",
      icon: React.createElement(Heart, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(239, 68, 68, 0.8)",
      trend: vitals.heartRate.trend > 0 
        ? `+${vitals.heartRate.trend}%` 
        : `${vitals.heartRate.trend}%`,
      trendIcon: vitals.heartRate.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.heartRate.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
    {
      title: "HRV",
      value: vitals.hrv.current.toString(),
      unit: "ms",
      icon: React.createElement(HeartPulse, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(216, 80, 188, 0.8)",
      trend: vitals.hrv.trend > 0 
        ? `+${vitals.hrv.trend}%` 
        : `${vitals.hrv.trend}%`,
      trendIcon: vitals.hrv.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.hrv.trend > 0 
        ? "text-green-500" 
        : "text-red-500",
    },
    {
      title: "Blood Pressure",
      value: `${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`,
      unit: "mmHg",
      icon: React.createElement(Activity, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(6, 182, 212, 0.8)",
      trend: vitals.bloodPressure.trend > 0 
        ? `+${vitals.bloodPressure.trend}%` 
        : `${vitals.bloodPressure.trend}%`,
      trendIcon: vitals.bloodPressure.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.bloodPressure.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
    {
      title: "Steps",
      value: vitals.steps.current.toLocaleString(),
      unit: "steps",
      icon: React.createElement(Activity, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(79, 70, 229, 0.8)",
      trend: vitals.steps.trend > 0 
        ? `+${vitals.steps.trend}%` 
        : `${vitals.steps.trend}%`,
      trendIcon: vitals.steps.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.steps.trend > 0 
        ? "text-green-500" 
        : "text-red-500",
    },
    {
      title: "Sleep",
      value: `${vitals.sleep.hours}h ${vitals.sleep.minutes}m`,
      unit: "",
      icon: React.createElement(Moon, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(139, 92, 246, 0.8)",
      trend: vitals.sleep.trend > 0 
        ? `+${vitals.sleep.trend}%` 
        : `${vitals.sleep.trend}%`,
      trendIcon: vitals.sleep.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.sleep.trend > 0 
        ? "text-green-500" 
        : "text-red-500",
    },
    {
      title: "Water",
      value: vitals.water.current.toString(),
      unit: "L",
      icon: React.createElement(Droplet, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(59, 130, 246, 0.8)",
      trend: vitals.water.trend > 0 
        ? `+${vitals.water.trend}%` 
        : `${vitals.water.trend}%`,
      trendIcon: vitals.water.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.water.trend > 0 
        ? "text-green-500" 
        : "text-red-500",
    },
    {
      title: "Calories",
      value: vitals.calories.current.toLocaleString(),
      unit: "kcal",
      icon: React.createElement(Utensils, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(16, 185, 129, 0.8)",
      trend: vitals.calories.trend > 0 
        ? `+${vitals.calories.trend}%` 
        : `${vitals.calories.trend}%`,
      trendIcon: vitals.calories.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.calories.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
    {
      title: "Glucose",
      value: vitals.glucose.current.toString(),
      unit: "mg/dL",
      icon: React.createElement(Brain, { className: "w-4 h-4 text-white" }),
      iconBgColor: "rgba(245, 158, 11, 0.8)",
      trend: vitals.glucose.trend > 0 
        ? `+${vitals.glucose.trend}%` 
        : `${vitals.glucose.trend}%`,
      trendIcon: vitals.glucose.trend > 0 
        ? React.createElement(TrendingUp, { className: "w-3 h-3 mr-1" })
        : React.createElement(TrendingDown, { className: "w-3 h-3 mr-1" }),
      trendColor: vitals.glucose.trend > 0 
        ? "text-red-500" 
        : "text-green-500",
    },
  ];
};
