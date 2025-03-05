
import { useState, useEffect } from "react";
import { format, subDays } from "date-fns";
import { VitalsData } from "@/components/health/vitals/vitalsUtils";

/**
 * Custom hook to fetch and manage health metrics data
 * @returns Object containing health metrics data
 */
export const useHealthMetrics = () => {
  const [healthMetrics, setHealthMetrics] = useState({
    activity: [] as Array<{ date: string; value: number }>,
    heartRate: [] as Array<{ date: string; value: number }>,
    sleep: [] as Array<{ date: string; value: number }>,
    hydration: [] as Array<{ date: string; value: number }>,
    calories: [] as Array<{ date: string; value: number }>,
    glucose: [] as Array<{ date: string; value: number }>,
    bloodPressure: [] as Array<{ date: string; systolic: number; diastolic: number }>,
  });

  const [vitalsData, setVitalsData] = useState<VitalsData>({
    heartRate: { current: 0, trend: 0 },
    bloodPressure: { systolic: 0, diastolic: 0, trend: 0 },
    steps: { current: 0, trend: 0 },
    sleep: { hours: 0, minutes: 0, trend: 0 },
    water: { current: 0, trend: 0 },
    calories: { current: 0, trend: 0 },
    glucose: { current: 0, trend: 0 },
    hrv: { current: 0, trend: 0 },
  });

  // Fetch sample health metrics data
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedHealthMetrics = {
      activity: [
        { date: format(subDays(new Date(), 6), "MMM dd"), value: 5823 },
        { date: format(subDays(new Date(), 5), "MMM dd"), value: 7254 },
        { date: format(subDays(new Date(), 4), "MMM dd"), value: 6542 },
        { date: format(subDays(new Date(), 3), "MMM dd"), value: 8321 },
        { date: format(subDays(new Date(), 2), "MMM dd"), value: 7123 },
        { date: format(subDays(new Date(), 1), "MMM dd"), value: 6254 },
        { date: format(new Date(), "MMM dd"), value: 4517 },
      ],
      heartRate: [
        { date: format(subDays(new Date(), 6), "MMM dd"), value: 74 },
        { date: format(subDays(new Date(), 5), "MMM dd"), value: 72 },
        { date: format(subDays(new Date(), 4), "MMM dd"), value: 75 },
        { date: format(subDays(new Date(), 3), "MMM dd"), value: 73 },
        { date: format(subDays(new Date(), 2), "MMM dd"), value: 71 },
        { date: format(subDays(new Date(), 1), "MMM dd"), value: 70 },
        { date: format(new Date(), "MMM dd"), value: 72 },
      ],
      sleep: [
        { date: format(subDays(new Date(), 6), "MMM dd"), value: 6.8 },
        { date: format(subDays(new Date(), 5), "MMM dd"), value: 7.2 },
        { date: format(subDays(new Date(), 4), "MMM dd"), value: 6.5 },
        { date: format(subDays(new Date(), 3), "MMM dd"), value: 7.5 },
        { date: format(subDays(new Date(), 2), "MMM dd"), value: 8.1 },
        { date: format(subDays(new Date(), 1), "MMM dd"), value: 7.3 },
        { date: format(new Date(), "MMM dd"), value: 7.5 },
      ],
      hydration: [
        { date: format(subDays(new Date(), 6), "MMM dd"), value: 1.6 },
        { date: format(subDays(new Date(), 5), "MMM dd"), value: 1.8 },
        { date: format(subDays(new Date(), 4), "MMM dd"), value: 1.5 },
        { date: format(subDays(new Date(), 3), "MMM dd"), value: 2.0 },
        { date: format(subDays(new Date(), 2), "MMM dd"), value: 1.9 },
        { date: format(subDays(new Date(), 1), "MMM dd"), value: 1.7 },
        { date: format(new Date(), "MMM dd"), value: 1.2 },
      ],
      calories: [
        { date: format(subDays(new Date(), 6), "MMM dd"), value: 1650 },
        { date: format(subDays(new Date(), 5), "MMM dd"), value: 1580 },
        { date: format(subDays(new Date(), 4), "MMM dd"), value: 1720 },
        { date: format(subDays(new Date(), 3), "MMM dd"), value: 1490 },
        { date: format(subDays(new Date(), 2), "MMM dd"), value: 1560 },
        { date: format(subDays(new Date(), 1), "MMM dd"), value: 1620 },
        { date: format(new Date(), "MMM dd"), value: 1450 },
      ],
      glucose: [
        { date: format(subDays(new Date(), 6), "MMM dd"), value: 102 },
        { date: format(subDays(new Date(), 5), "MMM dd"), value: 97 },
        { date: format(subDays(new Date(), 4), "MMM dd"), value: 105 },
        { date: format(subDays(new Date(), 3), "MMM dd"), value: 99 },
        { date: format(subDays(new Date(), 2), "MMM dd"), value: 101 },
        { date: format(subDays(new Date(), 1), "MMM dd"), value: 96 },
        { date: format(new Date(), "MMM dd"), value: 98 },
      ],
      bloodPressure: [
        { date: format(subDays(new Date(), 6), "MMM dd"), systolic: 122, diastolic: 81 },
        { date: format(subDays(new Date(), 5), "MMM dd"), systolic: 119, diastolic: 79 },
        { date: format(subDays(new Date(), 4), "MMM dd"), systolic: 125, diastolic: 82 },
        { date: format(subDays(new Date(), 3), "MMM dd"), systolic: 121, diastolic: 80 },
        { date: format(subDays(new Date(), 2), "MMM dd"), systolic: 118, diastolic: 78 },
        { date: format(subDays(new Date(), 1), "MMM dd"), systolic: 122, diastolic: 80 },
        { date: format(new Date(), "MMM dd"), systolic: 120, diastolic: 80 },
      ],
    };

    setHealthMetrics(fetchedHealthMetrics);

    // Sample vitals data
    const fetchedVitalsData: VitalsData = {
      heartRate: { current: 72, trend: -2 },
      bloodPressure: { systolic: 120, diastolic: 80, trend: -1 },
      steps: { current: 6254, trend: 5 },
      sleep: { hours: 7, minutes: 32, trend: 3 },
      water: { current: 1.2, trend: -15 },
      calories: { current: 1450, trend: -8 },
      glucose: { current: 98, trend: 0 },
      hrv: { current: 58, trend: 2 },
    };

    setVitalsData(fetchedVitalsData);
  }, []);

  /**
   * Calculate trend from array of data points
   * @param data Array of data points
   * @returns Percentage change between first and last data point
   */
  const calculateTrend = (data: Array<{ value: number }>) => {
    if (data.length < 2) return 0;
    const firstValue = data[0].value;
    const lastValue = data[data.length - 1].value;
    return firstValue !== 0 ? Math.round(((lastValue - firstValue) / firstValue) * 100) : 0;
  };

  return {
    healthMetrics,
    vitalsData,
    calculateTrend
  };
};
