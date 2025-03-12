
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { MetricButton } from "../metrics/MetricButton";
import { WeightDetail } from "../metrics/details/WeightDetail";
import { HeartRateDetail } from "../metrics/details/HeartRateDetail";
import { SleepDetail } from "../metrics/details/SleepDetail";
import { ActivityDetail } from "../metrics/details/ActivityDetail";
import { BloodPressureDetail } from "../metrics/details/BloodPressureDetail";
import { WaterIntakeDetail } from "../metrics/details/WaterIntakeDetail";
import { CaloriesDetail } from "../metrics/details/CaloriesDetail";
import { MoodDetail } from "../metrics/details/MoodDetail";
import { useNavigate } from "react-router-dom";
import { useMetricPreferences } from "@/hooks/useMetricPreferences";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";
import { cn } from "@/lib/utils";

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
  const { getAnimationClass, getAnimationStyle } = useAnimationTransition();
  
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
      case "blood-pressure":
        return (
          <BloodPressureDetail 
            currentValue={metric.value}
            unit={metric.unit || "mmHg"}
          />
        );
      case "water-intake":
        return (
          <WaterIntakeDetail 
            currentIntake={metric.value}
            unit={metric.unit || "L"}
          />
        );
      case "calories":
        return (
          <CaloriesDetail
            currentCalories={metric.value}
            unit={metric.unit || "kcal"}
          />
        );
      case "mood":
        return (
          <MoodDetail
            currentMood={metric.value}
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
      className={cn(
        "space-y-5",
        getAnimationClass('up')
      )}
      style={getAnimationStyle(isLoaded, 'up', 1)}
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
        {filteredMetrics.length > 0 ? (
          filteredMetrics.map((metric, index) => (
            <MetricButton
              key={metric.id}
              {...metric}
              animationDelay={`${index * 50}ms`}
              isLoaded={isLoaded}
              detailContent={getDetailContent(metric)}
            />
          ))
        ) : (
          <div className={cn(
            "col-span-2 p-4 text-center text-muted-foreground border rounded-md border-dashed border-muted hover:border-muted-foreground/50 transition-colors",
            getAnimationClass('scale')
          )}
          style={getAnimationStyle(isLoaded, 'scale', 0)}>
            No metrics selected for dashboard. Configure in App Settings.
          </div>
        )}
      </div>
    </section>
  );
};

export default HealthMetrics;
