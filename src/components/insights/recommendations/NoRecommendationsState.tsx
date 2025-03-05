
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SparklesIcon, FilterIcon } from "lucide-react";
import { RecommendationType } from "@/types/insightTypes";
import { formatRecType } from "./RecommendationCard";

interface NoRecommendationsStateProps {
  isFiltered: boolean;
  activeFilter: RecommendationType | 'all';
  resetFilter: () => void;
}

const NoRecommendationsState: React.FC<NoRecommendationsStateProps> = ({
  isFiltered,
  activeFilter,
  resetFilter
}) => {
  if (isFiltered) {
    return (
      <Card className="p-4">
        <div className="text-center py-4">
          <FilterIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-md font-medium mb-1">No {formatRecType(activeFilter)} Recommendations</h3>
          <p className="text-sm text-muted-foreground">
            Try another category or view all recommendations.
          </p>
          <Button 
            variant="link" 
            className="mt-2"
            onClick={resetFilter}
          >
            Show All Recommendations
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 text-center">
      <div className="flex flex-col items-center justify-center py-4">
        <SparklesIcon className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium mb-1">No Recommendations Available</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          We're still analyzing your data to provide personalized recommendations. 
          Check back soon for insights tailored to your health journey.
        </p>
      </div>
    </Card>
  );
};

export default NoRecommendationsState;
