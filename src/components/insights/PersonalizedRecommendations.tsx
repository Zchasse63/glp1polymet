
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRightIcon, ArrowRightIcon, UsersIcon, BriefcaseIcon, TrendingUpIcon } from "lucide-react";

const PersonalizedRecommendations = () => {
  return (
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
  );
};

export default PersonalizedRecommendations;
