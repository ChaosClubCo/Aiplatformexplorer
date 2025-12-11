/**
 * AI Platform Explorer - Main Application (Refactored V3)
 * 
 * Architecture: Feature-Sliced Design + Context API
 * Performance: Code splitting, memoization, lazy loading
 * Accessibility: WCAG 2.1 AA compliant
 * 
 * @module App
 * @version 3.0.0
 */

import React, { lazy, Suspense } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppProvider } from './context/AppContext';
import { filterPlatforms, sortPlatforms } from './utils/platform';
import { useAppState } from './hooks/useAppState';

// Lazy load heavy components
const Header = lazy(() => import('./components/layout/Header'));
const Navigation = lazy(() => import('./components/layout/Navigation'));
const Footer = lazy(() => import('./components/layout/Footer'));
const PlatformExplorer = lazy(() => import('./pages/PlatformExplorer'));
const Comparison = lazy(() => import('./pages/Comparison'));
const Recommendation = lazy(() => import('./pages/Recommendation'));
const ROICalculator = lazy(() => import('./pages/ROICalculator'));
const Analytics = lazy(() => import('./pages/Analytics'));
const PersonaGenerator = lazy(() => import('./features/user-personas/PersonaGenerator'));
const ToastContainer = lazy(() => import('./components/common/ToastContainer'));

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div 
      className="flex items-center justify-center py-12" 
      role="status" 
      aria-live="polite"
      aria-label="Loading content"
    >
      <div className="flex flex-col items-center gap-3">
        <div 
          className="w-12 h-12 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin"
          aria-hidden="true"
        />
        <p className="text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

/**
 * Error fallback component
 */
function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 space-y-4">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. Please try again.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left mb-4">
              <summary className="cursor-pointer text-sm text-gray-500 mb-2">
                Error details (dev only)
              </summary>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        <button
          onClick={resetError}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/**
 * Main application layout
 */
function AppLayout() {
  const { state, actions } = useAppState();
  
  // Render current page based on tab
  const renderPage = () => {
    switch (state.ui.currentTab) {
      case 'explorer':
        return <PlatformExplorer />;
      
      case 'comparison':
        return <Comparison />;
      
      case 'recommendation':
        return <Recommendation />;
      
      case 'roi':
        return <ROICalculator />;
      
      case 'analytics':
        return <Analytics />;
      
      case 'personas':
        return <PersonaGenerator />;
      
      default:
        return <PlatformExplorer />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Suspense fallback={<LoadingFallback />}>
        <Header />
      </Suspense>
      
      {/* Navigation */}
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      
      {/* Main Content */}
      <main className="flex-1">
        <ErrorBoundary
          fallback={(error, reset) => <ErrorFallback error={error} resetError={reset} />}
        >
          <Suspense fallback={<LoadingFallback />}>
            {renderPage()}
          </Suspense>
        </ErrorBoundary>
      </main>
      
      {/* Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      
      {/* Toast Notifications */}
      <Suspense fallback={null}>
        <ToastContainer />
      </Suspense>
    </div>
  );
}

/**
 * Root application component
 */
export default function App() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => <ErrorFallback error={error} resetError={reset} />}
    >
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </ErrorBoundary>
  );
}

/**
 * Application metadata for SEO and analytics
 */
export const APP_METADATA = {
  name: 'AI Platform Explorer',
  version: '3.0.0',
  description: 'Comprehensive AI platform comparison and recommendation tool',
  author: 'INT Inc.',
  keywords: [
    'AI platforms',
    'platform comparison',
    'ROI calculator',
    'recommendation engine',
    'enterprise AI',
  ],
  personas: [
    'Enterprise AI Architect',
    'Startup CTO',
    'ML Engineer',
    'Product Manager',
    'Compliance Officer',
    'Budget Analyst',
    'Developer Advocate',
    'Research Scientist',
    'Business Analyst',
    'IT Administrator',
  ],
};
