import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart, XAxis, CartesianGrid, Bar, BarChart } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CameraIcon, CalendarIcon, ChevronRightIcon, ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProgressJourney() {
  const [timeRange, setTimeRange] = useState("3m");

  // Sample weight data
  const weightData = [
    { date: "Jan 1", weight: 210 },
    { date: "Jan 15", weight: 208 },
    { date: "Feb 1", weight: 205 },
    { date: "Feb 15", weight: 202 },
    { date: "Mar 1", weight: 198 },
    { date: "Mar 15", weight: 195 },
    { date: "Apr 1", weight: 192 },
    { date: "Apr 15", weight: 190 },
    { date: "May 1", weight: 187 },
    { date: "May 15", weight: 185 },
    { date: "Jun 1", weight: 183 },
    { date: "Jun 15", weight: 181 },
  ];

  // Sample activity data
  const activityData = [
    { date: "Mon", steps: 8500, calories: 2100 },
    { date: "Tue", steps: 10200, calories: 2300 },
    { date: "Wed", steps: 7800, calories: 1950 },
    { date: "Thu", steps: 9100, calories: 2050 },
    { date: "Fri", steps: 11500, calories: 2400 },
    { date: "Sat", steps: 6500, calories: 1800 },
    { date: "Sun", steps: 5200, calories: 1700 },
  ];

  // Filter data based on time range
  const getFilteredData = () => {
    const now = new Date();
    let cutoffDate;

    switch (timeRange) {
      case "1m":
        cutoffDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case "3m":
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case "6m":
        cutoffDate = new Date(now.setMonth(now.getMonth() - 6));
        break;
      case "1y":
        cutoffDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        cutoffDate = new Date(now.setMonth(now.getMonth() - 3));
    }

    // For demo purposes, we're just returning different slices of the data
    switch (timeRange) {
      case "1m":
        return weightData.slice(-4);
      case "3m":
        return weightData.slice(-6);
      case "6m":
        return weightData.slice(-9);
      case "1y":
        return weightData;
      default:
        return weightData.slice(-6);
    }
  };

  const milestones = [
    {
      date: "June 15, 2023",
      title: "Started GLP-1 Medication",
      description: "Began Ozempic treatment with 0.25mg dose",
      image:
        "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      date: "July 20, 2023",
      title: "First 10 lbs Lost",
      description: "Reached first weight loss milestone",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      date: "September 5, 2023",
      title: "Increased to 0.5mg",
      description: "Medication dosage increased to 0.5mg weekly",
      image: null,
    },
    {
      date: "November 10, 2023",
      title: "Started Strength Training",
      description: "Added 3x weekly strength training to routine",
      image:
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
    {
      date: "January 2, 2024",
      title: "Switched to Mounjaro",
      description: "Changed medication to Mounjaro 5mg",
      image: null,
    },
    {
      date: "March 15, 2024",
      title: "25 lbs Total Loss",
      description: "Reached major milestone of 25 lbs weight loss",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <Layout>
      <div className="p-5 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="rounded-full">
              <Link to="/">
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">
              Progress Journey
            </h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
          >
            <CameraIcon className="h-5 w-5" />
          </Button>
        </div>

        <Card
          className="border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                Weight Progress
              </CardTitle>
              <div className="flex space-x-1">
                <Button
                  variant={timeRange === "1m" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("1m")}
                  className="h-7 text-xs"
                >
                  1M
                </Button>
                <Button
                  variant={timeRange === "3m" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("3m")}
                  className="h-7 text-xs"
                >
                  3M
                </Button>
                <Button
                  variant={timeRange === "6m" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("6m")}
                  className="h-7 text-xs"
                >
                  6M
                </Button>
                <Button
                  variant={timeRange === "1y" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange("1y")}
                  className="h-7 text-xs"
                >
                  1Y
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-3xl font-bold">
                  -29 lbs
                </div>
                <div
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Since starting GLP-1
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold">
                  181 lbs
                </div>
                <div
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Current weight
                </div>
              </div>
            </div>

            <div className="h-[250px] w-full">
              <ChartContainer
                config={{}}
                className="aspect-[none] h-[250px]"
              >
                <LineChart
                  data={getFilteredData()}
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
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickMargin={10}
                  />

                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "hsl(var(--chart-1))" }}
                    activeDot={{ r: 6 }}
                    radius={4}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="activity" className="w-full">
          <TabsList
            className="grid w-full grid-cols-3 h-10 rounded-lg p-1 bg-gray-100 dark:bg-gray-800"
          >
            <TabsTrigger value="activity" className="rounded-md">
              Activity
            </TabsTrigger>
            <TabsTrigger value="nutrition" className="rounded-md">
              Nutrition
            </TabsTrigger>
            <TabsTrigger value="sleep" className="rounded-md">
              Sleep
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="mt-4">
            <Card
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between mb-4"
                >
                  <div>
                    <div className="text-xl font-semibold">
                      Weekly Activity
                    </div>
                    <div
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Last 7 days
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    View Details
                  </Button>
                </div>

                <div className="h-[200px] w-full">
                  <ChartContainer
                    config={{}}
                    className="aspect-[none] h-[200px]"
                  >
                    <BarChart
                      data={activityData}
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
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                        tickMargin={10}
                      />

                      <Bar
                        dataKey="steps"
                        fill="hsl(var(--chart-2))"
                        radius={4}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center">
                    <div
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Avg. Steps
                    </div>
                    <div className="text-xl font-semibold">
                      8,400
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Active Days
                    </div>
                    <div className="text-xl font-semibold">
                      5/7
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Calories
                    </div>
                    <div className="text-xl font-semibold">
                      2,050
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nutrition" className="mt-4">
            <Card
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between mb-4"
                >
                  <div>
                    <div className="text-xl font-semibold">
                      Nutrition Summary
                    </div>
                    <div
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Last 7 days
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    View Details
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        Daily Calories
                      </div>
                      <div className="text-xl font-semibold">
                        1,850
                      </div>
                    </div>
                    <div className="text-sm text-green-500">
                      -15% from baseline
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">
                        Protein
                      </span>
                      <span className="text-sm">
                        95g / 120g
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                    >
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "79%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">
                        Carbs
                      </span>
                      <span className="text-sm">
                        180g / 225g
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                    >
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "80%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">
                        Fat
                      </span>
                      <span className="text-sm">
                        65g / 70g
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2"
                    >
                      <div
                        className="bg-yellow-500 h-2 rounded-full"
                        style={{ width: "93%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep" className="mt-4">
            <Card
              className="border border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div
                  className="flex items-center justify-between mb-4"
                >
                  <div>
                    <div className="text-xl font-semibold">
                      Sleep Patterns
                    </div>
                    <div
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      Last 7 days
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    View Details
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        Avg. Sleep Duration
                      </div>
                      <div className="text-xl font-semibold">
                        7h 15m
                      </div>
                    </div>
                    <div className="text-sm text-green-500">
                      +30m from baseline
                    </div>
                  </div>

                  <div className="space-y-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day, i) => (
                        <div
                          key={i}
                          className="flex items-center"
                          id={`dhv84j_${i}`}
                        >
                          <div className="w-10 text-sm" id={`tkpa4s_${i}`}>
                            {day}
                          </div>
                          <div
                            className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
                            id={`kat52g_${i}`}
                          >
                            <div
                              className="h-full bg-indigo-500 rounded-r-full"
                              style={{
                                width: `${[85, 70, 90, 75, 80, 95, 65][i]}%`,
                                opacity: 0.7 + i * 0.05,
                              }}
                              id={`y0eg2z_${i}`}
                            ></div>
                          </div>
                          <div
                            className="w-16 text-right text-sm"
                            id={`0wzjhy_${i}`}
                          >
                            {
                              [
                                "7h 30m",
                                "6h 15m",
                                "8h 00m",
                                "6h 45m",
                                "7h 10m",
                                "8h 20m",
                                "5h 50m",
                              ][i]
                            }
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Journey Timeline
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 dark:text-blue-400 flex items-center"
            >
              View all <ChevronRightIcon className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="space-y-4">
            {milestones.slice(0, 3).map((milestone, i) => (
              <div key={i} className="flex" id={`nx5rvm_${i}`}>
                <div
                  className="mr-4 flex flex-col items-center"
                  id={`bohrl0_${i}`}
                >
                  <div
                    className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                    id={`y8tsv8_${i}`}
                  >
                    <CalendarIcon
                      className="h-5 w-5 text-blue-600 dark:text-blue-400"
                      id={`lqrjfo_${i}`}
                    />
                  </div>
                  {i < 2 && (
                    <div
                      className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2"
                      id={`z7zus4_${i}`}
                    ></div>
                  )}
                </div>
                <div className="flex-1" id={`yq6ky0_${i}`}>
                  <Card
                    className="overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                    id={`julmnj_${i}`}
                  >
                    {milestone.image && (
                      <img
                        src={milestone.image}
                        alt={milestone.title}
                        className="w-full h-40 object-cover"
                        id={`6whgoc_${i}`}
                      />
                    )}

                    <CardContent
                      className={`p-4 ${milestone.image ? "pt-3" : ""}`}
                      id={`x4p0v4_${i}`}
                    >
                      <div
                        className="text-sm text-gray-500 dark:text-gray-400"
                        id={`wqskbc_${i}`}
                      >
                        {milestone.date}
                      </div>
                      <div className="font-semibold mt-1" id={`9g8p6v_${i}`}>
                        {milestone.title}
                      </div>
                      <div className="text-sm mt-1" id={`x08h4m_${i}`}>
                        {milestone.description}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
