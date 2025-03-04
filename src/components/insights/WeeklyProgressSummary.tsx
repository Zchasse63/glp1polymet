
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon } from "lucide-react";

const WeeklyProgressSummary = () => {
  return (
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
  );
};

export default WeeklyProgressSummary;
