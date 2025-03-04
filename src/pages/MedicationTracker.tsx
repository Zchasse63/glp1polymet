
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  PlusIcon,
  InfoIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PillIcon,
  ClockIcon,
  CalendarIcon,
} from "lucide-react";
import { Layout } from "@/components/Layout";

export default function MedicationTracker() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("week");

  // Sample data for medication levels over time
  const weekData = [
    { day: "Mon", ozempic: 80, mounjaro: 0, wegovy: 0 },
    { day: "Tue", ozempic: 70, mounjaro: 0, wegovy: 0 },
    { day: "Wed", ozempic: 60, mounjaro: 0, wegovy: 0 },
    { day: "Thu", ozempic: 50, mounjaro: 90, wegovy: 0 },
    { day: "Fri", ozempic: 40, mounjaro: 80, wegovy: 0 },
    { day: "Sat", ozempic: 30, mounjaro: 70, wegovy: 0 },
    { day: "Sun", ozempic: 20, mounjaro: 60, wegovy: 0 },
  ];

  const monthData = Array(30)
    .fill(0)
    .map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - 29 + i);
      return {
        day: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        ozempic: Math.max(0, 80 - (i % 7) * 10),
        mounjaro: i >= 23 ? Math.max(0, 90 - ((i - 23) % 7) * 10) : 0,
        wegovy: 0,
      };
    });

  const medications = [
    {
      id: "ozempic",
      name: "Ozempic",
      dose: "0.5mg",
      frequency: "Weekly",
      lastTaken: "3 days ago",
      nextDose: "In 4 days",
      level: 50,
      color: "hsl(var(--chart-1))",
    },
    {
      id: "mounjaro",
      name: "Mounjaro",
      dose: "5mg",
      frequency: "Weekly",
      lastTaken: "Today",
      nextDose: "In 7 days",
      level: 90,
      color: "hsl(var(--chart-2))",
    },
  ];

  return (
    <Layout>
      <div className="px-4 py-8 md:px-8 lg:px-10 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Medication Tracker
          </h1>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>

        <Tabs
          defaultValue="overview"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList
            className="grid w-full grid-cols-2 h-10 rounded-lg p-1 bg-muted"
          >
            <TabsTrigger value="overview" className="rounded-md">
              Overview
            </TabsTrigger>
            <TabsTrigger value="schedule" className="rounded-md">
              Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="space-y-4">
              {medications.map((med, index) => (
                <Card
                  key={med.id}
                  className="overflow-hidden border-l-4 card-hover"
                  style={{ borderLeftColor: med.color }}
                >
                  <CardContent className="p-5">
                    <div
                      className="flex items-center justify-between mb-4"
                    >
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
                          <p
                            className="text-sm text-muted-foreground"
                          >
                            {med.dose} • {med.frequency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-medium">
                          {med.level}%
                        </div>
                        <p
                          className="text-sm text-muted-foreground"
                        >
                          Current level
                        </p>
                      </div>
                    </div>

                    <Progress
                      value={med.level}
                      className="h-2 mb-4"
                      style={
                        {
                          backgroundColor: `${med.color}20`,
                          "--progress-background": med.color,
                        } as React.CSSProperties
                      }
                    />

                    <div
                      className="flex justify-between text-sm"
                    >
                      <div
                        className="flex items-center text-muted-foreground"
                      >
                        <CalendarIcon
                          className="h-4 w-4 mr-2"
                        />
                        Last taken: {med.lastTaken}
                      </div>
                      <div
                        className="flex items-center text-muted-foreground"
                      >
                        <ClockIcon className="h-4 w-4 mr-2" />
                        Next dose: {med.nextDose}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 h-12"
              >
                <PlusIcon className="h-4 w-4" />
                Add Medication
              </Button>
            </div>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    Medication Levels
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button
                      variant={timeRange === "week" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange("week")}
                      className="h-8 text-xs"
                    >
                      Week
                    </Button>
                    <Button
                      variant={timeRange === "month" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTimeRange("month")}
                      className="h-8 text-xs"
                    >
                      Month
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div
                  className="text-xs text-muted-foreground flex items-center mb-2"
                >
                  <InfoIcon className="h-3 w-3 mr-1" />
                  Showing estimated medication levels in your system
                </div>

                <div className="h-[250px] w-full">
                  <ChartContainer
                    config={{
                      ozempic: { color: "hsl(var(--chart-1))" },
                      mounjaro: { color: "hsl(var(--chart-2))" }
                    }}
                    className="aspect-[none] h-[250px]"
                  >
                    <AreaChart
                      data={timeRange === "week" ? weekData : monthData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />

                      <defs>
                        <linearGradient
                          id="ozempicGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0.8}
                          />

                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-1))"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="mounjaroGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0.8}
                          />

                          <stop
                            offset="95%"
                            stopColor="hsl(var(--chart-2))"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="ozempic"
                        stroke="hsl(var(--chart-1))"
                        fill="url(#ozempicGradient)"
                        strokeWidth={2}
                        radius={4}
                      />

                      <Area
                        type="monotone"
                        dataKey="mounjaro"
                        stroke="hsl(var(--chart-2))"
                        fill="url(#mounjaroGradient)"
                        strokeWidth={2}
                        radius={4}
                      />
                    </AreaChart>
                  </ChartContainer>
                </div>

                <div className="flex justify-center mt-2 gap-4">
                  {medications.map((med) => (
                    <div
                      key={med.id}
                      className="flex items-center"
                    >
                      <div
                        className="w-3 h-3 rounded-full mr-1"
                        style={{ backgroundColor: med.color }}
                      ></div>
                      <span className="text-xs">
                        {med.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-4">
            <Card className="card-hover">
              <CardHeader
                className="pb-2 flex flex-row items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <ChevronLeftIcon className="h-4 w-4" />
                  </Button>
                  <CardTitle className="text-xl">
                    June 2023
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                  >
                    <ChevronRightIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                >
                  Today
                </Button>
              </CardHeader>
              <CardContent>
                <div
                  className="grid grid-cols-7 gap-1 text-center mb-2"
                >
                  {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
                    <div
                      key={i}
                      className="text-xs text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array(35)
                    .fill(0)
                    .map((_, i) => {
                      const day = i - 3; // Offset to start month on correct day
                      const isToday = day === 15;
                      const hasMedication = [1, 8, 15, 22, 29].includes(day);

                      return (
                        <div
                          key={i}
                          className={`
                            h-10 flex flex-col items-center justify-center rounded-md text-sm
                            ${day < 1 || day > 30 ? "text-gray-300 dark:text-gray-600" : ""}
                            ${isToday ? "bg-primary/10 text-primary font-medium" : ""}
                            ${hasMedication && !isToday ? "border border-primary/20" : ""}
                          `}
                        >
                          {day > 0 && day <= 30 && day}
                          {hasMedication && (
                            <div
                              className="w-1.5 h-1.5 rounded-full bg-primary mt-0.5"
                            ></div>
                          )}
                        </div>
                      );
                    })}
                </div>

                <div className="mt-6 space-y-2">
                  <h3 className="font-medium">
                    Upcoming Doses
                  </h3>

                  <div
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full bg-primary mr-2"
                      ></div>
                      <div>
                        <p className="font-medium">
                          Ozempic (0.5mg)
                        </p>
                        <p
                          className="text-xs text-muted-foreground"
                        >
                          Sunday, June 18
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-sm text-muted-foreground"
                    >
                      In 3 days
                    </span>
                  </div>

                  <div
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                  >
                    <div className="flex items-center">
                      <div
                        className="w-2 h-2 rounded-full bg-purple-500 mr-2"
                      ></div>
                      <div>
                        <p className="font-medium">
                          Mounjaro (5mg)
                        </p>
                        <p
                          className="text-xs text-muted-foreground"
                        >
                          Thursday, June 22
                        </p>
                      </div>
                    </div>
                    <span
                      className="text-sm text-muted-foreground"
                    >
                      In 7 days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
