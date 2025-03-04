
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
  DropletIcon,
  UtensilsIcon,
  MoonIcon,
  BrainIcon,
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
  
  const handleNavigateToProgress = () => {
    navigate("/progress");
  };
  
  const handleViewDetails = () => {
    navigate("/progress");
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
            onClick={handleNavigateToProgress}
          >
            View all <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {/* First row of metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Weight
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      185.6
                    </span>
                    <span className="text-xs ml-1 text-muted-foreground">
                      lbs
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--chart-3)/15)" }}
                >
                  <TrendingUpIcon className="h-4 w-4 text-green-500" />
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  -0.8%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Activity
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      6,254
                    </span>
                    <span className="text-xs ml-1 text-muted-foreground">
                      steps
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--chart-1)/15)" }}
                >
                  <ActivityIcon className="h-4 w-4 text-primary" />
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center text-xs text-primary">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  +12%
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Heart Rate
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      72
                    </span>
                    <span className="text-xs ml-1 text-muted-foreground">
                      bpm
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--chart-4)/15)" }}
                >
                  <HeartIcon className="h-4 w-4 text-rose-500 animate-pulse-subtle" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs font-medium text-green-600 dark:text-green-400">
                  Normal
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Sleep
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      7h 32m
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--chart-2)/15)" }}
                >
                  <MoonIcon className="h-4 w-4 text-indigo-500" />
                </div>
              </div>

              <div className="mt-2">
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  +8%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Second row of metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.55s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Hydration
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      1.2
                    </span>
                    <span className="text-xs ml-1 text-muted-foreground">
                      L
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--blue-6)/15)" }}
                >
                  <DropletIcon className="h-4 w-4 text-blue-500" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs text-muted-foreground">
                  Goal: 2L
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Calories
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      1,450
                    </span>
                    <span className="text-xs ml-1 text-muted-foreground">
                      kcal
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--green-6)/15)" }}
                >
                  <UtensilsIcon className="h-4 w-4 text-green-500" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs text-amber-600 dark:text-amber-400">
                  -350 deficit
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Glucose
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      98
                    </span>
                    <span className="text-xs ml-1 text-muted-foreground">
                      mg/dL
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--yellow-6)/15)" }}
                >
                  <BrainIcon className="h-4 w-4 text-amber-500" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs font-medium text-green-600 dark:text-green-400">
                  Stable
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`overflow-hidden card-hover opacity-0 ${isLoaded ? "animate-scale-in opacity-100" : ""}`}
            style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Blood Pressure
                  </p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-xl font-bold">
                      120/80
                    </span>
                  </div>
                </div>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "hsl(var(--cyan-6)/15)" }}
                >
                  <ActivityIcon className="h-4 w-4 text-cyan-500" />
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs font-medium text-green-600 dark:text-green-400">
                  Normal
                </div>
              </div>
            </CardContent>
          </Card>
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

      {/* Connected Services */}
      <section 
        className={`space-y-5 opacity-0 ${isLoaded ? "animate-slide-up opacity-100" : ""}`}
        style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Connected Services
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary flex items-center hover:bg-primary/5"
            onClick={() => toast({
              title: "Connected Services",
              description: "View all connected services",
            })}
          >
            Manage <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <Card
          className="overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white to-gray-50 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-100 dark:border-gray-700 card-hover"
        >
          <CardContent className="p-5 space-y-4">
            {[
              {
                name: "MyFitnessPal",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 11.5C21 17.0228 16.5228 21.5 11 21.5C5.47715 21.5 1 17.0228 1 11.5C1 5.97715 5.47715 1.5 11 1.5C16.5228 1.5 21 5.97715 21 11.5Z" stroke="#22C55E" strokeWidth="2" />
                    <path d="M21.5 12C21.5 17.2467 17.2467 21.5 12 21.5C6.75329 21.5 2.5 17.2467 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12Z" stroke="#22C55E" strokeWidth="2" />
                    <path d="M8.5 11.5L10.5 13.5L15.5 8.5" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                lastSynced: "Today, 9:41 AM",
                bgColor: "bg-green-100 dark:bg-green-900/40"
              },
              {
                name: "Withings Scale",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="hsl(var(--chart-1))" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="hsl(var(--chart-1))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                lastSynced: "Today, 7:15 AM",
                bgColor: "bg-blue-100 dark:bg-blue-900/40"
              },
              {
                name: "Whoop",
                icon: (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12H18L15 21L9 3L6 12H2" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                lastSynced: "Yesterday, 11:30 PM",
                bgColor: "bg-purple-100 dark:bg-purple-900/40"
              }
            ].map((service, index) => (
              <div 
                key={service.name}
                className={`flex items-center justify-between py-3 px-2 rounded-xl transition-all hover:bg-gray-100/50 dark:hover:bg-gray-800/30 cursor-pointer opacity-0 ${isLoaded ? "animate-slide-in-right opacity-100" : ""}`}
                style={{ animationDelay: `${0.5 + (index * 0.1)}s`, animationFillMode: "forwards" }}
              >
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full ${service.bgColor} flex items-center justify-center mr-4`}>
                    {service.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {service.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Last synced: {service.lastSynced}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
