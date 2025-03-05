
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import { ProgressBadge } from "@/types/insightTypes";
import WeeklyProgressLoadingState from "./WeeklyProgressLoadingState";

/**
 * WeeklyProgressSummary Component
 * 
 * Displays a summary of the user's weekly progress with key achievements
 * Following CodeFarm principles:
 * - Separation of concerns: Data fetching handled by custom hook
 * - Error handling: Graceful fallbacks and user notifications
 * - Documentation: Comprehensive JSDoc comments
 * - Single Responsibility: Each subcomponent has a focused purpose
 */
const WeeklyProgressSummary: React.FC = () => {
  const { progressData, loading, error, refreshProgress } = useWeeklyProgress();

  // Show loading state while data is being fetched
  if (loading) {
    return <WeeklyProgressLoadingState />;
  }

  // Show error state if there was an error
  if (error || !progressData) {
    return (
      <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50 overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center py-4">
            <div className="bg-red-100 dark:bg-red-800/50 p-3 rounded-full mb-4">
              <RefreshCwIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">Unable to load progress summary</h3>
            <p className="text-sm text-muted-foreground mb-4">
              We couldn't retrieve your weekly progress data. Please try again later.
            </p>
            <Button onClick={() => refreshProgress()} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              {progressData.summaryText} {progressData.comparisonText}
            </p>
            <div className="flex flex-wrap gap-2">
              {progressData.badges.map((badge: ProgressBadge, index: number) => (
                <ProgressBadgeComponent key={index} badge={badge} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * ProgressBadgeComponent - Displays an achievement badge with appropriate styling
 */
interface ProgressBadgeProps {
  badge: ProgressBadge;
}

const ProgressBadgeComponent: React.FC<ProgressBadgeProps> = ({ badge }) => {
  const colorMap: Record<string, string> = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-0",
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-0",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-0",
    red: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-0"
  };

  const className = colorMap[badge.colorTheme] || colorMap.blue;

  return <Badge className={className}>{badge.text}</Badge>;
};

export default WeeklyProgressSummary;
