
import React from "react";
import { Recommendation } from "@/types/insightTypes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookmarkIcon, ChevronRightIcon } from "lucide-react";
import { AccessibleIcon } from "@/utils/accessibility/AccessibleIcon";
import { AccessibleButton } from "@/utils/accessibility/AccessibleButton";
import { Badge } from "@/components/ui/badge";
import { useA11yAnnouncement } from "@/utils/accessibility/useA11yAnnouncement";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";

interface AccessibleRecommendationCardProps {
  recommendation: Recommendation;
  onActionClick: () => void;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
  index: number;
}

/**
 * AccessibleRecommendationCard Component
 * 
 * An enhanced version of RecommendationCard with improved accessibility features
 */
const AccessibleRecommendationCard: React.FC<AccessibleRecommendationCardProps> = ({
  recommendation,
  onActionClick,
  isBookmarked,
  onBookmarkToggle,
  index
}) => {
  const { title, description, impact, actionLabel, iconType, color, id } = recommendation;
  const { announce } = useA11yAnnouncement({ assertive: false });
  const prefersReducedMotion = useReducedMotion();
  
  const handleBookmarkToggle = () => {
    onBookmarkToggle(id);
    announce(isBookmarked 
      ? `Removed ${title} from bookmarks` 
      : `Added ${title} to bookmarks`);
  };
  
  const handleActionClick = () => {
    onActionClick();
    announce(`Selected action: ${actionLabel} for recommendation: ${title}`);
  };
  
  // Determine impact label for accessibility
  const getImpactLabel = () => {
    switch (impact) {
      case 'high': return 'High impact';
      case 'medium': return 'Medium impact';
      case 'low': return 'Low impact';
      default: return `${impact} impact`;
    }
  };
  
  // Determine appropriate animation based on motion preferences
  const animationStyle = prefersReducedMotion ? {} : {
    transition: 'transform 0.2s ease-in-out',
    transform: 'translateY(0)',
    '&:hover': {
      transform: 'translateY(-4px)',
    }
  };
  
  return (
    <Card 
      className={cn(
        "relative overflow-hidden",
        "hover:shadow-md transition-shadow duration-200"
      )}
      style={animationStyle as any}
      // Add proper keyboard focus
      tabIndex={0}
      // Provide an accessible role
      role="article"
      aria-labelledby={`rec-title-${id}`}
      aria-describedby={`rec-desc-${id}`}
    >
      {/* Color accent bar */}
      <div 
        className="absolute top-0 left-0 w-full h-1" 
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      
      <CardContent className="p-4 pt-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {/* Icon with accessible label */}
            <AccessibleIcon
              icon={<span className="text-xl">🔍</span>}
              label={`${iconType} recommendation`}
              className="mr-2"
            />
            
            {/* Title with ID for aria-labelledby reference */}
            <h3 
              id={`rec-title-${id}`}
              className="font-medium text-lg"
            >
              {title}
            </h3>
          </div>
          
          {/* Bookmark button with accessible label */}
          <AccessibleButton
            onClick={handleBookmarkToggle}
            ariaLabel={isBookmarked ? `Remove ${title} from bookmarks` : `Bookmark ${title}`}
            className="p-1 rounded-full hover:bg-muted"
          >
            <BookmarkIcon 
              className={cn(
                "h-5 w-5", 
                isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"
              )} 
            />
          </AccessibleButton>
        </div>
        
        {/* Description with ID for aria-describedby reference */}
        <p 
          id={`rec-desc-${id}`}
          className="text-muted-foreground mb-4"
        >
          {description}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          {/* Impact badge with accessible label */}
          <Badge 
            variant="outline" 
            className={cn(
              "font-normal",
              impact === 'high' ? "border-orange-500 text-orange-700 bg-orange-50" :
              impact === 'medium' ? "border-blue-500 text-blue-700 bg-blue-50" :
              "border-gray-500 text-gray-700 bg-gray-50"
            )}
          >
            <span aria-label={getImpactLabel()}>
              {getImpactLabel()}
            </span>
          </Badge>
          
          {/* Action button with accessible icon */}
          <Button 
            size="sm" 
            onClick={handleActionClick}
            className="flex items-center gap-1"
          >
            {actionLabel}
            <AccessibleIcon 
              icon={<ChevronRightIcon className="h-4 w-4" />} 
              label="Go to action"
            />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibleRecommendationCard;
