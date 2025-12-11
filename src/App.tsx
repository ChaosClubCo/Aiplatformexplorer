/**
 * AI Platform Explorer - Main Application
 * 
 * @description Production-grade AI platform comparison and analysis tool
 * @version 5.0.0
 * @architecture Clean Architecture + DDD + Event-Driven + Enterprise Patterns
 * 
 * @module App
 */

import React, { Suspense, lazy, useEffect } from 'react';
import { ErrorBoundary } from './components/core/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import { LoadingFallback } from './components/core/LoadingFallback';

// Core enterprise infrastructure
import {
  SecurityManager,
  featureFlags,
  performanceMonitor,
  globalEventBus,
  DomainEvents,
} from './core';

// Lazy load pages for optimal performance
const Router = lazy(() => import('./routes/Router'));

/**
 * Initialize enterprise infrastructure
 */
function initializeApp() {
  // Initialize security features
  SecurityManager.init();
  
  // Set feature flag context
  featureFlags.setContext({
    environment: process.env.NODE_ENV as any,
  });
  
  // Start performance monitoring
  performanceMonitor.mark('app-init-start');
  
  // Set up global error handling
  window.addEventListener('error', (event) => {
    const error = event.error || new Error(event.message || 'Unknown error');
    globalEventBus.emit(DomainEvents.ERROR_OCCURRED, {
      error,
      context: 'window.onerror',
      severity: 'high' as const,
    });
  });
  
  // Set up unhandled promise rejection handling
  window.addEventListener('unhandledrejection', (event) => {
    const error = event.reason instanceof Error 
      ? event.reason 
      : new Error(String(event.reason) || 'Unhandled promise rejection');
    globalEventBus.emit(DomainEvents.ERROR_OCCURRED, {
      error,
      context: 'unhandledrejection',
      severity: 'high' as const,
    });
  });
  
  // Log app initialization
  SecurityManager.audit.log('app-initialized', 'system', {
    version: APP_METADATA.version,
    timestamp: new Date().toISOString(),
  }, 'info');
  
  // Complete initialization
  performanceMonitor.mark('app-init-end');
  performanceMonitor.measure('app-init', 'app-init-start', 'app-init-end');
  
  // Emit initialization complete event
  globalEventBus.emit(DomainEvents.APP_INITIALIZED, {
    version: APP_METADATA.version,
    timestamp: Date.now(),
  });
}

/**
 * Root Application Component
 * 
 * Implements:
 * - Error boundary for fault tolerance
 * - Context provider for global state
 * - Lazy loading for performance
 * - Suspense for loading states
 * - Enterprise infrastructure initialization
 * 
 * @returns {JSX.Element} Root application component
 */
export default function App(): JSX.Element {
  // Initialize on mount
  useEffect(() => {
    initializeApp();
    
    // Generate performance report on unmount
    return () => {
      const report = performanceMonitor.generateReport();
      console.log('[Performance Report]', {
        score: report.score,
        violations: report.violations,
        webVitals: report.webVitals,
      });
    };
  }, []);
  
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Emit error event for monitoring
        globalEventBus.emit(DomainEvents.APP_ERROR, {
          error,
          errorInfo,
          timestamp: Date.now(),
        });
        
        // Log security audit
        SecurityManager.audit.log('app-error', 'system', {
          error: error.message,
          stack: error.stack,
        }, 'critical');
      }}
    >
      <ToastProvider>
        <AppProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Router />
          </Suspense>
        </AppProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

/**
 * Application Metadata
 * Used for SEO, analytics, and monitoring
 */
export const APP_METADATA = {
  name: 'AI Platform Explorer',
  version: '5.0.0',
  description: 'Enterprise-grade AI platform comparison and recommendation tool with advanced patterns',
  author: 'INT Inc.',
  repository: 'github.com/int-inc/ai-platform-explorer',
  
  // Feature flags
  features: {
    platformComparison: true,
    roiCalculator: true,
    recommendationEngine: true,
    notionIntegration: true,
    projectManagement: true,
    analytics: true,
    personaGenerator: true,
    
    // New V5 features
    eventDrivenArchitecture: true,
    advancedCaching: true,
    circuitBreaker: true,
    performanceMonitoring: true,
    securityHardening: true,
    featureFlags: true,
    domainDrivenDesign: true,
  },
  
  // Performance budgets
  performance: {
    maxInitialBundleSize: 200, // KB
    maxRouteLoadTime: 3000, // ms
    targetLighthouseScore: 90,
    webVitals: {
      lcp: 2500, // ms
      fid: 100, // ms
      cls: 0.1, // score
      fcp: 1800, // ms
      ttfb: 600, // ms
    },
  },
  
  // Accessibility standards
  accessibility: {
    standard: 'WCAG 2.1 AA',
    screenReaderSupport: true,
    keyboardNavigation: true,
    colorContrastRatio: 4.5,
  },
  
  // Security configuration
  security: {
    xssProtection: true,
    csrfProtection: true,
    inputValidation: true,
    auditLogging: true,
  },
  
  // Architecture info
  architecture: {
    pattern: 'Clean Architecture + DDD',
    stateManagement: 'Context API + Event Bus',
    designPatterns: [
      'Repository',
      'Factory',
      'Observer',
      'Circuit Breaker',
      'Specification',
      'Builder',
      'Singleton',
    ],
  },
} as const;