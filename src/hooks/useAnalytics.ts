import { useCallback, useEffect } from 'react';
import { APP_CONFIG } from '../config/app.config';
import { ANALYTICS_EVENTS, type AnalyticsEvent } from '../constants';

/**
 * Analytics Event Data
 */
interface AnalyticsEventData {
  category?: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

/**
 * Analytics Hook
 * Provides methods for tracking user interactions and events
 */
export function useAnalytics() {
  // Track page view
  const trackPageView = useCallback((pageName: string, properties?: Record<string, any>) => {
    if (!APP_CONFIG.analytics.enabled || !APP_CONFIG.analytics.trackPageViews) {
      return;
    }

    const event = {
      type: ANALYTICS_EVENTS.PAGE_VIEW,
      page: pageName,
      timestamp: new Date().toISOString(),
      ...properties,
    };

    logEvent(event);
  }, []);

  // Track custom event
  const trackEvent = useCallback((
    eventName: AnalyticsEvent,
    data?: AnalyticsEventData
  ) => {
    if (!APP_CONFIG.analytics.enabled || !APP_CONFIG.analytics.trackEvents) {
      return;
    }

    const event = {
      type: eventName,
      timestamp: new Date().toISOString(),
      ...data,
    };

    logEvent(event);
  }, []);

  // Track error
  const trackError = useCallback((
    error: Error,
    context?: Record<string, any>
  ) => {
    if (!APP_CONFIG.analytics.enabled || !APP_CONFIG.analytics.trackErrors) {
      return;
    }

    const event = {
      type: ANALYTICS_EVENTS.ERROR,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      timestamp: new Date().toISOString(),
      ...context,
    };

    logEvent(event);
    console.error('Analytics Error:', error, context);
  }, []);

  // Track user interaction
  const trackInteraction = useCallback((
    interactionType: string,
    target: string,
    data?: Record<string, any>
  ) => {
    if (!APP_CONFIG.analytics.enabled) {
      return;
    }

    const event = {
      type: 'interaction',
      interactionType,
      target,
      timestamp: new Date().toISOString(),
      ...data,
    };

    logEvent(event);
  }, []);

  // Track timing (performance metrics)
  const trackTiming = useCallback((
    category: string,
    variable: string,
    time: number,
    label?: string
  ) => {
    if (!APP_CONFIG.analytics.enabled) {
      return;
    }

    const event = {
      type: 'timing',
      category,
      variable,
      time,
      label,
      timestamp: new Date().toISOString(),
    };

    logEvent(event);
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackError,
    trackInteraction,
    trackTiming,
  };
}

/**
 * Hook for tracking component lifecycle
 */
export function useComponentTracking(componentName: string) {
  const { trackPageView, trackTiming } = useAnalytics();

  useEffect(() => {
    const startTime = performance.now();
    
    trackPageView(componentName);

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      trackTiming('component', 'mount-duration', duration, componentName);
    };
  }, [componentName, trackPageView, trackTiming]);
}

/**
 * Hook for tracking form interactions
 */
export function useFormTracking(formName: string) {
  const { trackEvent } = useAnalytics();

  const trackFieldChange = useCallback((fieldName: string, value: any) => {
    trackEvent(ANALYTICS_EVENTS.QUESTION_ANSWER, {
      form: formName,
      field: fieldName,
      value: typeof value === 'object' ? JSON.stringify(value) : value,
    });
  }, [formName, trackEvent]);

  const trackFormSubmit = useCallback((data?: Record<string, any>) => {
    trackEvent(ANALYTICS_EVENTS.RECOMMENDATION_COMPLETE, {
      form: formName,
      ...data,
    });
  }, [formName, trackEvent]);

  const trackFormError = useCallback((error: string, field?: string) => {
    trackEvent(ANALYTICS_EVENTS.ERROR, {
      form: formName,
      error,
      field,
    });
  }, [formName, trackEvent]);

  return {
    trackFieldChange,
    trackFormSubmit,
    trackFormError,
  };
}

/**
 * Internal function to log events
 * In production, this would send to analytics service (GA, Mixpanel, etc.)
 */
function logEvent(event: Record<string, any>) {
  // Apply sampling rate
  if (Math.random() > APP_CONFIG.analytics.samplingRate) {
    return;
  }

  // Console log in development
  if (APP_CONFIG.app.environment === 'development') {
    console.log('[Analytics]', event);
  }

  // In production, send to analytics service
  // Example: Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.type, event);
  }

  // Example: Custom analytics endpoint
  if (APP_CONFIG.app.environment === 'production') {
    // Batch events and send periodically
    queueEvent(event);
  }
}

/**
 * Event queue for batching analytics
 */
let eventQueue: any[] = [];
let flushTimer: NodeJS.Timeout | null = null;

function queueEvent(event: Record<string, any>) {
  eventQueue.push(event);

  // Flush queue every 5 seconds or when it reaches 10 events
  if (eventQueue.length >= 10) {
    flushEvents();
  } else if (!flushTimer) {
    flushTimer = setTimeout(flushEvents, 5000);
  }
}

function flushEvents() {
  if (eventQueue.length === 0) {
    return;
  }

  const events = [...eventQueue];
  eventQueue = [];

  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }

  // Send to analytics endpoint
  if (typeof window !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(
      APP_CONFIG.api.baseUrl + '/analytics',
      JSON.stringify({ events })
    );
  } else {
    // Fallback to fetch
    fetch(APP_CONFIG.api.baseUrl + '/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events }),
    }).catch(console.error);
  }
}

// Flush events on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushEvents);
}
