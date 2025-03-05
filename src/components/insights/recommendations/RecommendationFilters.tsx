
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RecommendationType, RecommendationFilterType } from "@/types/insightTypes";
import { formatRecType } from "./RecommendationCard";
import { BookmarkIcon } from "lucide-react";

interface RecommendationFiltersProps {
  activeFilter: RecommendationFilterType;
  setActiveFilter: (filter: RecommendationFilterType) => void;
  recommendationTypes: (RecommendationType)[];
  hasBookmarks?: boolean;
}

const RecommendationFilters: React.FC<RecommendationFiltersProps> = ({
  activeFilter,
  setActiveFilter,
  recommendationTypes,
  hasBookmarks = false
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
      
      {hasBookmarks && (
        <Badge 
          variant={activeFilter === 'bookmarked' ? 'default' : 'outline'}
          className="cursor-pointer hover:bg-primary/90 transition-colors flex items-center gap-1"
          onClick={() => setActiveFilter('bookmarked')}
        >
          <BookmarkIcon className="h-3 w-3" /> Bookmarked
        </Badge>
      )}
      
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
