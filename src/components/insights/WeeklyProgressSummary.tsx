
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useWeeklyProgress } from "@/hooks/useWeeklyProgress";
import WeeklyProgressLoadingState from "./WeeklyProgressLoadingState";
import { BarChart3 } from "lucide-react";
import { useInsightsContext } from "@/contexts/InsightsContext";

/**
 * WeeklyProgressSummary Component
 * 
 * Shows a summary of the user's progress over the selected time period.
 * Following CodeFarm principles:
 * - User-Centric Design: Clean, informative summary with visual hierarchy
 * - Separation of Concerns: Data loading and UI rendering separated
 * - Holistic Development: Part of the broader insights ecosystem
 */
const WeeklyProgressSummary: React.FC = () => {
  const { progressData, loading, error } = useWeeklyProgress();
  const { timePeriod } = useInsightsContext();
  
  // Get an appropriate title based on the selected time period
  const getTimeBasedTitle = () => {
    switch (timePeriod) {
      case '7days': return 'Weekly Progress Summary';
      case '30days': return 'Monthly Progress Summary';
      case '90days': return '90-Day Progress Summary';
      case '6months': return '6-Month Progress Summary';
      case '1year': return 'Yearly Progress Summary';
      default: return 'Progress Summary';
    }
  };
  
  if (loading) {
    return <WeeklyProgressLoadingState />;
  }
  
  if (error || !progressData) {
    return (
      <Card className="border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            {getTimeBasedTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Unable to load progress data. Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { summaryText, comparisonText, badges, period } = progressData;
  
  const getBadgeColorClass = (colorTheme: string) => {
    switch (colorTheme) {
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'blue': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'purple': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'orange': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'red': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  return (
    <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {getTimeBasedTitle()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="text-xl font-medium mb-1">
              {summaryText}
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              {comparisonText}
            </p>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {badges.map((badge, index) => (
                <span 
                  key={index}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${getBadgeColorClass(badge.colorTheme)}`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-32 flex items-center justify-center">
            <div className="bg-primary/10 rounded-full p-6">
              <BarChart3 className="w-12 h-12 text-primary" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyProgressSummary;
