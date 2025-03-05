
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon, BookmarkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Recommendation, RecommendationIconType } from "@/types/insightTypes";
import { motion } from "framer-motion";
import { 
  UserIcon, 
  PillIcon, 
  ActivityIcon,
  MoonIcon,
  BrainIcon,
  SparklesIcon
} from "lucide-react";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onActionClick: () => void;
  index: number;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
}

/**
 * Color mapping for different recommendation types
 */
const colorMap = {
  green: {
    border: "border-l-green-500",
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-600 dark:text-green-400",
  },
  blue: {
    border: "border-l-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-600 dark:text-blue-400",
  },
  purple: {
    border: "border-l-purple-500",
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    border: "border-l-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-600 dark:text-orange-400",
  },
  red: {
    border: "border-l-red-500",
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-600 dark:text-red-400",
  },
};

/**
 * Format recommendation type for display
 */
export const formatRecType = (type: string): string => {
  return {
    nutrition: 'Nutrition',
    activity: 'Activity',
    medication: 'Medication',
    sleep: 'Sleep',
    stress: 'Stress',
    general: 'General'
  }[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Helper function to get the appropriate icon component based on the recommendation type
 */
const getIconComponent = (iconType: RecommendationIconType) => {
  switch (iconType) {
    case 'nutrition':
      return <UserIcon />;
    case 'medication':
      return <PillIcon />;
    case 'activity':
      return <ActivityIcon />;
    case 'sleep':
      return <MoonIcon />;
    case 'stress':
      return <BrainIcon />;
    default:
      return <SparklesIcon />;
  }
};

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  onActionClick,
  index,
  isBookmarked,
  onBookmarkToggle
}) => {
  const colors = colorMap[recommendation.color as keyof typeof colorMap] || colorMap.blue;
  const Icon = () => getIconComponent(recommendation.iconType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card
        className={`overflow-hidden border-l-4 ${colors.border} hover:shadow-md transition-shadow`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}
            >
              <Icon />
            </div>
            <div className="w-full">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">
                  {recommendation.title}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 ${isBookmarked ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                    onClick={() => onBookmarkToggle(recommendation.id)}
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark recommendation"}
                  >
                    <BookmarkIcon 
                      className="h-4 w-4" 
                      fill={isBookmarked ? "currentColor" : "none"} 
                    />
                  </Button>
                  <Badge variant="outline" className="text-xs">
                    {formatRecType(recommendation.type)}
                  </Badge>
                </div>
              </div>
              <p
                className="text-sm text-gray-500 dark:text-gray-400 mt-1"
              >
                {recommendation.description}
              </p>
              <Button
                variant="link"
                className={`p-0 h-auto mt-2 ${colors.text} flex items-center`}
                onClick={onActionClick}
              >
                {recommendation.actionLabel}{" "}
                <ArrowRightIcon className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
