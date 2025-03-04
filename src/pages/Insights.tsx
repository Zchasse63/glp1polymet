
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer } from "@/components/ui/chart";
import { Line, LineChart, XAxis, CartesianGrid } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import {
  TrendingUpIcon,
  ZapIcon,
  BriefcaseIcon,
  ChevronRightIcon,
  ArrowRightIcon,
  UsersIcon,
} from "lucide-react";

export default function Insights() {
  // Sample correlation data
  const correlationData = [
    { factor: "Medication Adherence", correlation: 0.85 },
    { factor: "Protein Intake", correlation: 0.72 },
    { factor: "Sleep Quality", correlation: 0.68 },
    { factor: "Step Count", correlation: 0.65 },
    { factor: "Stress Level", correlation: -0.58 },
    { factor: "Carb Intake", correlation: -0.45 },
  ];

  // Sample trend data
  const trendData = [
    { date: "Week 1", weight: 210, medication: 80 },
    { date: "Week 2", weight: 208, medication: 85 },
    { date: "Week 3", weight: 207, medication: 90 },
    { date: "Week 4", weight: 205, medication: 85 },
    { date: "Week 5", weight: 203, medication: 90 },
    { date: "Week 6", weight: 200, medication: 95 },
    { date: "Week 7", weight: 198, medication: 90 },
    { date: "Week 8", weight: 195, medication: 95 },
  ];

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          AI Insights
        </h1>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
        >
          <ZapIcon className="h-5 w-5" />
        </Button>
      </div>

      <Card
        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800 overflow-hidden"
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0"
            >
              <TrendingUpIcon
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Weekly Progress Summary
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You're making excellent progress! Your weight loss is 15% faster
                than the average GLP-1 user at this stage.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-0"
                >
                  -2.3 lbs this week
                </Badge>
                <Badge
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0"
                >
                  100% medication adherence
                </Badge>
                <Badge
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-0"
                >
                  +12% activity level
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Weight Loss Correlations
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <p
            className="text-sm text-gray-500 dark:text-gray-400 mb-4"
          >
            Factors most strongly correlated with your weight loss success
          </p>

          <div className="space-y-3">
            {correlationData.map((item, i) => (
              <div key={i} className="flex items-center">
                <div className="w-40 text-sm">
                  {item.factor}
                </div>
                <div
                  className="flex-1 h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full rounded-r-full ${
                      item.correlation > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.abs(item.correlation) * 100}%`,
                    }}
                  ></div>
                </div>
                <div
                  className="w-12 text-right text-sm font-medium"
                >
                  {item.correlation > 0 ? "+" : ""}
                  {Math.round(item.correlation * 100)}%
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-4 text-sm text-gray-500 dark:text-gray-400"
          >
            <p>
              <span
                className="font-medium text-gray-700 dark:text-gray-300"
              >
                Key Insight:
              </span>{" "}
              Your weight loss is most strongly correlated with medication
              adherence and protein intake.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Medication Effectiveness
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[250px] w-full">
            <ChartContainer
              config={{}}
              className="aspect-[none] h-[250px]"
            >
              <LineChart
                data={trendData}
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
                  name="Weight (lbs)"
                  radius={4}
                />

                <Line
                  type="monotone"
                  dataKey="medication"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "hsl(var(--chart-2))" }}
                  activeDot={{ r: 6 }}
                  name="Medication Level (%)"
                  radius={4}
                />
              </LineChart>
            </ChartContainer>
          </div>

          <div className="mt-4 text-sm">
            <p
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Analysis:
            </p>
            <p className="text-gray-500 dark:text-gray-400">
              Your weight loss shows a strong correlation with medication
              levels. Periods with higher medication adherence show accelerated
              weight loss.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Personalized Recommendations
          </h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400 flex items-center"
          >
            View all <ChevronRightIcon className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="grid gap-3">
          <Card
            className="overflow-hidden border-l-4 border-l-green-500 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0"
                >
                  <UsersIcon
                    className="h-4 w-4 text-green-600 dark:text-green-400"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    Increase Protein Intake
                  </h3>
                  <p
                    className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                  >
                    Based on your data, increasing protein to 100g daily could
                    accelerate your progress by 15%.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-green-600 dark:text-green-400 flex items-center"
                  >
                    View meal suggestions{" "}
                    <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="overflow-hidden border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0"
                >
                  <BriefcaseIcon
                    className="h-4 w-4 text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    Optimize Medication Timing
                  </h3>
                  <p
                    className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                  >
                    Taking your medication in the morning may improve
                    effectiveness based on your activity patterns.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-blue-600 dark:text-blue-400 flex items-center"
                  >
                    Adjust schedule{" "}
                    <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className="overflow-hidden border-l-4 border-l-purple-500 hover:shadow-md transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0"
                >
                  <TrendingUpIcon
                    className="h-4 w-4 text-purple-600 dark:text-purple-400"
                  />
                </div>
                <div>
                  <h3 className="font-medium">
                    Add Strength Training
                  </h3>
                  <p
                    className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                  >
                    Users with similar profiles saw 20% better results when
                    adding 2x weekly strength training.
                  </p>
                  <Button
                    variant="link"
                    className="p-0 h-auto mt-2 text-purple-600 dark:text-purple-400 flex items-center"
                  >
                    View workout plan{" "}
                    <ArrowRightIcon className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
