
import React from "react";

type DashboardHeaderProps = {
  userName: string;
  isLoaded: boolean;
};

export const DashboardHeader = ({ userName, isLoaded }: DashboardHeaderProps) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header 
      className={`space-y-2 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
      style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
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
