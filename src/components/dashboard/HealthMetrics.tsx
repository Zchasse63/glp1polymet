
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { MetricButton } from "../metrics/MetricButton";
import { WeightDetail } from "../metrics/details/WeightDetail";
import { HeartRateDetail } from "../metrics/details/HeartRateDetail";
import { SleepDetail } from "../metrics/details/SleepDetail";
import { ActivityDetail } from "../metrics/details/ActivityDetail";
import { useNavigate } from "react-router-dom";
import { useMetricPreferences } from "@/hooks/useMetricPreferences";

type HealthMetricsProps = {
  metrics: {
    id: string;
    title: string;
    value: string;
    unit?: string;
    icon: React.ReactNode;
    iconBgColor: string;
    trend?: string;
    trendIcon?: React.ReactNode;
    trendColor?: string;
    status?: string;
    statusColor?: string;
  }[];
  isLoaded: boolean;
  onViewAll: () => void;
};

export const HealthMetrics = ({ metrics, isLoaded, onViewAll }: HealthMetricsProps) => {
  const navigate = useNavigate();
  const { selectedMetrics } = useMetricPreferences();
  
  const getDetailContent = (metric: { id: string; title: string; value: string; unit?: string }) => {
    switch (metric.id) {
      case "weight":
        return (
          <WeightDetail 
            weightData={[]} 
            currentWeight={metric.value}
            weightUnit={metric.unit || "lbs"}
          />
        );
      case "heart-rate":
        return (
          <HeartRateDetail 
            currentRate={metric.value}
            unit={metric.unit || "bpm"}
          />
        );
      case "sleep":
        return (
          <SleepDetail 
            currentSleep={metric.value}
            unit={metric.unit || "hrs"}
          />
        );
      case "activity":
        return (
          <ActivityDetail 
            currentActivity={metric.value}
            unit={metric.unit || "steps"}
          />
        );
      default:
        return (
          <div className="p-4">
            <p>Detailed view for {metric.title} coming soon...</p>
          </div>
        );
    }
  };

  // Filter metrics based on user preferences
  const filteredMetrics = metrics.filter(metric => 
    selectedMetrics.includes(metric.id)
  );

  return (
    <section 
      className={`space-y-5 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
      style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Today's Metrics
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary flex items-center hover:bg-primary/5"
            onClick={onViewAll}
          >
            View all <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {filteredMetrics.map((metric, index) => (
          <MetricButton
            key={metric.id}
            {...metric}
            animationDelay={`${0.35 + index * 0.05}s`}
            isLoaded={isLoaded}
            detailContent={getDetailContent(metric)}
          />
        ))}
      </div>
    </section>
  );
};

export default HealthMetrics;
