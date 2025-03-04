
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type MetricCardProps = {
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
  animationDelay: string;
  isLoaded: boolean;
};

export const MetricCard = ({
  title,
  value,
  unit,
  icon,
  iconBgColor,
  trend,
  trendIcon,
  trendColor,
  status,
  statusColor,
  animationDelay,
  isLoaded
}: MetricCardProps) => {
  return (
    <Card 
      className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
      style={{ animationDelay, animationFillMode: "forwards" }}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-muted-foreground">
              {title}
            </p>
            <div className="flex items-baseline mt-1">
              <span className="text-lg font-bold">
                {value}
              </span>
              {unit && (
                <span className="text-xs ml-1 text-muted-foreground">
                  {unit}
                </span>
              )}
            </div>
          </div>
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: iconBgColor }}
          >
            {icon}
          </div>
        </div>

        <div className="mt-2">
          {trend && trendIcon && (
            <div className={`flex items-center text-xs ${trendColor}`}>
              {trendIcon}
              {trend}
            </div>
          )}
          {status && (
            <div className={`text-xs font-medium ${statusColor}`}>
              {status}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
