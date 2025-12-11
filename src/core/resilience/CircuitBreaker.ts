/**
 * Circuit Breaker Pattern
 * 
 * @description Fault tolerance and resilience pattern for external dependencies
 * @pattern Circuit Breaker
 * @module core/resilience/CircuitBreaker
 */

/**
 * Circuit Breaker States
 */
export enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, rejecting requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

/**
 * Circuit Breaker Configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;      // Number of failures before opening
  successThreshold: number;      // Number of successes to close from half-open
  timeout: number;               // Timeout in ms before trying half-open
  monitoringPeriod?: number;     // Period to track failures (ms)
  onStateChange?: (state: CircuitState) => void;
  onFailure?: (error: Error) => void;
  fallback?: (...args: any[]) => any;
}

/**
 * Circuit Breaker Statistics
 */
export interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  totalCalls: number;
  lastFailureTime: number | null;
  lastSuccessTime: number | null;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

/**
 * Circuit Breaker Implementation
 * Protects against cascading failures
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private consecutiveFailures: number = 0;
  private consecutiveSuccesses: number = 0;
  private lastFailureTime: number | null = null;
  private lastSuccessTime: number | null = null;
  private totalCalls: number = 0;
  private nextAttemptTime: number = 0;
  private config: Required<CircuitBreakerConfig>;
  
  constructor(config: CircuitBreakerConfig) {
    this.config = {
      monitoringPeriod: 60000, // 1 minute default
      onStateChange: () => {},
      onFailure: () => {},
      fallback: () => { throw new Error('Circuit breaker is open'); },
      ...config,
    };
  }
  
  /**
   * Execute function with circuit breaker protection
   */
  async execute<T>(fn: (...args: any[]) => Promise<T>, ...args: any[]): Promise<T> {
    this.totalCalls++;
    
    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        // Circuit still open, use fallback
        return this.config.fallback(...args);
      }
      
      // Try half-open
      this.setState(CircuitState.HALF_OPEN);
    }
    
    try {
      // Execute function
      const result = await fn(...args);
      
      // Record success
      this.onSuccess();
      
      return result;
    } catch (error) {
      // Record failure
      this.onFailure(error as Error);
      
      // Use fallback if available
      if (this.state === CircuitState.OPEN) {
        return this.config.fallback(...args);
      }
      
      throw error;
    }
  }
  
  /**
   * Execute function with automatic retry
   */
  async executeWithRetry<T>(
    fn: (...args: any[]) => Promise<T>,
    retries: number = 3,
    delay: number = 1000,
    ...args: any[]
  ): Promise<T> {
    let lastError: Error | null = null;
    
    for (let i = 0; i <= retries; i++) {
      try {
        return await this.execute(fn, ...args);
      } catch (error) {
        lastError = error as Error;
        
        if (i < retries) {
          await this.sleep(delay * Math.pow(2, i)); // Exponential backoff
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Handle successful execution
   */
  private onSuccess(): void {
    this.successCount++;
    this.consecutiveSuccesses++;
    this.consecutiveFailures = 0;
    this.lastSuccessTime = Date.now();
    
    if (this.state === CircuitState.HALF_OPEN) {
      if (this.consecutiveSuccesses >= this.config.successThreshold) {
        // Close circuit after enough successes
        this.setState(CircuitState.CLOSED);
        this.reset();
      }
    }
  }
  
  /**
   * Handle failed execution
   */
  private onFailure(error: Error): void {
    this.failureCount++;
    this.consecutiveFailures++;
    this.consecutiveSuccesses = 0;
    this.lastFailureTime = Date.now();
    
    this.config.onFailure(error);
    
    if (this.state === CircuitState.HALF_OPEN) {
      // Failed during half-open, go back to open
      this.setState(CircuitState.OPEN);
      this.scheduleNextAttempt();
    } else if (this.state === CircuitState.CLOSED) {
      if (this.consecutiveFailures >= this.config.failureThreshold) {
        // Open circuit after threshold
        this.setState(CircuitState.OPEN);
        this.scheduleNextAttempt();
      }
    }
  }
  
  /**
   * Set circuit state
   */
  private setState(newState: CircuitState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.config.onStateChange(newState);
    }
  }
  
  /**
   * Schedule next attempt time
   */
  private scheduleNextAttempt(): void {
    this.nextAttemptTime = Date.now() + this.config.timeout;
  }
  
  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.setState(CircuitState.CLOSED);
    this.failureCount = 0;
    this.successCount = 0;
    this.consecutiveFailures = 0;
    this.consecutiveSuccesses = 0;
    this.lastFailureTime = null;
    this.lastSuccessTime = null;
    this.nextAttemptTime = 0;
  }
  
  /**
   * Get current state
   */
  getState(): CircuitState {
    return this.state;
  }
  
  /**
   * Get statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failures: this.failureCount,
      successes: this.successCount,
      totalCalls: this.totalCalls,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      consecutiveFailures: this.consecutiveFailures,
      consecutiveSuccesses: this.consecutiveSuccesses,
    };
  }
  
  /**
   * Force open circuit
   */
  forceOpen(): void {
    this.setState(CircuitState.OPEN);
    this.scheduleNextAttempt();
  }
  
  /**
   * Force close circuit
   */
  forceClose(): void {
    this.reset();
  }
  
  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Rate Limiter
 * Controls request rate to prevent overload
 */
export class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly capacity: number;
  private readonly refillRate: number; // tokens per second
  
  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  
  /**
   * Try to consume tokens
   */
  tryConsume(tokens: number = 1): boolean {
    this.refill();
    
    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }
    
    return false;
  }
  
  /**
   * Wait until tokens available
   */
  async consume(tokens: number = 1): Promise<void> {
    while (!this.tryConsume(tokens)) {
      await this.sleep(100);
    }
  }
  
  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    
    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }
  
  /**
   * Get current token count
   */
  getTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
  
  /**
   * Reset rate limiter
   */
  reset(): void {
    this.tokens = this.capacity;
    this.lastRefill = Date.now();
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Retry Strategy
 */
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  jitter?: boolean;
  retryableErrors?: ((error: Error) => boolean)[];
}

export class RetryStrategy {
  private config: Required<RetryConfig>;
  
  constructor(config: Partial<RetryConfig> = {}) {
    this.config = {
      maxAttempts: config.maxAttempts || 3,
      initialDelay: config.initialDelay || 1000,
      maxDelay: config.maxDelay || 30000,
      backoffMultiplier: config.backoffMultiplier || 2,
      jitter: config.jitter !== false,
      retryableErrors: config.retryableErrors || [],
    };
  }
  
  /**
   * Execute with retry
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < this.config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Check if error is retryable
        if (!this.isRetryable(error as Error)) {
          throw error;
        }
        
        // Don't wait after last attempt
        if (attempt < this.config.maxAttempts - 1) {
          const delay = this.calculateDelay(attempt);
          await this.sleep(delay);
        }
      }
    }
    
    throw lastError;
  }
  
  /**
   * Check if error is retryable
   */
  private isRetryable(error: Error): boolean {
    if (this.config.retryableErrors.length === 0) {
      return true; // Retry all errors by default
    }
    
    return this.config.retryableErrors.some(checker => checker(error));
  }
  
  /**
   * Calculate retry delay with exponential backoff
   */
  private calculateDelay(attempt: number): number {
    let delay = Math.min(
      this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt),
      this.config.maxDelay
    );
    
    // Add jitter to prevent thundering herd
    if (this.config.jitter) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return delay;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Bulkhead Pattern
 * Isolates resources to prevent cascading failures
 */
export class Bulkhead {
  private readonly maxConcurrent: number;
  private readonly queue: Array<() => void> = [];
  private running: number = 0;
  
  constructor(maxConcurrent: number) {
    this.maxConcurrent = maxConcurrent;
  }
  
  /**
   * Execute function with concurrency limit
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    // Wait for available slot
    if (this.running >= this.maxConcurrent) {
      await new Promise<void>(resolve => this.queue.push(resolve));
    }
    
    this.running++;
    
    try {
      return await fn();
    } finally {
      this.running--;
      
      // Release next in queue
      const next = this.queue.shift();
      if (next) {
        next();
      }
    }
  }
  
  /**
   * Get current running count
   */
  getRunning(): number {
    return this.running;
  }
  
  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }
}
