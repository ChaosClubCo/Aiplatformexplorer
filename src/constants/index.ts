/**
 * Application Constants
 * Centralized constants for the entire application
 */

// Platform Categories
export const PLATFORM_CATEGORIES = {
  ALL: 'all',
  ENTERPRISE: 'enterprise',
  DEVELOPER: 'developer',
  RESEARCH: 'research',
  CRM: 'crm',
  SPECIALIST: 'specialist',
} as const;

export const PLATFORM_CATEGORY_LABELS: Record<string, string> = {
  [PLATFORM_CATEGORIES.ALL]: 'All Platforms',
  [PLATFORM_CATEGORIES.ENTERPRISE]: 'Enterprise Solutions',
  [PLATFORM_CATEGORIES.DEVELOPER]: 'Developer Tools',
  [PLATFORM_CATEGORIES.RESEARCH]: 'Research Models',
  [PLATFORM_CATEGORIES.CRM]: 'CRM & Sales Tools',
  [PLATFORM_CATEGORIES.SPECIALIST]: 'Specialized Tools',
};

// Provider Keys
export const PROVIDERS = {
  ALL: 'all',
  MICROSOFT: 'microsoft',
  GOOGLE: 'google',
  OPENAI: 'openai',
  ANTHROPIC: 'anthropic',
  SALESFORCE: 'salesforce',
  META: 'meta',
  AMAZON: 'amazon',
  IBM: 'ibm',
  PERPLEXITY: 'perplexity',
} as const;

// Sort Options
export const SORT_OPTIONS = {
  MARKET_SHARE_DESC: 'marketShare-desc',
  MARKET_SHARE_ASC: 'marketShare-asc',
  PRICE_ASC: 'price-asc',
  PRICE_DESC: 'price-desc',
  NAME_ASC: 'name-asc',
  NAME_DESC: 'name-desc',
  CONTEXT_WINDOW_DESC: 'contextWindow-desc',
  COMPLIANCE_DESC: 'compliance-desc',
  GROWTH_RATE_DESC: 'growthRate-desc',
  AVG_SCORE_DESC: 'avgScore-desc',
} as const;

export const SORT_OPTION_LABELS: Record<string, string> = {
  [SORT_OPTIONS.MARKET_SHARE_DESC]: 'Market Share (High to Low)',
  [SORT_OPTIONS.MARKET_SHARE_ASC]: 'Market Share (Low to High)',
  [SORT_OPTIONS.PRICE_ASC]: 'Price (Low to High)',
  [SORT_OPTIONS.PRICE_DESC]: 'Price (High to Low)',
  [SORT_OPTIONS.NAME_ASC]: 'Name (A to Z)',
  [SORT_OPTIONS.NAME_DESC]: 'Name (Z to A)',
  [SORT_OPTIONS.CONTEXT_WINDOW_DESC]: 'Context Window (Largest First)',
  [SORT_OPTIONS.COMPLIANCE_DESC]: 'Most Compliant',
  [SORT_OPTIONS.GROWTH_RATE_DESC]: 'Fastest Growing',
  [SORT_OPTIONS.AVG_SCORE_DESC]: 'Highest Rated',
};

// Navigation Tabs
export const TABS = {
  EXPLORER: 'explorer',
  MATRIX: 'matrix',
  FINANCIAL: 'financial',
  ASSESSMENT: 'assessment',
  GLOSSARY: 'glossary',
} as const;

export const TAB_LABELS: Record<string, { label: string; icon: string }> = {
  [TABS.EXPLORER]: { label: 'Platform Explorer', icon: '🔍' },
  [TABS.MATRIX]: { label: 'Feature Matrix', icon: '📊' },
  [TABS.FINANCIAL]: { label: 'ROI Calculator', icon: '💰' },
  [TABS.ASSESSMENT]: { label: 'Get Recommendation', icon: '🤖' },
  [TABS.GLOSSARY]: { label: 'Glossary', icon: '📚' },
};

// Toast Types
export const TOAST_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
} as const;

// Export Formats
export const EXPORT_FORMATS = {
  JSON: 'json',
  CSV: 'csv',
  PDF: 'pdf',
} as const;

// Recommendation Question Categories
export const QUESTION_CATEGORIES = {
  REQUIREMENTS: 'requirements',
  CONSTRAINTS: 'constraints',
  PRIORITIES: 'priorities',
} as const;

export const QUESTION_CATEGORY_LABELS: Record<string, { label: string; icon: string; color: string }> = {
  [QUESTION_CATEGORIES.REQUIREMENTS]: {
    label: 'Requirements',
    icon: '📋',
    color: '#1E40AF',
  },
  [QUESTION_CATEGORIES.CONSTRAINTS]: {
    label: 'Constraints',
    icon: '⚠️',
    color: '#92400E',
  },
  [QUESTION_CATEGORIES.PRIORITIES]: {
    label: 'Priorities',
    icon: '⭐',
    color: '#6B21A8',
  },
};

// Question Types
export const QUESTION_TYPES = {
  SINGLE: 'single',
  MULTI: 'multi',
  RANGE: 'range',
  BOOLEAN: 'boolean',
  PRIORITY: 'priority',
} as const;

// Match Score Levels
export const MATCH_LEVELS = {
  EXCELLENT: 'excellent',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;

export const MATCH_LEVEL_CONFIG = {
  [MATCH_LEVELS.EXCELLENT]: {
    label: 'Excellent Match',
    color: '#059669',
    bgColor: '#D1FAE5',
    borderColor: '#059669',
    icon: '🟢',
  },
  [MATCH_LEVELS.GOOD]: {
    label: 'Good Match',
    color: '#1E40AF',
    bgColor: '#DBEAFE',
    borderColor: '#3B82F6',
    icon: '🔵',
  },
  [MATCH_LEVELS.FAIR]: {
    label: 'Fair Match',
    color: '#92400E',
    bgColor: '#FEF3C7',
    borderColor: '#F59E0B',
    icon: '🟡',
  },
  [MATCH_LEVELS.POOR]: {
    label: 'Poor Match',
    color: '#991B1B',
    bgColor: '#FEE2E2',
    borderColor: '#DC2626',
    icon: '🔴',
  },
};

// Confidence Levels
export const CONFIDENCE_LEVELS = {
  VERY_HIGH: 'very_high',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const CONFIDENCE_LEVEL_CONFIG = {
  [CONFIDENCE_LEVELS.VERY_HIGH]: {
    label: 'Very High Confidence',
    color: '#059669',
    minScore: 90,
  },
  [CONFIDENCE_LEVELS.HIGH]: {
    label: 'High Confidence',
    color: '#10B981',
    minScore: 75,
  },
  [CONFIDENCE_LEVELS.MEDIUM]: {
    label: 'Medium Confidence',
    color: '#F59E0B',
    minScore: 60,
  },
  [CONFIDENCE_LEVELS.LOW]: {
    label: 'Low Confidence',
    color: '#EF4444',
    minScore: 0,
  },
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'ai-explorer-preferences',
  RECENT_SEARCHES: 'ai-explorer-recent-searches',
  FAVORITE_PLATFORMS: 'ai-explorer-favorites',
  RECOMMENDATION_ANSWERS: 'ai-explorer-rec-answers',
  COMPARISON_SELECTION: 'ai-explorer-comparison',
  FILTER_STATE: 'ai-explorer-filters',
} as const;

// Analytics Event Types
export const ANALYTICS_EVENTS = {
  PAGE_VIEW: 'page_view',
  TAB_CHANGE: 'tab_change',
  PLATFORM_VIEW: 'platform_view',
  PLATFORM_COMPARE: 'platform_compare',
  EXPORT_DATA: 'export_data',
  ROI_CALCULATE: 'roi_calculate',
  RECOMMENDATION_START: 'recommendation_start',
  RECOMMENDATION_COMPLETE: 'recommendation_complete',
  QUESTION_ANSWER: 'question_answer',
  QUESTION_SKIP: 'question_skip',
  FILTER_APPLY: 'filter_apply',
  SEARCH: 'search',
  ERROR: 'error',
} as const;

// Error Types
export const ERROR_TYPES = {
  VALIDATION: 'validation',
  NETWORK: 'network',
  STORAGE: 'storage',
  CALCULATION: 'calculation',
  UNKNOWN: 'unknown',
} as const;

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEXT: 'ArrowRight',
  PREVIOUS: 'ArrowLeft',
  CLOSE: 'Escape',
  SEARCH: 'KeyK',
  EXPORT: 'KeyE',
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  PLATFORMS: '/api/platforms',
  RECOMMENDATIONS: '/api/recommendations',
  ANALYTICS: '/api/analytics',
  EXPORT: '/api/export',
  FEEDBACK: '/api/feedback',
} as const;

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  NUMERIC: /^\d+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

// Animation Durations (ms)
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  TOAST: 1080,
} as const;

// File Size Limits
export const FILE_SIZE_LIMITS = {
  EXPORT_JSON: 10 * 1024 * 1024, // 10MB
  EXPORT_CSV: 5 * 1024 * 1024,   // 5MB
  EXPORT_PDF: 20 * 1024 * 1024,  // 20MB
} as const;

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM dd, yyyy',
  LONG: 'MMMM dd, yyyy',
  ISO: 'yyyy-MM-dd',
  TIMESTAMP: 'yyyy-MM-dd HH:mm:ss',
} as const;

// Compliance Certifications
export const COMPLIANCE_CERTS = {
  SOC2: 'SOC 2',
  ISO27001: 'ISO 27001',
  GDPR: 'GDPR',
  HIPAA: 'HIPAA',
  FEDRAMP: 'FedRAMP',
  PCI_DSS: 'PCI DSS',
  CCPA: 'CCPA',
} as const;

// Type exports
export type PlatformCategory = typeof PLATFORM_CATEGORIES[keyof typeof PLATFORM_CATEGORIES];
export type Provider = typeof PROVIDERS[keyof typeof PROVIDERS];
export type SortOption = typeof SORT_OPTIONS[keyof typeof SORT_OPTIONS];
export type Tab = typeof TABS[keyof typeof TABS];
export type ToastType = typeof TOAST_TYPES[keyof typeof TOAST_TYPES];
export type ExportFormat = typeof EXPORT_FORMATS[keyof typeof EXPORT_FORMATS];
export type QuestionCategory = typeof QUESTION_CATEGORIES[keyof typeof QUESTION_CATEGORIES];
export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];
export type MatchLevel = typeof MATCH_LEVELS[keyof typeof MATCH_LEVELS];
export type ConfidenceLevel = typeof CONFIDENCE_LEVELS[keyof typeof CONFIDENCE_LEVELS];
export type AnalyticsEvent = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];
export type ErrorType = typeof ERROR_TYPES[keyof typeof ERROR_TYPES];
