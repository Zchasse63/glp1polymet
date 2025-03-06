
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { MetricButton } from "../metrics/MetricButton";
import { WeightDetail } from "../metrics/details/WeightDetail";

type HealthMetricsProps = {
  metrics: {
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
  return (
    <section 
      className={`space-y-5 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
      style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Today's Metrics
        </h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary flex items-center hover:bg-primary/5"
          onClick={onViewAll}
        >
          View all <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((metric, index) => (
          <MetricButton
            key={metric.title}
            {...metric}
            animationDelay={`${0.35 + index * 0.05}s`}
            isLoaded={isLoaded}
            detailContent={
              metric.title === "Weight" ? (
                <WeightDetail 
                  weightData={[]} 
                  currentWeight={metric.value}
                  weightUnit={metric.unit || "lbs"}
                />
              ) : (
                <div className="p-4">
                  <p>Detailed view for {metric.title} coming soon...</p>
                </div>
              )
            }
          />
        ))}
      </div>
    </section>
  );
};

export default HealthMetrics;
