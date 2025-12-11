/**
 * Event Bus Pattern Implementation
 * 
 * @description Enterprise event-driven architecture with type safety
 * @pattern Observer/PubSub Pattern
 * @module core/patterns/EventBus
 */

/**
 * Event interface
 */
export interface DomainEvent<T = any> {
  readonly type: string;
  readonly payload: T;
  readonly timestamp: number;
  readonly id: string;
  readonly metadata?: Record<string, any>;
}

/**
 * Event handler function type
 */
export type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>;

/**
 * Event subscription
 */
export interface EventSubscription {
  unsubscribe: () => void;
}

/**
 * Event middleware for cross-cutting concerns
 */
export type EventMiddleware = (
  event: DomainEvent,
  next: () => void | Promise<void>
) => void | Promise<void>;

/**
 * Event Bus Configuration
 */
export interface EventBusConfig {
  enableLogging?: boolean;
  enableMetrics?: boolean;
  maxListeners?: number;
  errorHandler?: (error: Error, event: DomainEvent) => void;
}

/**
 * Event Bus Class
 * Implements event-driven architecture with middleware support
 */
export class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private wildcardListeners: Set<EventHandler> = new Set();
  private middleware: EventMiddleware[] = [];
  private eventHistory: DomainEvent[] = [];
  private maxHistorySize: number = 100;
  private config: EventBusConfig;
  
  constructor(config: EventBusConfig = {}) {
    this.config = {
      enableLogging: false,
      enableMetrics: false,
      maxListeners: 100,
      ...config,
    };
  }
  
  /**
   * Subscribe to events
   */
  on<T = any>(eventType: string, handler: EventHandler<T>): EventSubscription {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    
    const handlers = this.listeners.get(eventType)!;
    
    // Check max listeners
    if (handlers.size >= (this.config.maxListeners || 100)) {
      console.warn(`Maximum listeners (${this.config.maxListeners}) reached for event: ${eventType}`);
    }
    
    handlers.add(handler as EventHandler);
    
    if (this.config.enableLogging) {
      console.log(`[EventBus] Subscribed to: ${eventType}`);
    }
    
    return {
      unsubscribe: () => this.off(eventType, handler),
    };
  }
  
  /**
   * Subscribe to event once
   */
  once<T = any>(eventType: string, handler: EventHandler<T>): EventSubscription {
    const wrappedHandler: EventHandler<T> = async (event) => {
      await handler(event);
      this.off(eventType, wrappedHandler);
    };
    
    return this.on(eventType, wrappedHandler);
  }
  
  /**
   * Unsubscribe from events
   */
  off<T = any>(eventType: string, handler: EventHandler<T>): void {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.delete(handler as EventHandler);
      
      if (handlers.size === 0) {
        this.listeners.delete(eventType);
      }
      
      if (this.config.enableLogging) {
        console.log(`[EventBus] Unsubscribed from: ${eventType}`);
      }
    }
  }
  
  /**
   * Subscribe to all events (wildcard)
   */
  onAny(handler: EventHandler): EventSubscription {
    this.wildcardListeners.add(handler);
    
    return {
      unsubscribe: () => this.wildcardListeners.delete(handler),
    };
  }
  
  /**
   * Emit event
   */
  async emit<T = any>(eventType: string, payload: T, metadata?: Record<string, any>): Promise<void> {
    const event: DomainEvent<T> = {
      type: eventType,
      payload,
      timestamp: Date.now(),
      id: this.generateEventId(),
      metadata,
    };
    
    // Add to history
    this.addToHistory(event);
    
    // Log event
    if (this.config.enableLogging) {
      console.log(`[EventBus] Emitting: ${eventType}`, payload);
    }
    
    // Execute middleware chain
    await this.executeMiddleware(event, async () => {
      // Notify specific listeners
      const handlers = this.listeners.get(eventType);
      if (handlers) {
        await this.notifyHandlers(Array.from(handlers), event);
      }
      
      // Notify wildcard listeners
      if (this.wildcardListeners.size > 0) {
        await this.notifyHandlers(Array.from(this.wildcardListeners), event);
      }
    });
  }
  
  /**
   * Emit multiple events
   */
  async emitBatch(events: Array<{ type: string; payload: any; metadata?: Record<string, any> }>): Promise<void> {
    for (const event of events) {
      await this.emit(event.type, event.payload, event.metadata);
    }
  }
  
  /**
   * Add middleware
   */
  use(middleware: EventMiddleware): void {
    this.middleware.push(middleware);
  }
  
  /**
   * Remove middleware
   */
  removeMiddleware(middleware: EventMiddleware): void {
    const index = this.middleware.indexOf(middleware);
    if (index > -1) {
      this.middleware.splice(index, 1);
    }
  }
  
  /**
   * Clear all listeners
   */
  clear(eventType?: string): void {
    if (eventType) {
      this.listeners.delete(eventType);
    } else {
      this.listeners.clear();
      this.wildcardListeners.clear();
    }
  }
  
  /**
   * Get event history
   */
  getHistory(eventType?: string, limit?: number): DomainEvent[] {
    let history = eventType
      ? this.eventHistory.filter(e => e.type === eventType)
      : this.eventHistory;
    
    if (limit) {
      history = history.slice(-limit);
    }
    
    return history;
  }
  
  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventHistory = [];
  }
  
  /**
   * Get listener count
   */
  listenerCount(eventType?: string): number {
    if (eventType) {
      return this.listeners.get(eventType)?.size || 0;
    }
    
    let total = this.wildcardListeners.size;
    for (const handlers of this.listeners.values()) {
      total += handlers.size;
    }
    return total;
  }
  
  /**
   * Get all event types
   */
  getEventTypes(): string[] {
    return Array.from(this.listeners.keys());
  }
  
  /**
   * Execute middleware chain
   */
  private async executeMiddleware(event: DomainEvent, finalHandler: () => Promise<void>): Promise<void> {
    let index = 0;
    
    const next = async (): Promise<void> => {
      if (index < this.middleware.length) {
        const middleware = this.middleware[index++];
        await middleware(event, next);
      } else {
        await finalHandler();
      }
    };
    
    await next();
  }
  
  /**
   * Notify handlers
   */
  private async notifyHandlers(handlers: EventHandler[], event: DomainEvent): Promise<void> {
    const promises = handlers.map(async (handler) => {
      try {
        await handler(event);
      } catch (error) {
        if (this.config.errorHandler) {
          this.config.errorHandler(error as Error, event);
        } else {
          console.error(`[EventBus] Error handling event: ${event.type}`, error);
        }
      }
    });
    
    await Promise.all(promises);
  }
  
  /**
   * Add event to history
   */
  private addToHistory(event: DomainEvent): void {
    this.eventHistory.push(event);
    
    // Trim history if needed
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
    }
  }
  
  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Global event bus instance
 */
export const globalEventBus = new EventBus({
  enableLogging: process.env.NODE_ENV === 'development',
  enableMetrics: true,
  maxListeners: 200,
  errorHandler: (error, event) => {
    console.error(`[EventBus] Error in event ${event.type}:`, error);
    console.error('[EventBus] Event payload:', event.payload);
    console.error('[EventBus] Full event:', event);
  },
});

/**
 * Domain Events - Type-safe event definitions
 */
export const DomainEvents = {
  // Platform events
  PLATFORM_SELECTED: 'platform.selected',
  PLATFORM_DESELECTED: 'platform.deselected',
  PLATFORM_COMPARED: 'platform.compared',
  PLATFORMS_LOADED: 'platforms.loaded',
  PLATFORMS_FILTERED: 'platforms.filtered',
  
  // Filter events
  FILTERS_CHANGED: 'filters.changed',
  FILTERS_RESET: 'filters.reset',
  SEARCH_PERFORMED: 'search.performed',
  
  // Navigation events
  ROUTE_CHANGED: 'route.changed',
  TAB_CHANGED: 'tab.changed',
  
  // ROI events
  ROI_CALCULATED: 'roi.calculated',
  ROI_EXPORTED: 'roi.exported',
  
  // Recommendation events
  RECOMMENDATION_STARTED: 'recommendation.started',
  RECOMMENDATION_COMPLETED: 'recommendation.completed',
  RECOMMENDATION_FAILED: 'recommendation.failed',
  RECOMMENDATION_GENERATED: 'recommendation.generated',
  
  // Comparison events
  COMPARISON_STARTED: 'comparison.started',
  COMPARISON_GENERATED: 'comparison.generated',
  COMPARISON_FAILED: 'comparison.failed',
  
  // Export events
  EXPORT_STARTED: 'export.started',
  EXPORT_COMPLETED: 'export.completed',
  EXPORT_FAILED: 'export.failed',
  DATA_EXPORTED: 'data.exported',
  
  // Analytics events
  PAGE_VIEW: 'analytics.pageView',
  USER_ACTION: 'analytics.userAction',
  ERROR_OCCURRED: 'analytics.error',
  
  // Notion events
  NOTION_SYNC_STARTED: 'notion.syncStarted',
  NOTION_SYNC_COMPLETED: 'notion.syncCompleted',
  NOTION_SYNC_FAILED: 'notion.syncFailed',
  
  // System events
  APP_INITIALIZED: 'system.initialized',
  APP_ERROR: 'system.error',
  CACHE_CLEARED: 'system.cacheCleared',
} as const;

/**
 * Event payload types
 */
export interface PlatformSelectedPayload {
  platformId: string;
  platformName: string;
  source: string;
}

export interface FiltersChangedPayload {
  filters: Record<string, any>;
  previousFilters: Record<string, any>;
}

export interface ROICalculatedPayload {
  inputs: Record<string, any>;
  results: Record<string, any>;
}

export interface ErrorOccurredPayload {
  error: Error;
  context: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

/**
 * Typed event emitter helpers
 */
export const emit = {
  platformSelected: (payload: PlatformSelectedPayload) =>
    globalEventBus.emit(DomainEvents.PLATFORM_SELECTED, payload),
  
  filtersChanged: (payload: FiltersChangedPayload) =>
    globalEventBus.emit(DomainEvents.FILTERS_CHANGED, payload),
  
  roiCalculated: (payload: ROICalculatedPayload) =>
    globalEventBus.emit(DomainEvents.ROI_CALCULATED, payload),
  
  errorOccurred: (payload: ErrorOccurredPayload) =>
    globalEventBus.emit(DomainEvents.ERROR_OCCURRED, payload),
};

/**
 * Event bus middleware examples
 */

// Logging middleware
export const loggingMiddleware: EventMiddleware = async (event, next) => {
  console.log(`[Event] ${event.type}`, event.payload);
  await next();
};

// Metrics middleware
export const metricsMiddleware: EventMiddleware = async (event, next) => {
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`[Metrics] ${event.type} took ${duration.toFixed(2)}ms`);
};

// Error tracking middleware
export const errorTrackingMiddleware: EventMiddleware = async (event, next) => {
  try {
    await next();
  } catch (error) {
    console.error(`[EventBus] Error processing ${event.type}:`, error);
    // Send to error tracking service
    throw error;
  }
};