import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart, XAxis, CartesianGrid, ResponsiveContainer, YAxis, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";
import {
  ChevronRightIcon,
  TrendingUpIcon,
  ActivityIcon,
  HeartIcon,
  PillIcon,
  CalendarIcon,
  ClockIcon,
  MoonIcon,
  Droplet as DropletIcon,
  Utensils as UtensilsIcon, 
  Brain as BrainIcon
} from "lucide-react";

const Dashboard = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Sample weight data
  const weightData = [
    { date: "Jan 1", weight: 210 },
    { date: "Jan 15", weight: 208 },
    { date: "Feb 1", weight: 205 },
    { date: "Feb 15", weight: 202 },
    { date: "Mar 1", weight: 198 },
    { date: "Mar 15", weight: 195 },
    { date: "Apr 1", weight: 192 },
  ];

  // Sample medication data
  const medications = [
    {
      id: "ozempic",
      name: "Ozempic",
      dose: "0.5mg",
      frequency: "Weekly",
      lastTaken: "3 days ago",
      nextDose: "In 4 days",
      level: "2.5mg",
      totalAmount: "5mg",
      color: "hsl(var(--chart-1))",
    },
    {
      id: "mounjaro",
      name: "Mounjaro",
      dose: "5mg",
      frequency: "Weekly",
      lastTaken: "Today",
      nextDose: "In 7 days",
      level: "4.5mg",
      totalAmount: "5mg",
      color: "hsl(var(--chart-2))",
    },
  ];

  // Animation delay utility
  const getAnimationDelay = (index: number) => `${index * 0.05}s`;
  
  // Handle navigation
  const handleNavigateToMedications = () => {
    navigate("/medications");
  };
  
  const handleNavigateToHealth = () => {
    navigate("/health");
  };
  
  const handleViewDetails = () => {
    navigate("/health");
  };

  return (
    <div className="px-4 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto space-y-8">
      <header 
        className={`space-y-2 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
        style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()},{" "}
          <span className="text-primary">
            Eric
          </span>
        </h1>
        <p className="text-muted-foreground">
          Here's your health overview for today
        </p>
      </header>

      {/* Medication Overview */}
      <section 
        className={`space-y-5 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
        style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Medication Tracker
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary flex items-center hover:bg-primary/5"
            onClick={handleNavigateToMedications}
          >
            View all <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid gap-5">
          {medications.map((med, index) => (
            <Card
              key={med.id}
              className={`overflow-hidden border-l-4 card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
              style={{ 
                borderLeftColor: med.color, 
                animationDelay: getAnimationDelay(index),
                animationFillMode: "forwards"
              }}
            >
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mr-4"
                      style={{ backgroundColor: `${med.color}15` }}
                    >
                      <PillIcon
                        className="h-6 w-6"
                        style={{ color: med.color }}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">
                        {med.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {med.dose} • {med.frequency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">
                      {med.level}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Remaining amount
                    </p>
                  </div>
                </div>

                <Progress
                  value={(parseFloat(med.level) / parseFloat(med.totalAmount)) * 100}
                  className="h-2 mb-4"
                  style={
                    {
                      backgroundColor: `${med.color}20`,
                      "--progress-background": med.color,
                    } as React.CSSProperties
                  }
                />

                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Last taken: {med.lastTaken}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Next dose: {med.nextDose}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Today's Metrics */}
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
            onClick={handleNavigateToHealth}
          >
            View all <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* Health Metrics in a cleaner, more organized grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Row 1 */}
          <MetricCard
            title="Weight"
            value="185.6"
            unit="lbs"
            icon={<TrendingUpIcon className="h-4 w-4 text-green-500" />}
            iconBgColor="hsl(var(--chart-3)/15)"
            trend="-0.8%"
            trendIcon={<TrendingUpIcon className="h-3 w-3 mr-1" />}
            trendColor="text-green-600 dark:text-green-400"
            animationDelay="0.35s"
            isLoaded={isLoaded}
          />
          
          <MetricCard
            title="Activity"
            value="6,254"
            unit="steps"
            icon={<ActivityIcon className="h-4 w-4 text-primary" />}
            iconBgColor="hsl(var(--chart-1)/15)"
            trend="+12%"
            trendIcon={<TrendingUpIcon className="h-3 w-3 mr-1" />}
            trendColor="text-primary"
            animationDelay="0.4s"
            isLoaded={isLoaded}
          />
          
          <MetricCard
            title="Heart Rate"
            value="72"
            unit="bpm"
            icon={<HeartIcon className="h-4 w-4 text-rose-500 animate-pulse-subtle" />}
            iconBgColor="hsl(var(--chart-4)/15)"
            status="Normal"
            statusColor="text-green-600 dark:text-green-400"
            animationDelay="0.45s"
            isLoaded={isLoaded}
          />
          
          <MetricCard
            title="Sleep"
            value="7h 32m"
            icon={<MoonIcon className="h-4 w-4 text-indigo-500" />}
            iconBgColor="hsl(var(--chart-2)/15)"
            trend="+8%"
            trendIcon={<TrendingUpIcon className="h-3 w-3 mr-1" />}
            trendColor="text-green-600 dark:text-green-400"
            animationDelay="0.5s"
            isLoaded={isLoaded}
          />
          
          {/* Row 2 */}
          <MetricCard
            title="Hydration"
            value="1.2"
            unit="L"
            icon={<DropletIcon className="h-4 w-4 text-blue-500" />}
            iconBgColor="hsl(var(--blue-6)/15)"
            status="Goal: 2L"
            statusColor="text-muted-foreground"
            animationDelay="0.55s"
            isLoaded={isLoaded}
          />
          
          <MetricCard
            title="Calories"
            value="1,450"
            unit="kcal"
            icon={<UtensilsIcon className="h-4 w-4 text-green-500" />}
            iconBgColor="hsl(var(--green-6)/15)"
            status="-350 deficit"
            statusColor="text-amber-600 dark:text-amber-400"
            animationDelay="0.6s"
            isLoaded={isLoaded}
          />
          
          <MetricCard
            title="Glucose"
            value="98"
            unit="mg/dL"
            icon={<BrainIcon className="h-4 w-4 text-amber-500" />}
            iconBgColor="hsl(var(--yellow-6)/15)"
            status="Stable"
            statusColor="text-green-600 dark:text-green-400"
            animationDelay="0.65s"
            isLoaded={isLoaded}
          />
          
          <MetricCard
            title="Blood Pressure"
            value="120/80"
            icon={<ActivityIcon className="h-4 w-4 text-cyan-500" />}
            iconBgColor="hsl(var(--cyan-6)/15)"
            status="Normal"
            statusColor="text-green-600 dark:text-green-400"
            animationDelay="0.7s"
            isLoaded={isLoaded}
          />
        </div>
      </section>

      {/* Weight Progress */}
      <section 
        className={`opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
        style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
      >
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">
                Weight Progress
              </CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                className="hover:bg-primary/5"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  -18 lbs
                </div>
                <div className="text-sm text-muted-foreground">
                  Since starting GLP-1
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold">
                  192 lbs
                </div>
                <div className="text-sm text-muted-foreground">
                  Current weight
                </div>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weightData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.3)" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    tickMargin={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                    tickMargin={10}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '0.5rem',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    }}
                    itemStyle={{ color: 'hsl(var(--primary))' }}
                    labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "hsl(var(--chart-1))" }}
                    activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                    animationDuration={2000}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

// Metric Card Component to clean up the metrics section
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

const MetricCard = ({
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

export default Dashboard;
