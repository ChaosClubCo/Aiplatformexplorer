import { toast } from 'sonner';

/**
 * CORE ARCHITECTURE - KERNEL
 * 
 * Includes:
 * 1. Event Bus (Pub/Sub)
 * 2. Base Service (Abstract)
 * 3. Feature Flags
 * 4. Performance Monitoring
 * 5. Security Manager
 * 6. Resilience (Circuit Breaker)
 */

// --- 1. Event Bus (Decoupled Communication) ---

export interface EventEnvelope<T = any> {
  type: string;
  payload: T;
  timestamp: number;
  source?: string;
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

  on<T>(event: string, callback: EventCallback<T>) {
    const unsubscribe = this.subscribe(event, callback);
    return { unsubscribe };
  }

  emit<T>(event: string, payload: T, source: string = 'system'): void {
    if (this.listeners[event]) {
      const envelope: EventEnvelope<T> = {
        type: event,
        payload,
        timestamp: Date.now(),
        source
      };
      this.listeners[event].forEach(cb => cb(envelope));
    }
    
    // Telemetry logging
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[EventBus] ${event}`, payload);
    }
  }
}

export const globalEventBus = new EventBus();

export enum DomainEvents {
  APP_INITIALIZED = 'app:initialized',
  APP_ERROR = 'app:error',
  ERROR_OCCURRED = 'error:occurred', // Added missing event
  
  // Business Events
  PLATFORM_SELECTED = 'platform:selected',
  RECOMMENDATION_GENERATED = 'recommendation:generated',
  ROI_CALCULATED = 'roi:calculated',
  SCENARIO_LOADED = 'scenario:loaded'
}

// --- 2. Resilience: Circuit Breaker Pattern ---

enum CircuitState {
  CLOSED,   // Normal operation
  OPEN,     // Failing, reject requests immediately
  HALF_OPEN // Testing if service recovered
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private readonly threshold = 3;
  private readonly resetTimeout = 5000; // 5 seconds

  public async execute<T>(fn: () => Promise<T>, fallback?: T): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        console.warn('[CircuitBreaker] Circuit OPEN. Returning fallback.');
        if (fallback !== undefined) return fallback;
        throw new Error('Service Unavailable (Circuit Open)');
      }
    }

    try {
      const result = await fn();
      if (this.state === CircuitState.HALF_OPEN) {
        this.reset();
      }
      return result;
    } catch (error) {
      this.recordFailure();
      if (fallback !== undefined) return fallback;
      throw error;
    }
  }

  private recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = CircuitState.OPEN;
      console.error('[CircuitBreaker] Threshold reached. Circuit OPENED.');
    }
  }

  private reset() {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    console.log('[CircuitBreaker] Circuit recovered. CLOSED.');
  }
}

// --- 3. Base Service (Standardized Service Pattern) ---
export abstract class BaseService {
  protected circuitBreaker: CircuitBreaker;

  constructor() {
    this.circuitBreaker = new CircuitBreaker();
  }

  protected log(message: string, data?: any) {
    console.log(`[${this.constructor.name}] ${message}`, data || '');
  }

  protected handleError(error: unknown, context: string): never {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${this.constructor.name}] Error in ${context}:`, msg);
    
    globalEventBus.emit(DomainEvents.APP_ERROR, { 
      source: this.constructor.name, 
      context, 
      error: msg 
    });
    
    toast.error(`System Error: ${msg}`);
    throw error;
  }
}

// --- 4. Performance Monitor (Observability) ---
class PerformanceMonitor {
  private marks: Record<string, number> = {};

  mark(name: string) {
    this.marks[name] = performance.now();
  }

  measure(name: string, startMark: string, endMark: string) {
    const start = this.marks[startMark];
    const end = this.marks[endMark];
    if (start && end) {
      const duration = end - start;
      console.log(`[Perf] ${name}: ${duration.toFixed(2)}ms`);
      // Could push to analytics service here
    }
  }

  // Added generateReport to match App.tsx usage
  generateReport() {
    return {
      score: 100, // Placeholder
      violations: [],
      webVitals: {}
    };
  }
}

export const performanceMonitor = new PerformanceMonitor();

// --- 5. Security Manager ---
class SecurityManagerClass {
  // Added audit property to match App.tsx usage
  public audit = {
    log: (event: string, source: string, data: any, severity: string) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Audit] [${severity.toUpperCase()}] ${event} from ${source}:`, data);
      }
    }
  };

  init() {
    console.log('[SecurityManager] Initialized');
  }

  validateAccess(role: string, requiredRole: string): boolean {
    const roles = ['viewer', 'editor', 'admin'];
    return roles.indexOf(role) >= roles.indexOf(requiredRole);
  }
}

export const SecurityManager = new SecurityManagerClass();

// --- 6. Feature Flags (Restored) ---
class FeatureFlags {
  private context: Record<string, any> = {};

  setContext(context: Record<string, any>) {
    this.context = { ...this.context, ...context };
  }

  isEnabled(feature: string): boolean {
    // Simple logic: everything enabled in dev by default, or check env vars
    return true; 
  }
}

export const featureFlags = new FeatureFlags();
