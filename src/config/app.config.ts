/**
 * Application Configuration
 * Centralized configuration management for the entire application
 */

export const APP_CONFIG = {
  // Application Metadata
  app: {
    name: 'AI Platform Explorer',
    version: '3.2.0',
    environment: (typeof process !== 'undefined' && process.env.NODE_ENV) || 'development',
    buildDate: new Date().toISOString(),
  },

  // Feature Flags
  features: {
    recommendationEngine: true,
    roiCalculator: true,
    featureMatrix: true,
    platformComparison: true,
    exportFunctionality: true,
    analytics: true,
    errorReporting: true,
    
    // Beta Features
    pdfExport: false,
    shareableLinks: false,
    answerPersistence: false,
    teamCollaboration: false,
    aiChatAssistant: false,
  },

  // UI Configuration
  ui: {
    maxPlatformsToCompare: 4,
    defaultView: 'cards' as 'cards' | 'table',
    itemsPerPage: 20,
    animationDuration: 300,
    toastDuration: 4000,
    debounceDelay: 300,
  },

  // Recommendation Engine
  recommendation: {
    totalQuestions: 11,
    minimumQuestionsForHighConfidence: 9,
    minimumQuestionsForMediumConfidence: 5,
    scoreWeights: {
      requirements: 0.4,
      constraints: 0.4,
      priorities: 0.2,
    },
    confidenceThresholds: {
      high: 85,
      medium: 70,
      low: 50,
    },
    matchScoreThresholds: {
      excellent: 90,
      good: 75,
      fair: 60,
      poor: 0,
    },
  },

  // Export Configuration
  export: {
    formats: ['json', 'csv'] as const,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    defaultFileName: 'ai-platforms-export',
  },

  // Analytics Configuration
  analytics: {
    enabled: true,
    trackPageViews: true,
    trackEvents: true,
    trackErrors: true,
    samplingRate: 1.0, // 100% of events
  },

  // API Configuration (for future use)
  api: {
    baseUrl: '/api',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000,
  },

  // Storage Configuration
  storage: {
    prefix: 'ai-platform-explorer',
    version: 1,
    keys: {
      userPreferences: 'preferences',
      recentSearches: 'recent-searches',
      favoriteplatforms: 'favorites',
      recommendationAnswers: 'recommendation-answers',
    },
  },

  // Validation Rules
  validation: {
    search: {
      minLength: 1,
      maxLength: 100,
    },
    teamSize: {
      min: 1,
      max: 10000,
    },
    budget: {
      min: 0,
      max: 100,
    },
  },

  // URLs
  urls: {
    documentation: '/docs',
    support: 'mailto:support@intinc.com',
    feedback: '/feedback',
    termsOfService: '/terms',
    privacyPolicy: '/privacy',
  },
} as const;

// Type exports for better TypeScript support
export type AppConfig = typeof APP_CONFIG;
export type FeatureFlags = typeof APP_CONFIG.features;
export type UIConfig = typeof APP_CONFIG.ui;
export type RecommendationConfig = typeof APP_CONFIG.recommendation;

// Helper function to check if a feature is enabled
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return APP_CONFIG.features[feature] === true;
}

// Helper function to get config value
export function getConfig<K extends keyof AppConfig>(key: K): AppConfig[K] {
  return APP_CONFIG[key];
}

// Environment-specific overrides
export function getEnvironmentConfig(): Partial<AppConfig> {
  const env = APP_CONFIG.app.environment;
  
  switch (env) {
    case 'production':
      return {
        analytics: {
          ...APP_CONFIG.analytics,
          enabled: true,
        },
      };
    
    case 'development':
      return {
        analytics: {
          ...APP_CONFIG.analytics,
          enabled: false,
        },
      };
    
    case 'test':
      return {
        analytics: {
          ...APP_CONFIG.analytics,
          enabled: false,
        },
        features: {
          ...APP_CONFIG.features,
          analytics: false,
          errorReporting: false,
        },
      };
    
    default:
      return {};
  }
}
