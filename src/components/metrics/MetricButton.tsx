
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type MetricButtonProps = {
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
  detailContent: React.ReactNode;
};

export const MetricButton = ({
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
  isLoaded,
  detailContent
}: MetricButtonProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden card-hover opacity-0 cursor-pointer transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]", 
          isLoaded ? "animate-scale-in opacity-100" : ""
        )}
        style={{ animationDelay, animationFillMode: "forwards" }}
        onClick={() => setIsOpen(true)}
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

          <div className="mt-2 flex justify-between items-center">
            <div>
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
            <ArrowRight className="h-4 w-4 text-muted-foreground opacity-70" />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span 
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: iconBgColor }}
              >
                {icon}
              </span>
              {title} Details
            </DialogTitle>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </DialogClose>
          </DialogHeader>
          {detailContent}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MetricButton;
