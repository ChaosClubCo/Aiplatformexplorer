/**
 * Feature Flag Manager
 * 
 * @description Dynamic feature toggling and A/B testing infrastructure
 * @module core/features/FeatureFlagManager
 */

/**
 * Feature Flag Configuration
 */
export interface FeatureFlag {
  key: string;
  enabled: boolean;
  description?: string;
  rolloutPercentage?: number; // 0-100
  variants?: Record<string, any>;
  conditions?: FeatureCondition[];
  metadata?: Record<string, any>;
}

/**
 * Feature Condition
 */
export interface FeatureCondition {
  type: 'user' | 'environment' | 'date' | 'custom';
  operator: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'in';
  value: any;
  field?: string;
}

/**
 * Feature Context
 */
export interface FeatureContext {
  userId?: string;
  environment?: 'development' | 'staging' | 'production';
  userProperties?: Record<string, any>;
  customProperties?: Record<string, any>;
}

/**
 * Feature Flag Manager
 */
export class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  private context: FeatureContext = {};
  private subscribers: Map<string, Set<(enabled: boolean) => void>> = new Map();
  private static instance: FeatureFlagManager;
  
  private constructor() {
    this.initializeDefaultFlags();
  }
  
  /**
   * Get singleton instance
   */
  static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }
  
  /**
   * Initialize default flags
   */
  private initializeDefaultFlags(): void {
    const defaultFlags: FeatureFlag[] = [
      {
        key: 'platform-comparison',
        enabled: true,
        description: 'Enable platform comparison feature',
      },
      {
        key: 'roi-calculator',
        enabled: true,
        description: 'Enable ROI calculator',
      },
      {
        key: 'recommendation-engine',
        enabled: true,
        description: 'Enable AI recommendation engine',
      },
      {
        key: 'notion-integration',
        enabled: true,
        description: 'Enable Notion integration',
      },
      {
        key: 'project-management',
        enabled: true,
        description: 'Enable project management features',
      },
      {
        key: 'analytics-dashboard',
        enabled: true,
        description: 'Enable analytics dashboard',
      },
      {
        key: 'persona-generator',
        enabled: true,
        description: 'Enable persona generator tool',
      },
      {
        key: 'advanced-filters',
        enabled: true,
        description: 'Enable advanced filtering options',
      },
      {
        key: 'export-features',
        enabled: true,
        description: 'Enable data export features',
      },
      {
        key: 'dark-mode',
        enabled: false,
        description: 'Enable dark mode',
        rolloutPercentage: 50,
      },
      {
        key: 'beta-features',
        enabled: false,
        description: 'Enable beta features',
        conditions: [
          {
            type: 'environment',
            operator: 'equals',
            value: 'development',
          },
        ],
      },
    ];
    
    defaultFlags.forEach(flag => this.flags.set(flag.key, flag));
  }
  
  /**
   * Set context for feature evaluation
   */
  setContext(context: FeatureContext): void {
    this.context = { ...this.context, ...context };
  }
  
  /**
   * Register feature flag
   */
  register(flag: FeatureFlag): void {
    this.flags.set(flag.key, flag);
    this.notifySubscribers(flag.key, this.isEnabled(flag.key));
  }
  
  /**
   * Check if feature is enabled
   */
  isEnabled(key: string, context?: FeatureContext): boolean {
    const flag = this.flags.get(key);
    
    if (!flag) {
      console.warn(`Feature flag "${key}" not found. Defaulting to false.`);
      return false;
    }
    
    // Base enabled check
    if (!flag.enabled) {
      return false;
    }
    
    // Check conditions
    const evalContext = { ...this.context, ...context };
    if (flag.conditions && !this.evaluateConditions(flag.conditions, evalContext)) {
      return false;
    }
    
    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined && flag.rolloutPercentage < 100) {
      return this.isInRollout(key, flag.rolloutPercentage, evalContext);
    }
    
    return true;
  }
  
  /**
   * Get feature variant
   */
  getVariant(key: string, defaultVariant: string = 'control'): string {
    const flag = this.flags.get(key);
    
    if (!flag || !flag.variants) {
      return defaultVariant;
    }
    
    if (!this.isEnabled(key)) {
      return defaultVariant;
    }
    
    // Simple variant selection based on user ID
    if (this.context.userId) {
      const variantKeys = Object.keys(flag.variants);
      const index = this.hashUserId(this.context.userId) % variantKeys.length;
      return variantKeys[index];
    }
    
    return defaultVariant;
  }
  
  /**
   * Enable feature
   */
  enable(key: string): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = true;
      this.notifySubscribers(key, true);
    }
  }
  
  /**
   * Disable feature
   */
  disable(key: string): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = false;
      this.notifySubscribers(key, false);
    }
  }
  
  /**
   * Toggle feature
   */
  toggle(key: string): void {
    const flag = this.flags.get(key);
    if (flag) {
      flag.enabled = !flag.enabled;
      this.notifySubscribers(key, flag.enabled);
    }
  }
  
  /**
   * Subscribe to feature changes
   */
  subscribe(key: string, callback: (enabled: boolean) => void): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    
    this.subscribers.get(key)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) {
        subs.delete(callback);
      }
    };
  }
  
  /**
   * Get all flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
  
  /**
   * Get enabled flags
   */
  getEnabledFlags(): FeatureFlag[] {
    return this.getAllFlags().filter(flag => this.isEnabled(flag.key));
  }
  
  /**
   * Export flags configuration
   */
  export(): Record<string, boolean> {
    const config: Record<string, boolean> = {};
    
    this.flags.forEach((flag, key) => {
      config[key] = this.isEnabled(key);
    });
    
    return config;
  }
  
  /**
   * Import flags configuration
   */
  import(config: Record<string, boolean>): void {
    Object.entries(config).forEach(([key, enabled]) => {
      const flag = this.flags.get(key);
      if (flag) {
        flag.enabled = enabled;
      }
    });
  }
  
  /**
   * Evaluate conditions
   */
  private evaluateConditions(conditions: FeatureCondition[], context: FeatureContext): boolean {
    return conditions.every(condition => this.evaluateCondition(condition, context));
  }
  
  /**
   * Evaluate single condition
   */
  private evaluateCondition(condition: FeatureCondition, context: FeatureContext): boolean {
    let contextValue: any;
    
    switch (condition.type) {
      case 'user':
        contextValue = context.userId;
        break;
      case 'environment':
        contextValue = context.environment || 'development';
        break;
      case 'custom':
        contextValue = condition.field ? context.customProperties?.[condition.field] : null;
        break;
      default:
        return true;
    }
    
    switch (condition.operator) {
      case 'equals':
        return contextValue === condition.value;
      case 'contains':
        return contextValue?.includes(condition.value);
      case 'greaterThan':
        return contextValue > condition.value;
      case 'lessThan':
        return contextValue < condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(contextValue);
      default:
        return true;
    }
  }
  
  /**
   * Check if user is in rollout percentage
   */
  private isInRollout(key: string, percentage: number, context: FeatureContext): boolean {
    const userId = context.userId || 'anonymous';
    const hash = this.hashString(`${key}:${userId}`);
    const bucket = hash % 100;
    
    return bucket < percentage;
  }
  
  /**
   * Hash string to number
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
  
  /**
   * Hash user ID to number
   */
  private hashUserId(userId: string): number {
    return this.hashString(userId);
  }
  
  /**
   * Notify subscribers
   */
  private notifySubscribers(key: string, enabled: boolean): void {
    const subscribers = this.subscribers.get(key);
    if (subscribers) {
      subscribers.forEach(callback => callback(enabled));
    }
  }
  
  /**
   * Clear all flags
   */
  clear(): void {
    this.flags.clear();
    this.subscribers.clear();
  }
  
  /**
   * Reset to defaults
   */
  reset(): void {
    this.clear();
    this.initializeDefaultFlags();
  }
}

/**
 * Global feature flag instance
 */
export const featureFlags = FeatureFlagManager.getInstance();

/**
 * React Hook for feature flags (type definition)
 */
export const useFeatureFlag = (key: string): boolean => {
  return featureFlags.isEnabled(key);
};

/**
 * Feature Flag HOC (type definition)
 */
export function withFeatureFlag(key: string, fallback?: React.ComponentType) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return (props: P) => {
      const enabled = useFeatureFlag(key);
      
      if (!enabled) {
        return fallback ? React.createElement(fallback, props) : null;
      }
      
      return React.createElement(Component, props);
    };
  };
}

/**
 * Predefined feature keys (type-safe access)
 */
export const Features = {
  PLATFORM_COMPARISON: 'platform-comparison',
  ROI_CALCULATOR: 'roi-calculator',
  RECOMMENDATION_ENGINE: 'recommendation-engine',
  NOTION_INTEGRATION: 'notion-integration',
  PROJECT_MANAGEMENT: 'project-management',
  ANALYTICS_DASHBOARD: 'analytics-dashboard',
  PERSONA_GENERATOR: 'persona-generator',
  ADVANCED_FILTERS: 'advanced-filters',
  EXPORT_FEATURES: 'export-features',
  DARK_MODE: 'dark-mode',
  BETA_FEATURES: 'beta-features',
} as const;
