/**
 * Monitoring and Error Tracking Utilities
 * 
 * @description Web Vitals tracking and error reporting
 */

import * as Sentry from '@sentry/react';

/**
 * Safe environment variable check
 */
const isProd = (): boolean => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.PROD === true;
    }
  } catch (e) {
    // Silently fall through
  }
  return false;
};

const getSentryDSN = (): string | undefined => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.VITE_SENTRY_DSN;
    }
  } catch (e) {
    // Silently fall through
  }
  return undefined;
};

const getMode = (): string => {
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env.MODE || 'development';
    }
  } catch (e) {
    // Silently fall through
  }
  return 'development';
};

/**
 * Initialize Sentry error tracking
 */
export function initSentry() {
  const sentryDSN = getSentryDSN();
  
  if (isProd() && sentryDSN) {
    Sentry.init({
      dsn: sentryDSN,
      environment: getMode(),
      tracesSampleRate: 0.1,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      beforeSend(event) {
        // Filter out localhost errors in production builds
        if (event.request?.url?.includes('localhost')) {
          return null;
        }
        return event;
      },
    });
  }
}

/**
 * Report Web Vitals to Sentry
 */
export async function reportWebVitals() {
  if (!isProd()) return;

  try {
    const { getCLS, getFID, getLCP, getFCP, getTTFB } = await import('web-vitals');

    getCLS((metric) => {
      Sentry.captureMessage(`CLS: ${metric.value.toFixed(3)}`, {
        level: metric.value > 0.1 ? 'warning' : 'info',
        tags: { metric: 'cls', rating: metric.rating },
      });
    });

    getFID((metric) => {
      Sentry.captureMessage(`FID: ${metric.value.toFixed(0)}ms`, {
        level: metric.value > 100 ? 'warning' : 'info',
        tags: { metric: 'fid', rating: metric.rating },
      });
    });

    getLCP((metric) => {
      Sentry.captureMessage(`LCP: ${metric.value.toFixed(0)}ms`, {
        level: metric.value > 2500 ? 'warning' : 'info',
        tags: { metric: 'lcp', rating: metric.rating },
      });
    });

    getFCP((metric) => {
      Sentry.captureMessage(`FCP: ${metric.value.toFixed(0)}ms`, {
        tags: { metric: 'fcp', rating: metric.rating },
      });
    });

    getTTFB((metric) => {
      Sentry.captureMessage(`TTFB: ${metric.value.toFixed(0)}ms`, {
        tags: { metric: 'ttfb', rating: metric.rating },
      });
    });
  } catch (error) {
    console.error('Failed to load web-vitals:', error);
  }
}

/**
 * Log error with context
 */
export function logError(error: Error, context?: Record<string, any>) {
  if (isProd()) {
    Sentry.captureException(error, { contexts: { custom: context } });
  } else {
    console.error('[Error]', error, context);
  }
}

/**
 * Log message with context
 */
export function logMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
  if (isProd()) {
    Sentry.captureMessage(message, { level, contexts: { custom: context } });
  } else {
    console.log(`[${level.toUpperCase()}]`, message, context);
  }
}