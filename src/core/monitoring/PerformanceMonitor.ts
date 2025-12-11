/**
 * Performance Monitoring
 * 
 * @description Real-time performance tracking and Web Vitals monitoring
 * @module core/monitoring/PerformanceMonitor
 */

/**
 * Performance Metric
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  category: 'timing' | 'memory' | 'network' | 'custom';
  metadata?: Record<string, any>;
}

/**
 * Web Vitals Metrics
 */
export interface WebVitals {
  // Largest Contentful Paint
  lcp: number | null;
  // First Input Delay
  fid: number | null;
  // Cumulative Layout Shift
  cls: number | null;
  // First Contentful Paint
  fcp: number | null;
  // Time to First Byte
  ttfb: number | null;
  // Interaction to Next Paint
  inp: number | null;
}

/**
 * Performance Budget
 */
export interface PerformanceBudget {
  lcp: number;    // 2500ms recommended
  fid: number;    // 100ms recommended
  cls: number;    // 0.1 recommended
  fcp: number;    // 1800ms recommended
  ttfb: number;   // 600ms recommended
  inp: number;    // 200ms recommended
}

/**
 * Performance Report
 */
export interface PerformanceReport {
  metrics: PerformanceMetric[];
  webVitals: WebVitals;
  budget: PerformanceBudget;
  violations: string[];
  score: number; // 0-100
  timestamp: number;
}

/**
 * Performance Monitor Class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private webVitals: WebVitals = {
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    inp: null,
  };
  private observers: PerformanceObserver[] = [];
  private budget: PerformanceBudget;
  private maxMetrics: number = 1000;
  
  constructor(budget?: Partial<PerformanceBudget>) {
    this.budget = {
      lcp: 2500,
      fid: 100,
      cls: 0.1,
      fcp: 1800,
      ttfb: 600,
      inp: 200,
      ...budget,
    };
    
    this.init();
  }
  
  /**
   * Initialize performance monitoring
   */
  private init(): void {
    if (typeof window === 'undefined') return;
    
    // Monitor navigation timing
    this.observeNavigationTiming();
    
    // Monitor resource timing
    this.observeResourceTiming();
    
    // Monitor paint timing
    this.observePaintTiming();
    
    // Monitor layout shifts
    this.observeLayoutShifts();
    
    // Monitor long tasks
    this.observeLongTasks();
    
    // Monitor first input
    this.observeFirstInput();
    
    // Monitor largest contentful paint
    this.observeLCP();
    
    // Collect initial metrics
    this.collectNavigationMetrics();
  }
  
  /**
   * Observe navigation timing
   */
  private observeNavigationTiming(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            
            // DNS lookup time
            this.recordMetric('dns-lookup', navEntry.domainLookupEnd - navEntry.domainLookupStart, 'ms', 'timing');
            
            // TCP connection time
            this.recordMetric('tcp-connection', navEntry.connectEnd - navEntry.connectStart, 'ms', 'timing');
            
            // TLS negotiation time
            if (navEntry.secureConnectionStart > 0) {
              this.recordMetric('tls-negotiation', navEntry.connectEnd - navEntry.secureConnectionStart, 'ms', 'timing');
            }
            
            // Request time
            this.recordMetric('request-time', navEntry.responseStart - navEntry.requestStart, 'ms', 'timing');
            
            // Response time
            this.recordMetric('response-time', navEntry.responseEnd - navEntry.responseStart, 'ms', 'timing');
            
            // DOM processing
            this.recordMetric('dom-processing', navEntry.domComplete - navEntry.domLoading, 'ms', 'timing');
            
            // DOM Interactive
            this.recordMetric('dom-interactive', navEntry.domInteractive - navEntry.fetchStart, 'ms', 'timing');
            
            // DOM Content Loaded
            this.recordMetric('dom-content-loaded', navEntry.domContentLoadedEventEnd - navEntry.fetchStart, 'ms', 'timing');
            
            // Load Complete
            this.recordMetric('load-complete', navEntry.loadEventEnd - navEntry.fetchStart, 'ms', 'timing');
            
            // TTFB
            const ttfb = navEntry.responseStart - navEntry.requestStart;
            this.recordMetric('ttfb', ttfb, 'ms', 'timing');
            this.webVitals.ttfb = ttfb;
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('Failed to observe navigation timing:', error);
    }
  }
  
  /**
   * Observe resource timing
   */
  private observeResourceTiming(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resourceEntry = entry as PerformanceResourceTiming;
          
          this.recordMetric(
            `resource-${resourceEntry.name}`,
            resourceEntry.duration,
            'ms',
            'network',
            {
              initiatorType: resourceEntry.initiatorType,
              transferSize: resourceEntry.transferSize,
              encodedBodySize: resourceEntry.encodedBodySize,
              decodedBodySize: resourceEntry.decodedBodySize,
            }
          );
        }
      });
      
      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('Failed to observe resource timing:', error);
    }
  }
  
  /**
   * Observe paint timing
   */
  private observePaintTiming(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const paintEntry = entry as PerformancePaintTiming;
          
          if (paintEntry.name === 'first-contentful-paint') {
            this.recordMetric('fcp', paintEntry.startTime, 'ms', 'timing');
            this.webVitals.fcp = paintEntry.startTime;
          } else if (paintEntry.name === 'first-paint') {
            this.recordMetric('fp', paintEntry.startTime, 'ms', 'timing');
          }
        }
      });
      
      observer.observe({ entryTypes: ['paint'] });
      this.observers.push(observer);
    } catch (error) {
      console.error('Failed to observe paint timing:', error);
    }
  }
  
  /**
   * Observe layout shifts (CLS)
   */
  private observeLayoutShifts(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      let clsValue = 0;
      
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Only count layout shifts without recent user input
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.webVitals.cls = clsValue;
            this.recordMetric('cls', clsValue, 'score', 'custom');
          }
        }
      });
      
      observer.observe({ type: 'layout-shift', buffered: true } as any);
      this.observers.push(observer);
    } catch (error) {
      console.error('Failed to observe layout shifts:', error);
    }
  }
  
  /**
   * Observe long tasks
   */
  private observeLongTasks(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.recordMetric(
            'long-task',
            entry.duration,
            'ms',
            'timing',
            { name: entry.name }
          );
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
      this.observers.push(observer);
    } catch (error) {
      // Long tasks API not supported in all browsers
    }
  }
  
  /**
   * Observe first input (FID)
   */
  private observeFirstInput(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidValue = (entry as any).processingStart - entry.startTime;
          this.recordMetric('fid', fidValue, 'ms', 'timing');
          this.webVitals.fid = fidValue;
        }
      });
      
      observer.observe({ type: 'first-input', buffered: true } as any);
      this.observers.push(observer);
    } catch (error) {
      console.error('Failed to observe first input:', error);
    }
  }
  
  /**
   * Observe LCP
   */
  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        if (lastEntry) {
          const lcpValue = lastEntry.startTime;
          this.recordMetric('lcp', lcpValue, 'ms', 'timing');
          this.webVitals.lcp = lcpValue;
        }
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true } as any);
      this.observers.push(observer);
    } catch (error) {
      console.error('Failed to observe LCP:', error);
    }
  }
  
  /**
   * Collect navigation metrics
   */
  private collectNavigationMetrics(): void {
    if (typeof window === 'undefined' || !window.performance) return;
    
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    if (navigation) {
      // Record basic timing metrics
      this.recordMetric('redirect-time', navigation.redirectEnd - navigation.redirectStart, 'ms', 'timing');
      this.recordMetric('cache-lookup', navigation.domainLookupStart - navigation.fetchStart, 'ms', 'timing');
    }
  }
  
  /**
   * Record custom metric
   */
  recordMetric(
    name: string,
    value: number,
    unit: string = 'ms',
    category: 'timing' | 'memory' | 'network' | 'custom' = 'custom',
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      category,
      timestamp: Date.now(),
      metadata,
    };
    
    this.metrics.push(metric);
    
    // Trim metrics if too many
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }
  }
  
  /**
   * Mark timing point
   */
  mark(name: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  }
  
  /**
   * Measure between marks
   */
  measure(name: string, startMark: string, endMark?: string): number | null {
    if (typeof performance === 'undefined' || !performance.measure) {
      return null;
    }
    
    try {
      const measureName = `measure-${name}`;
      performance.measure(measureName, startMark, endMark);
      
      const entries = performance.getEntriesByName(measureName);
      if (entries.length > 0) {
        const duration = entries[0].duration;
        this.recordMetric(name, duration, 'ms', 'timing');
        return duration;
      }
    } catch (error) {
      console.error('Failed to measure:', error);
    }
    
    return null;
  }
  
  /**
   * Get all metrics
   */
  getMetrics(category?: string): PerformanceMetric[] {
    if (category) {
      return this.metrics.filter(m => m.category === category);
    }
    return [...this.metrics];
  }
  
  /**
   * Get Web Vitals
   */
  getWebVitals(): WebVitals {
    return { ...this.webVitals };
  }
  
  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    const violations: string[] = [];
    let score = 100;
    
    // Check LCP
    if (this.webVitals.lcp && this.webVitals.lcp > this.budget.lcp) {
      violations.push(`LCP (${this.webVitals.lcp.toFixed(0)}ms) exceeds budget (${this.budget.lcp}ms)`);
      score -= 15;
    }
    
    // Check FID
    if (this.webVitals.fid && this.webVitals.fid > this.budget.fid) {
      violations.push(`FID (${this.webVitals.fid.toFixed(0)}ms) exceeds budget (${this.budget.fid}ms)`);
      score -= 15;
    }
    
    // Check CLS
    if (this.webVitals.cls && this.webVitals.cls > this.budget.cls) {
      violations.push(`CLS (${this.webVitals.cls.toFixed(3)}) exceeds budget (${this.budget.cls})`);
      score -= 15;
    }
    
    // Check FCP
    if (this.webVitals.fcp && this.webVitals.fcp > this.budget.fcp) {
      violations.push(`FCP (${this.webVitals.fcp.toFixed(0)}ms) exceeds budget (${this.budget.fcp}ms)`);
      score -= 10;
    }
    
    // Check TTFB
    if (this.webVitals.ttfb && this.webVitals.ttfb > this.budget.ttfb) {
      violations.push(`TTFB (${this.webVitals.ttfb.toFixed(0)}ms) exceeds budget (${this.budget.ttfb}ms)`);
      score -= 10;
    }
    
    return {
      metrics: this.getMetrics(),
      webVitals: this.getWebVitals(),
      budget: this.budget,
      violations,
      score: Math.max(0, score),
      timestamp: Date.now(),
    };
  }
  
  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
  
  /**
   * Disconnect all observers
   */
  disconnect(): void {
    for (const observer of this.observers) {
      observer.disconnect();
    }
    this.observers = [];
  }
  
  /**
   * Get memory usage (if available)
   */
  getMemoryUsage(): {
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null {
    if (typeof performance !== 'undefined' && (performance as any).memory) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor({
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
  inp: 200,
});

/**
 * Performance decorator
 */
export function measurePerformance(metricName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const name = metricName || `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = async function (...args: any[]) {
      const startMark = `${name}-start`;
      const endMark = `${name}-end`;
      
      performanceMonitor.mark(startMark);
      
      try {
        const result = await originalMethod.apply(this, args);
        performanceMonitor.mark(endMark);
        performanceMonitor.measure(name, startMark, endMark);
        return result;
      } catch (error) {
        performanceMonitor.mark(endMark);
        performanceMonitor.measure(name, startMark, endMark);
        throw error;
      }
    };
    
    return descriptor;
  };
}
