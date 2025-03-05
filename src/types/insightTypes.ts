
/**
 * Insight Types
 * 
 * Following CodeFarm architecture principles:
 * - Strong Typing: Comprehensive type definitions
 * - Documentation: Detailed JSDoc comments
 * - Modularity: Separation of concerns
 */

import { ReactNode } from "react";

/**
 * Types of health recommendations
 */
export enum RecommendationType {
  EXERCISE = "exercise",
  NUTRITION = "nutrition",
  SLEEP = "sleep",
  MEDICATION = "medication",
  STRESS = "stress",
  GENERAL = "general"
}

/**
 * Icons for health recommendations
 */
export enum RecommendationIconType {
  ACTIVITY = "activity",
  NUTRITION = "nutrition",
  MEDICATION = "medication",
  SLEEP = "sleep",
  STRESS = "stress",
  GENERAL = "general"
}

/**
 * Impact levels for recommendations
 */
export type ImpactLevel = 'high' | 'medium' | 'low';

/**
 * Health recommendation model
 */
export interface Recommendation {
  /** Unique identifier */
  id: string;
  /** Title of the recommendation */
  title: string;
  /** Detailed description */
  description: string;
  /** Type of recommendation */
  type: RecommendationType | string;
  /** Icon type for the recommendation */
  iconType: RecommendationIconType | string;
  /** Color theme for the recommendation */
  color: string;
  /** Impact level */
  impact: ImpactLevel;
  /** Action button label */
  actionLabel: string;
  /** Action link */
  actionLink: string;
}

/**
 * Health insight model
 */
export interface Insight {
  /** Unique identifier */
  id: string;
  /** Title of the insight */
  title: string;
  /** Detailed description */
  description: string;
  /** Type of insight */
  type: string;
  /** Creation date */
  createdAt: string;
  /** Relevance score */
  relevanceScore: number;
  /** Whether the insight is new/unread */
  isNew: boolean;
  /** Optional link to more information */
  link?: string;
}

/**
 * Health correlation model
 */
export interface Correlation {
  /** Unique identifier */
  id: string;
  /** Primary metric */
  primaryMetric: string;
  /** Secondary metric that correlates with primary */
  secondaryMetric: string;
  /** Correlation strength: -1.0 to 1.0 */
  strength: number;
  /** Statistical confidence: 0-1 */
  confidence: number;
  /** Human-readable explanation */
  explanation: string;
  /** When the correlation was discovered */
  discoveredAt: string;
  /** Action recommendations */
  recommendations?: Recommendation[];
}

/**
 * Weekly progress model
 */
export interface WeeklyProgress {
  /** Week start date */
  weekStarting: string;
  /** Week ending date */
  weekEnding: string;
  /** Primary metric progress */
  primaryMetricProgress: number;
  /** Goal achievement percentage */
  goalAchievement: number;
  /** Top performing metric */
  topPerformer: string;
  /** Area needing improvement */
  improvementArea: string;
  /** Next week recommendations */
  recommendations: Recommendation[];
}

/**
 * Time period for insights analysis
 */
export type InsightTimePeriod = '7d' | '30d' | '90d' | 'custom';

/**
 * Insight filter criteria
 */
export interface InsightFilter {
  /** Types to include */
  types?: string[];
  /** Minimum relevance score */
  minRelevance?: number;
  /** Show only new insights */
  onlyNew?: boolean;
  /** Time period */
  period?: InsightTimePeriod;
}

/**
 * Properties for recommendation components
 */
export interface RecommendationProps {
  /** The recommendation data */
  recommendation: Recommendation;
  /** Handler for the main action */
  onActionClick: () => void;
  /** Animation order index */
  index: number;
  /** Whether the recommendation is bookmarked */
  isBookmarked: boolean;
  /** Handler for toggling bookmark state */
  onBookmarkToggle: (id: string) => void;
  /** Icon for unbookmarked state */
  bookmarkIcon: ReactNode;
  /** Icon for bookmarked state */
  bookmarkFilledIcon: ReactNode;
}
