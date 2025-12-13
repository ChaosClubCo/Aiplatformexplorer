import { toast } from 'sonner';

/**
 * CORE ARCHITECTURE
 * 
 * Defines the fundamental building blocks for the Enterprise Application.
 * Follows "Clean Architecture" principles.
 */

// --- 1. Event Bus (Decoupled Communication) ---

export interface EventEnvelope<T = any> {
  type: string;
  payload: T;
  timestamp: number;
}

type EventCallback<T = any> = (event: EventEnvelope<T>) => void;

class EventBus {
  private listeners: Record<string, EventCallback[]> = {};

  subscribe<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  // Alias for legacy compatibility, returns object with unsubscribe
  on<T>(event: string, callback: EventCallback<T>) {
    const unsubscribe = this.subscribe(event, callback);
    return { unsubscribe };
  }

  emit<T>(event: string, payload: T): void {
    if (this.listeners[event]) {
      const envelope: EventEnvelope<T> = {
        type: event,
        payload,
        timestamp: Date.now(),
      };
      this.listeners[event].forEach(cb => cb(envelope));
    }
    // Log all events in dev
    if (process.env.NODE_ENV === 'development') {
      console.groupCollapsed(`[EventBus] ${event}`);
      console.log('Payload:', payload);
      console.groupEnd();
    }
  }
}

export const globalEventBus = new EventBus();

export enum DomainEvents {
  APP_INITIALIZED = 'app:initialized',
  APP_ERROR = 'app:error',
  ERROR_OCCURRED = 'error:occurred',
  SCENARIO_SAVED = 'scenario:saved',
  USER_LOGGED_IN = 'user:logged_in',
  FEATURE_TOGGLED = 'feature:toggled',
  
  // Feature Events
  PLATFORM_SELECTED = 'platform:selected',
  COMPARISON_GENERATED = 'comparison:generated',
  RECOMMENDATION_GENERATED = 'recommendation:generated',
  DATA_EXPORTED = 'data:exported',
  ROI_CALCULATED = 'roi:calculated',
}

// --- 2. Base Service (Standardized Service Pattern) ---
export abstract class BaseService {
  protected log(message: string, data?: any) {
    console.log(`[${this.constructor.name}] ${message}`, data || '');
  }

  protected handleError(error: unknown, context: string): never {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    this.log(`Error in ${context}:`, msg);
    toast.error(`System Error: ${msg}`);
    globalEventBus.emit(DomainEvents.ERROR_OCCURRED, { source: this.constructor.name, error: msg });
    throw error;
  }
}

// --- 3. Feature Flag System (Enterprise Requirement) ---
class FeatureFlags {
  private flags: Record<string, boolean> = {
    'beta-features': false,
    'new-navigation': true,
    'dark-mode': false,
  };
  private context: Record<string, any> = {};

  isEnabled(feature: string): boolean {
    return this.flags[feature] ?? false;
  }

  setContext(context: Record<string, any>) {
    this.context = context;
    console.log('[FeatureFlags] Context set:', context);
  }

  enable(feature: string) {
    this.flags[feature] = true;
    globalEventBus.emit(DomainEvents.FEATURE_TOGGLED, { feature, enabled: true });
  }

  disable(feature: string) {
    this.flags[feature] = false;
    globalEventBus.emit(DomainEvents.FEATURE_TOGGLED, { feature, enabled: false });
  }
}

export const featureFlags = new FeatureFlags();

// --- 4. Performance Monitor (Observability) ---
class PerformanceMonitor {
  private marks: Record<string, number> = {};
  private measures: Record<string, number> = {};

  mark(name: string) {
    this.marks[name] = performance.now();
  }

  measure(name: string, startMark: string, endMark: string) {
    const start = this.marks[startMark];
    const end = this.marks[endMark];
    if (start && end) {
      const duration = end - start;
      this.measures[name] = duration;
      console.log(`[Perf] ${name}: ${duration.toFixed(2)}ms`);
      if (duration > 100) {
        console.warn(`[Perf] Slow Operation Detected: ${name}`);
      }
    }
  }

  generateReport() {
    return {
      score: 100, // Mock score
      violations: [],
      webVitals: this.measures,
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// --- 5. Security Manager (Enterprise Security) ---
class SecurityManagerClass {
  public audit = {
    log: (event: string, actor: string, data: any, severity: 'info' | 'warning' | 'critical') => {
      console.log(`[Security Audit] [${severity.toUpperCase()}] ${event} by ${actor}`, data);
      // In a real app, this would send to a secure logging endpoint
    }
  };

  init() {
    console.log('[SecurityManager] Initialized secure context');
    // Set up security headers meta tags if needed, or init auth state
  }
}

export const SecurityManager = new SecurityManagerClass();
