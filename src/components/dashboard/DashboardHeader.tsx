
import React from "react";
import { useAnimationTransition } from "@/hooks/useAnimationTransition";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  userName: string;
  isLoaded: boolean;
};

export const DashboardHeader = ({ userName, isLoaded }: DashboardHeaderProps) => {
  const { getAnimationClass, getAnimationStyle } = useAnimationTransition();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header 
      className={cn(
        "space-y-2",
        getAnimationClass('up')
      )}
      style={getAnimationStyle(isLoaded, 'up', 0)}
    >
      <h1 className="text-3xl font-bold tracking-tight">
        {getGreeting()},{" "}
        <span className="text-primary">
          {userName}
        </span>
      </h1>
      <p className="text-muted-foreground">
        Here's your health overview for today
      </p>
    </header>
  );
};

export default DashboardHeader;
