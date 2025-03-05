
/**
 * InsightsHeader Component
 * 
 * A component that displays the header section for the Insights page.
 * Following CodeFarm Development Methodology:
 * - Holistic Development: Combines UI elements with user-focused functionality
 * - User-Centric Design: Provides clear context about data timeframe and refresh capability
 * - Sustainable Code: Simple, focused component with clear documentation
 * 
 * @param onRefresh - Optional callback function to trigger data refresh
 * @returns React component that renders the Insights page header
 */
import React from "react";
import { CalendarIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format, subDays } from "date-fns";
import TimePeriodSelector from "./TimePeriodSelector";
import { useInsightsContext } from "@/contexts/InsightsContext";

interface InsightsHeaderProps {
  onRefresh?: () => void;
}

const InsightsHeader: React.FC<InsightsHeaderProps> = ({ onRefresh }) => {
  const { timePeriod, setTimePeriod, getDaysFromTimePeriod } = useInsightsContext();

  /**
   * Handles the refresh action when user clicks the refresh button
   * In a production environment, this would trigger a data refresh from multiple sources
   */
  const handleRefresh = () => {
    console.log("Refreshing insights data...");
    // In a production app, this would dispatch actions to refresh all insights data
    // from various sources (e.g., health data APIs, medication tracking systems)
    if (onRefresh) {
      onRefresh();
    }
  };

  /**
   * Calculates and formats the date range to display in the header
   * Shows the date range based on selected time period
   * 
   * @returns Formatted date range string
   */
  const getDateRangeText = (): string => {
    const endDate = new Date();
    const days = getDaysFromTimePeriod();
    const startDate = subDays(endDate, days);
    
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Insights</h1>
          <p className="text-muted-foreground mt-1">
            Personalized health analyses and recommendations based on your data
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <TimePeriodSelector 
            selectedPeriod={timePeriod}
            onChange={setTimePeriod}
          />
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
          >
            <RefreshCwIcon className="w-4 h-4" />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      <Card className="bg-muted/40 border-muted">
        <CardContent className="p-4 flex flex-row items-center gap-3">
          <CalendarIcon className="text-muted-foreground w-5 h-5" />
          <span className="text-sm text-muted-foreground">
            Data shown reflects activity from {getDateRangeText()}
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsHeader;
