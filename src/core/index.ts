/**
 * Core Module - Production-Grade Infrastructure
 * 
 * @description Enterprise patterns, performance, resilience, security, and testing
 * @version 4.0.0
 * @module core
 */

// ============================================================================
// PATTERNS - Enterprise Design Patterns
// ============================================================================

// Repository Pattern
export {
  IRepository,
  ICacheStrategy,
  QueryOptions,
  PaginatedResult,
  BaseRepository,
  InMemoryRepository,
} from './patterns/Repository';

// Event Bus Pattern
export {
  DomainEvent,
  EventHandler,
  EventSubscription,
  EventMiddleware,
  EventBusConfig,
  EventBus,
  globalEventBus,
  DomainEvents,
  emit,
  loggingMiddleware,
  metricsMiddleware,
  errorTrackingMiddleware,
  type PlatformSelectedPayload,
  type FiltersChangedPayload,
  type ROICalculatedPayload,
  type ErrorOccurredPayload,
} from './patterns/EventBus';

// Factory Patterns
export {
  IFactory,
  IAbstractFactory,
  FactoryRegistry,
  Builder,
  ObjectPool,
  LazyFactory,
  Singleton,
  ICloneable,
  CloneFactory,
  DIContainer,
  PlatformFactory,
  TestDataFactory,
} from './patterns/Factory';

// ============================================================================
// PERFORMANCE - Optimization & Caching
// ============================================================================

export {
  CacheManager,
  CacheStats,
  CacheStrategy,
  CacheConfig,
  globalCache,
  sessionCache,
  persistentCache,
} from './performance/CacheManager';

// ============================================================================
// RESILIENCE - Fault Tolerance & Error Handling
// ============================================================================

export {
  CircuitBreaker,
  CircuitState,
  CircuitBreakerConfig,
  CircuitBreakerStats,
  RateLimiter,
  RetryStrategy,
  RetryConfig,
  Bulkhead,
} from './resilience/CircuitBreaker';

// ============================================================================
// MONITORING - Performance & Observability
// ============================================================================

export {
  PerformanceMonitor,
  PerformanceMetric,
  WebVitals,
  PerformanceBudget,
  PerformanceReport,
  performanceMonitor,
  measurePerformance,
} from './monitoring/PerformanceMonitor';

// ============================================================================
// SECURITY - Protection & Compliance
// ============================================================================

export {
  SecurityManager,
  XSSProtection,
  InputValidator,
  CSRFProtection,
  CSPHelper,
  EncryptionUtils,
  SecurityRateLimiter,
  SecureStorage,
  AuditLogger,
} from './security/SecurityManager';

// ============================================================================
// TESTING - Test Utilities & Factories
// ============================================================================

export {
  MockDataGenerator,
  TestFixtures,
  MockServices,
  TestHelpers,
  AssertHelpers,
  PerformanceTester,
  IntegrationTestHelpers,
  TestUtils,
} from './testing/TestFactory';

// ============================================================================
// FEATURES - Feature Flags & A/B Testing
// ============================================================================

export {
  FeatureFlagManager,
  FeatureFlag,
  FeatureCondition,
  FeatureContext,
  featureFlags,
  useFeatureFlag,
  withFeatureFlag,
  Features,
} from './features/FeatureFlagManager';

// ============================================================================
// UTILITIES - Helper Functions
// ============================================================================

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize function
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = func(...args);
    cache.set(key, result);
    
    return result;
  }) as T;
}

/**
 * Deep freeze object
 */
export function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.freeze(obj);
  
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  
  return obj;
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

/**
 * Safe JSON parse
 */
export function safeJSONParse<T = any>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

/**
 * Generate unique ID
 */
export function generateId(prefix: string = ''): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return prefix ? `${prefix}_${timestamp}_${randomStr}` : `${timestamp}_${randomStr}`;
}

/**
 * Check if value is plain object
 */
export function isPlainObject(value: any): value is object {
  return value !== null && typeof value === 'object' && value.constructor === Object;
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends object>(...objects: Partial<T>[]): T {
  const result: any = {};
  
  for (const obj of objects) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        
        if (isPlainObject(value) && isPlainObject(result[key])) {
          result[key] = deepMerge(result[key], value);
        } else {
          result[key] = value;
        }
      }
    }
  }
  
  return result as T;
}

/**
 * Chunk array
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  
  return chunks;
}

/**
 * Group by property
 */
export function groupBy<T, K extends keyof T>(
  array: T[],
  key: K
): Map<T[K], T[]> {
  return array.reduce((acc, item) => {
    const group = item[key];
    const items = acc.get(group) || [];
    items.push(item);
    acc.set(group, items);
    return acc;
  }, new Map<T[K], T[]>());
}

/**
 * Sleep/delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format bytes
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Clamp number
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Random number in range
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Is browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Get browser info
 */
export function getBrowserInfo(): {
  name: string;
  version: string;
  userAgent: string;
} | null {
  if (!isBrowser()) return null;
  
  const ua = navigator.userAgent;
  let name = 'Unknown';
  let version = 'Unknown';
  
  // Detect browser
  if (ua.indexOf('Chrome') > -1) name = 'Chrome';
  else if (ua.indexOf('Safari') > -1) name = 'Safari';
  else if (ua.indexOf('Firefox') > -1) name = 'Firefox';
  else if (ua.indexOf('Edge') > -1) name = 'Edge';
  
  return { name, version, userAgent: ua };
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const CONSTANTS = {
  // Performance budgets
  PERFORMANCE: {
    MAX_BUNDLE_SIZE: 200 * 1024, // 200 KB
    MAX_ROUTE_LOAD_TIME: 3000, // 3 seconds
    TARGET_LIGHTHOUSE_SCORE: 90,
    MAX_LCP: 2500, // ms
    MAX_FID: 100, // ms
    MAX_CLS: 0.1,
  },
  
  // Cache TTLs
  CACHE: {
    SHORT: 60000, // 1 minute
    MEDIUM: 300000, // 5 minutes
    LONG: 3600000, // 1 hour
    DAY: 86400000, // 24 hours
  },
  
  // Rate limits
  RATE_LIMITS: {
    API_CALLS_PER_MINUTE: 60,
    SEARCH_DEBOUNCE_MS: 300,
    SCROLL_THROTTLE_MS: 100,
  },
  
  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 30000,
    BACKOFF_MULTIPLIER: 2,
  },
} as const;

// ============================================================================
// TYPES
// ============================================================================

export type AsyncResult<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

// ============================================================================
// VERSION INFO
// ============================================================================

export const CORE_VERSION = '4.0.0';
export const CORE_BUILD_DATE = new Date('2024-12-11');

/**
 * Core module health check
 */
export function healthCheck(): {
  version: string;
  buildDate: Date;
  features: Record<string, boolean>;
} {
  return {
    version: CORE_VERSION,
    buildDate: CORE_BUILD_DATE,
    features: {
      patterns: true,
      performance: true,
      resilience: true,
      monitoring: true,
      security: true,
      testing: true,
      featureFlags: true,
    },
  };
}
