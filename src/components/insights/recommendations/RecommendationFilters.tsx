
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RecommendationType } from "@/types/insightTypes";
import { formatRecType } from "./RecommendationCard";

interface RecommendationFiltersProps {
  activeFilter: RecommendationType | 'all';
  setActiveFilter: (filter: RecommendationType | 'all') => void;
  recommendationTypes: (RecommendationType)[];
}

const RecommendationFilters: React.FC<RecommendationFiltersProps> = ({
  activeFilter,
  setActiveFilter,
  recommendationTypes
}) => {
  return (
    <div className="flex flex-wrap gap-2 pb-1">
      <Badge 
        variant={activeFilter === 'all' ? 'default' : 'outline'}
        className="cursor-pointer hover:bg-primary/90 transition-colors"
        onClick={() => setActiveFilter('all')}
      >
        All
      </Badge>
      {recommendationTypes.map(type => (
        <Badge 
          key={type}
          variant={activeFilter === type ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-primary/90 transition-colors"
          onClick={() => setActiveFilter(type)}
        >
          {formatRecType(type)}
        </Badge>
      ))}
    </div>
  );
};

export default RecommendationFilters;
