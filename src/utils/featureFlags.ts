
/**
 * Feature Flags System
 * 
 * Following CodeFarm Development Methodology:
 * - Continuous Learning: Safely roll out new features
 * - Modular Design: Feature toggles for controlled deployments
 * - Sustainable Code: Manage technical debt with toggles
 * 
 * This module provides a feature flag system that allows for:
 * - Gradual feature rollouts
 * - A/B testing
 * - Feature toggling by user group
 * - Environment-specific features
 */

export enum RolloutStrategy {
  ALL_USERS = 'all_users',
  PERCENTAGE = 'percentage',
  USER_IDS = 'user_ids',
  USER_GROUPS = 'user_groups'
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  strategy: RolloutStrategy;
  // For PERCENTAGE strategy - what % of users get the feature
  percentage?: number;
  // For USER_IDS strategy - which specific users get the feature
  userIds?: string[];
  // For USER_GROUPS strategy - which groups get the feature
  userGroups?: string[];
  // When the feature flag was created
  createdAt: string;
  // When the feature flag will be removed/sunset
  expiresAt?: string;
  // Environment restrictions (dev, staging, prod)
  environments?: string[];
}

// Type for the feature repository
interface FeatureFlagRepository {
  getFlags(): Promise<FeatureFlag[]>;
  updateLocalFlags(flags: FeatureFlag[]): void;
}

// Local storage implementation of feature repository
class LocalFeatureFlagRepository implements FeatureFlagRepository {
  private storageKey = 'app_feature_flags';
  
  async getFlags(): Promise<FeatureFlag[]> {
    const storedFlags = localStorage.getItem(this.storageKey);
    
    if (storedFlags) {
      try {
        return JSON.parse(storedFlags) as FeatureFlag[];
      } catch {
        console.error('Failed to parse feature flags from localStorage');
      }
    }
    
    // Return default flags if none in storage
    return this.getDefaultFlags();
  }
  
  updateLocalFlags(flags: FeatureFlag[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(flags));
  }
  
  // Default feature flags for development
  private getDefaultFlags(): FeatureFlag[] {
    return [
      {
        id: 'insights-correlation-csv-export',
        name: 'Correlation CSV Export',
        description: 'Allow users to export correlation data as CSV',
        enabled: true,
        strategy: RolloutStrategy.ALL_USERS,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'insights-advanced-filters',
        name: 'Advanced Insight Filters',
        description: 'Advanced filtering options for health insights',
        enabled: false,
        strategy: RolloutStrategy.PERCENTAGE,
        percentage: 20,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'health-ai-recommendations',
        name: 'AI Health Recommendations',
        description: 'AI-powered health recommendations',
        enabled: true,
        strategy: RolloutStrategy.USER_GROUPS,
        userGroups: ['premium', 'beta-testers'],
        createdAt: new Date().toISOString(),
      }
    ];
  }
}

// Feature flag service
class FeatureFlagService {
  private repository: FeatureFlagRepository;
  private flags: FeatureFlag[] = [];
  private currentUserId: string | null = null;
  private currentUserGroups: string[] = [];
  private isInitialized = false;
  private environment: string;
  
  constructor(repository: FeatureFlagRepository) {
    this.repository = repository;
    this.environment = import.meta.env.MODE || 'development';
  }
  
  // Initialize the feature flag service
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      this.flags = await this.repository.getFlags();
      this.isInitialized = true;
      console.log(`[Features] Initialized with ${this.flags.length} feature flags`);
    } catch (error) {
      console.error('[Features] Failed to initialize feature flags:', error);
    }
  }
  
  // Set the current user context
  setUserContext(userId: string | null, userGroups: string[] = []): void {
    this.currentUserId = userId;
    this.currentUserGroups = userGroups;
  }
  
  // Check if a feature is enabled
  isEnabled(featureId: string): boolean {
    if (!this.isInitialized) {
      console.warn(`[Features] Checking feature ${featureId} before initialization`);
      return false;
    }
    
    const feature = this.flags.find(f => f.id === featureId);
    
    if (!feature) {
      console.warn(`[Features] Feature ${featureId} not found`);
      return false;
    }
    
    // Check if feature is enabled at all
    if (!feature.enabled) return false;
    
    // Check environment restrictions
    if (feature.environments && feature.environments.length > 0) {
      if (!feature.environments.includes(this.environment)) {
        return false;
      }
    }
    
    // Check expiration
    if (feature.expiresAt && new Date(feature.expiresAt) < new Date()) {
      return false;
    }
    
    // Apply rollout strategy
    switch (feature.strategy) {
      case RolloutStrategy.ALL_USERS:
        return true;
        
      case RolloutStrategy.PERCENTAGE:
        if (!feature.percentage) return false;
        
        // For reproducible random behavior based on user ID
        const hash = this.hashUserIdForPercentage();
        return (hash % 100) < feature.percentage;
        
      case RolloutStrategy.USER_IDS:
        return !!this.currentUserId && 
               !!feature.userIds && 
               feature.userIds.includes(this.currentUserId);
        
      case RolloutStrategy.USER_GROUPS:
        return this.currentUserGroups.some(group => 
          feature.userGroups?.includes(group)
        );
        
      default:
        return false;
    }
  }
  
  // Generate a deterministic hash from user ID for percentage rollouts
  private hashUserIdForPercentage(): number {
    if (!this.currentUserId) return Math.floor(Math.random() * 100);
    
    let hash = 0;
    for (let i = 0; i < this.currentUserId.length; i++) {
      hash = ((hash << 5) - hash) + this.currentUserId.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Get absolute value and mod 100
    return Math.abs(hash) % 100;
  }
  
  // Override a feature flag (for testing)
  overrideFeature(featureId: string, enabled: boolean): void {
    const featureIndex = this.flags.findIndex(f => f.id === featureId);
    
    if (featureIndex >= 0) {
      this.flags[featureIndex] = {
        ...this.flags[featureIndex],
        enabled
      };
      
      // Update storage
      this.repository.updateLocalFlags(this.flags);
    } else {
      console.warn(`[Features] Cannot override non-existent feature: ${featureId}`);
    }
  }
  
  // Get all feature flags (for admin UI)
  getAllFeatureFlags(): FeatureFlag[] {
    return [...this.flags];
  }
}

// Create and initialize the feature flag service
const featureFlags = new FeatureFlagService(
  new LocalFeatureFlagRepository()
);

// Initialize on load
featureFlags.initialize();

export default featureFlags;

// Hook for using feature flags in components
import { useState, useEffect } from 'react';

export function useFeature(featureId: string): boolean {
  const [isEnabled, setIsEnabled] = useState(false);
  
  useEffect(() => {
    // Initialize the feature flag service if needed
    featureFlags.initialize().then(() => {
      setIsEnabled(featureFlags.isEnabled(featureId));
    });
    
    // No need for cleanup as this is a synchronous check after initialization
  }, [featureId]);
  
  return isEnabled;
}
