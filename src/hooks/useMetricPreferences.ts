
import { useCallback, useEffect, useState } from "react";
import { useApplicationState } from "./useApplicationState";
import { PersistenceType } from "./useApplicationState";

// Define available metrics types
export interface MetricOption {
  id: string;
  title: string;
}

// Maximum number of metrics to show on dashboard
export const MAX_METRICS = 4;

// Default metrics to show
const DEFAULT_METRICS = ["weight", "activity", "heart-rate", "sleep"];

// All available metrics
const ALL_METRICS: MetricOption[] = [
  { id: "weight", title: "Weight" },
  { id: "activity", title: "Activity" },
  { id: "heart-rate", title: "Heart Rate" },
  { id: "sleep", title: "Sleep" },
  { id: "blood-pressure", title: "Blood Pressure" },
  { id: "water-intake", title: "Water Intake" },
  { id: "calories", title: "Calories" },
  { id: "mood", title: "Mood" }
];

export const useMetricPreferences = () => {
  // Use application state hook for persistence
  const { state: selectedMetrics, setState: setSelectedMetrics } = 
    useApplicationState<string[]>({
      initialState: DEFAULT_METRICS,
      key: "dashboard-metrics",
      persistence: PersistenceType.LOCAL,
      version: 1,
    });

  // Toggle a metric on/off
  const toggleMetric = useCallback((metricId: string) => {
    setSelectedMetrics(current => {
      if (current.includes(metricId)) {
        // Remove metric
        return current.filter(id => id !== metricId);
      } else {
        // Add metric if under limit
        if (current.length < MAX_METRICS) {
          return [...current, metricId];
        }
        return current;
      }
    });
  }, [setSelectedMetrics]);

  return {
    availableMetrics: ALL_METRICS,
    selectedMetrics,
    toggleMetric,
    MAX_METRICS
  };
};
