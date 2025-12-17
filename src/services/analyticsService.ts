/**
 * Analytics Service
 * 
 * @description Production-grade analytics and event tracking
 * @module services/analyticsService
 */

/**
 * Event data interface
 */
interface EventData {
  category: string;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Analytics Service Class
 */
class AnalyticsService {
  private enabled: boolean = true;
  private sessionId: string;
  private userId: string | null = null;
  
  constructor() {
    this.sessionId = this.generateSessionId();
  }
  
  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Track page view
   */
  trackPageView(page: string, title?: string): void {
    if (!this.enabled) return;
    
    const data = {
      type: 'pageview',
      page,
      title: title || document.title,
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.sendEvent(data);
  }
  
  /**
   * Track custom event
   */
  trackEvent(category: string, action: string, label?: string, value?: number): void {
    if (!this.enabled) return;
    
    const data: EventData = {
      type: 'event',
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.sendEvent(data);
  }
  
  /**
   * Track error
   */
  trackError(error: Error, context?: any): void {
    if (!this.enabled) return;
    
    const data = {
      type: 'error',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
    };
    
    this.sendEvent(data);
    
    // Log to console in development
    // if (process.env.NODE_ENV === 'development') {
      console.error('Analytics Error:', error, context);
    // }
  }
  
  /**
   * Track timing
   */
  trackTiming(category: string, variable: string, time: number, label?: string): void {
    if (!this.enabled) return;
    
    const data = {
      type: 'timing',
      category,
      variable,
      time,
      label,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
    };
    
    this.sendEvent(data);
  }
  
  /**
   * Track user identification
   */
  identify(userId: string, traits?: Record<string, any>): void {
    this.userId = userId;
    
    if (!this.enabled) return;
    
    const data = {
      type: 'identify',
      userId,
      traits,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
    };
    
    this.sendEvent(data);
  }
  
  /**
   * Send event to analytics backend
   */
  private sendEvent(data: any): void {
    // In production, send to your analytics service
    // Examples: Google Analytics, Mixpanel, Segment, etc.
    
    // if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', data);
    // }
    
    // Example: Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', data.action || data.type, {
        event_category: data.category,
        event_label: data.label,
        value: data.value,
      });
    }
    
    // Example: Send to custom endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // }).catch(console.error);
  }
  
  /**
   * Enable analytics
   */
  enable(): void {
    this.enabled = true;
  }
  
  /**
   * Disable analytics (for opt-out)
   */
  disable(): void {
    this.enabled = false;
  }
  
  /**
   * Check if analytics is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }
  
  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
  
  /**
   * Get user ID
   */
  getUserId(): string | null {
    return this.userId;
  }
}

/**
 * Singleton instance
 */
export const analyticsService = new AnalyticsService();

export default analyticsService;
