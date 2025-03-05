
import { useState, useEffect } from "react";
import { TrendingUpIcon, ActivityIcon, HeartIcon, MoonIcon } from "lucide-react";

export const useDashboardData = () => {
  const [data, setData] = useState({
    weightData: [],
    medications: [],
    healthMetrics: []
  });

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For now, we'll use the sample data
    
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

    // Health metrics data
    const healthMetrics = [
      {
        title: "Weight",
        value: "185.6",
        unit: "lbs",
        icon: TrendingUpIcon,
        iconBgColor: "hsl(var(--chart-3)/15)",
        trend: "-0.8%",
        trendIcon: TrendingUpIcon,
        trendColor: "text-green-600 dark:text-green-400",
      },
      {
        title: "Activity",
        value: "6,254",
        unit: "steps",
        icon: ActivityIcon,
        iconBgColor: "hsl(var(--chart-1)/15)",
        trend: "+12%",
        trendIcon: TrendingUpIcon,
        trendColor: "text-primary",
      },
      {
        title: "Heart Rate",
        value: "72",
        unit: "bpm",
        icon: HeartIcon,
        iconBgColor: "hsl(var(--chart-4)/15)",
        status: "Normal",
        statusColor: "text-green-600 dark:text-green-400",
      },
      {
        title: "Sleep",
        value: "7h 32m",
        icon: MoonIcon,
        iconBgColor: "hsl(var(--chart-2)/15)",
        trend: "+8%",
        trendIcon: TrendingUpIcon,
        trendColor: "text-green-600 dark:text-green-400",
      },
    ];

    setData({
      weightData,
      medications,
      healthMetrics
    });
  }, []);

  return data;
};
