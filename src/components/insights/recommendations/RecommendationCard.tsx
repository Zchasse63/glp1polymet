
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Recommendation, RecommendationIconType, ImpactLevel } from "@/types/insightTypes";
import { motion } from "framer-motion";
import { 
  UserIcon, 
  PillIcon, 
  ActivityIcon,
  MoonIcon,
  BrainIcon,
  SparklesIcon
} from "lucide-react";
import { useReducedMotion } from "@/utils/accessibility/useReducedMotion";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onActionClick: () => void;
  index: number;
  isBookmarked: boolean;
  onBookmarkToggle: (id: string) => void;
  bookmarkIcon: React.ReactNode;
  bookmarkFilledIcon: React.ReactNode; // Added the missing prop
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
 * Impact level styling and labels
 */
const impactLevelMap: Record<ImpactLevel, { color: string, label: string }> = {
  high: { color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-400", label: "High Impact" },
  medium: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-400", label: "Medium Impact" },
  low: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-400", label: "Low Impact" },
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
      return <UserIcon aria-hidden="true" />;
    case 'medication':
      return <PillIcon aria-hidden="true" />;
    case 'activity':
      return <ActivityIcon aria-hidden="true" />;
    case 'sleep':
      return <MoonIcon aria-hidden="true" />;
    case 'stress':
      return <BrainIcon aria-hidden="true" />;
    default:
      return <SparklesIcon aria-hidden="true" />;
  }
};

const RecommendationCard = ({ 
  recommendation, 
  onActionClick,
  index,
  isBookmarked,
  onBookmarkToggle,
  bookmarkIcon,
  bookmarkFilledIcon
}: RecommendationCardProps) => {
  const colors = colorMap[recommendation.color as keyof typeof colorMap] || colorMap.blue;
  const Icon = () => getIconComponent(recommendation.iconType);
  const impactStyle = impactLevelMap[recommendation.impact];
  const prefersReducedMotion = useReducedMotion();

  // Create appropriate motion props based on user preferences
  const motionProps = prefersReducedMotion 
    ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
    : { 
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: index * 0.1 }
      };

  return (
    <motion.div
      {...motionProps}
      role="region"
      aria-label={`Recommendation: ${recommendation.title}`}
    >
      <Card
        className={`overflow-hidden border-l-4 ${colors.border} hover:shadow-md transition-shadow`}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}
              aria-hidden="true"
            >
              <Icon />
            </div>
            <div className="w-full">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">
                  {recommendation.title}
                </h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onBookmarkToggle(recommendation.id)}
                    className="cursor-pointer"
                    aria-label={isBookmarked ? "Remove bookmark" : "Bookmark recommendation"}
                    aria-pressed={isBookmarked}
                  >
                    {isBookmarked ? bookmarkFilledIcon : bookmarkIcon}
                  </button>
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
              <div className="flex justify-between items-center mt-3">
                <Button
                  variant="link"
                  className={`p-0 h-auto ${colors.text} flex items-center`}
                  onClick={onActionClick}
                  aria-label={`${recommendation.actionLabel} about ${recommendation.title}`}
                >
                  {recommendation.actionLabel}{" "}
                  <ArrowRightIcon className="h-3 w-3 ml-1" aria-hidden="true" />
                </Button>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${impactStyle.color}`}
                  aria-label={`${impactStyle.label} recommendation`}
                >
                  {impactStyle.label}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecommendationCard;
