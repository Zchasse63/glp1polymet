
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";

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
  const isReducedMotion = useReducedMotion();

  return (
    <>
      <Card 
        className={cn(
          "overflow-hidden card-hover cursor-pointer transform transition-all duration-200 hover:shadow-md hover:scale-[1.02]", 
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ 
          transform: isLoaded ? 'translateY(0)' : 'translateY(15px)',
          transitionDelay: animationDelay,
          transition: 'opacity 250ms ease-out, transform 250ms ease-out'
        }}
        onClick={() => setIsOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {title}
              </p>
              <div className="flex items-baseline">
                <span className="text-xl font-bold">
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
              className="w-9 h-9 rounded-full flex items-center justify-center shadow-sm"
              style={{ backgroundColor: iconBgColor }}
            >
              {icon}
            </div>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <div>
              {trend && trendIcon && (
                <div className={`flex items-center text-xs font-medium ${trendColor}`}>
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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-in">
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
          <div className="animate-fade-slide-up">
            {detailContent}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MetricButton;
