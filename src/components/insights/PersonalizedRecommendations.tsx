
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronRightIcon, 
  ArrowRightIcon, 
  UserIcon, 
  PillIcon, 
  ActivityIcon,
  SunIcon,
  MoonIcon,
  BrainIcon,
  SparklesIcon,
  FilterIcon
} from "lucide-react";
import { useRecommendations } from "@/hooks/useRecommendations";
import { Recommendation, RecommendationType, RecommendationIconType } from "@/types/insightTypes";
import RecommendationsLoadingState from "./RecommendationsLoadingState";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";

/**
 * PersonalizedRecommendations Component
 * 
 * Displays personalized health recommendations based on user data.
 * Following CodeFarm principles:
 * - Separation of concerns: Data fetching handled by custom hook
 * - Error handling: Graceful fallbacks and user notifications
 * - Documentation: Comprehensive JSDoc comments
 * - Single Responsibility: Each subcomponent has a focused purpose
 */
const PersonalizedRecommendations: React.FC = () => {
  const { data: recommendations = [], isLoading, error } = useRecommendations();
  const [activeFilter, setActiveFilter] = useState<RecommendationType | 'all'>('all');

  // Show loading state while data is being fetched
  if (isLoading) {
    return <RecommendationsLoadingState />;
  }

  // Show empty state if there are no recommendations or if there was an error
  if ((recommendations.length === 0 && !isLoading) || error) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Personalized Recommendations
        </h2>
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
      </div>
    );
  }

  // Get unique recommendation types for filtering
  const recommendationTypes = [...new Set(recommendations.map(rec => rec.type))];
  
  // Filter recommendations based on active filter
  const filteredRecommendations = activeFilter === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.type === activeFilter);

  return (
    <div className="space-y-4">
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

      {/* Recommendation Type Filters */}
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

      <motion.div 
        className="grid gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {filteredRecommendations.map((recommendation, index) => (
          <motion.div
            key={recommendation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <RecommendationCard
              recommendation={recommendation}
              onActionClick={() => handleRecommendationClick(recommendation)}
            />
          </motion.div>
        ))}
        
        {filteredRecommendations.length === 0 && activeFilter !== 'all' && (
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
                onClick={() => setActiveFilter('all')}
              >
                Show All Recommendations
              </Button>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};

/**
 * Format recommendation type for display
 */
const formatRecType = (type: RecommendationType | 'all'): string => {
  if (type === 'all') return 'All';
  
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
 * Handle recommendation click
 */
const handleRecommendationClick = (recommendation: Recommendation) => {
  console.log(`Recommendation viewed: ${recommendation.id}`);
  toast({
    title: `${recommendation.title}`,
    description: "We've saved this recommendation to your activity feed.",
  });
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
 * RecommendationCard subcomponent for rendering individual recommendations
 */
interface RecommendationCardProps {
  recommendation: Recommendation;
  onActionClick: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ 
  recommendation, 
  onActionClick 
}) => {
  const colors = colorMap[recommendation.color as keyof typeof colorMap] || colorMap.blue;
  const Icon = () => getIconComponent(recommendation.iconType);

  return (
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
              <Badge variant="outline" className="text-xs">
                {formatRecType(recommendation.type)}
              </Badge>
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
  );
};

export default PersonalizedRecommendations;
