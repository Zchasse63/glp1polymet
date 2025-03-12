
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";

interface VitalCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  trend?: string;
  trendIcon?: React.ReactNode;
  trendColor?: string;
  isAnimated?: boolean;
  delay?: number;
}

export const VitalCard = ({
  title,
  value,
  unit,
  icon,
  iconBgColor,
  trend,
  trendIcon,
  trendColor,
  isAnimated = false,
  delay = 0,
}: VitalCardProps) => {
  const { getAnimationClass, getLoadedStyle } = useAnimationTransition();

  return (
    <Card 
      className={cn(
        "overflow-hidden card-hover shadow-sm border border-slate-200 dark:border-slate-800 transition-all duration-200",
        getAnimationClass('fade-slide-up')
      )}
      style={getLoadedStyle(isAnimated, delay)}
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start mb-1.5">
          <p className="text-xs font-medium text-muted-foreground truncate mr-2">{title}</p>
          <div 
            className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: iconBgColor }}
          >
            {icon}
          </div>
        </div>
        
        <div className="flex items-baseline">
          <span className="text-lg font-bold truncate">{value}</span>
          {unit && (
            <span className="text-xs ml-1 text-muted-foreground whitespace-nowrap">{unit}</span>
          )}
        </div>
        
        {trend && trendIcon && (
          <div className={`flex items-center text-xs mt-1 ${trendColor}`}>
            {trendIcon}
            <span className="whitespace-nowrap">{trend}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VitalCard;
