
import React from "react";
import VitalCard from "./vitals/VitalCard";
import { formatVitalsData, VitalsData } from "./vitals/vitalsUtils";

interface HealthVitalsOverviewProps {
  vitals: VitalsData;
}

export const HealthVitalsOverview = ({ vitals }: HealthVitalsOverviewProps) => {
  // Format the vitals data using the utility function
  const metricsData = formatVitalsData(vitals);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Today's Vitals</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metricsData.map((metric) => (
          <VitalCard 
            key={metric.title}
            title={metric.title}
            value={metric.value}
            unit={metric.unit}
            icon={metric.icon}
            iconBgColor={metric.iconBgColor}
            trend={metric.trend}
            trendIcon={metric.trendIcon}
            trendColor={metric.trendColor}
          />
        ))}
      </div>
    </section>
  );
};

export default HealthVitalsOverview;
