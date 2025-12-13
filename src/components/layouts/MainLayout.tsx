/**
 * Main Layout Component
 * 
 * @description Primary application layout with header, navigation, and footer
 * @module components/layouts/MainLayout
 */

import React, { Suspense, lazy } from 'react';
import { LoadingFallback } from '../core/LoadingFallback';
import { useAppContext } from '../../context/AppContext';
import { CommandPalette } from '../CommandPalette';

// Lazy load layout components - use default imports since they're already in root components folder
const Header = lazy(() => import('../Header').then(module => ({ default: module.default || module })));
const Navigation = lazy(() => import('../Navigation').then(module => ({ default: module.default || module })));
const Footer = lazy(() => import('../Footer').then(module => ({ default: module.default || module })));
const ToastContainer = lazy(() => import('../ToastContainer').then(module => ({ default: module.default || module })));

/**
 * Main Layout Props
 */
interface MainLayoutProps {
  children: React.ReactNode;
}

/**
 * Main Layout Component
 * 
 * Provides consistent layout structure across all pages
 * Includes header, navigation, main content area, and footer
 * 
 * @param {MainLayoutProps} props - Component props
 * @returns {JSX.Element} Layout component
 */
export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const { state } = useAppContext();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Suspense fallback={null}>
        <Header />
      </Suspense>
      
      {/* Navigation */}
      <Suspense fallback={null}>
        <Navigation />
      </Suspense>
      
      {/* Main Content */}
      <main
        className="flex-1"
        role="main"
        aria-label="Main content"
      >
        {state.ui.loading ? (
          <LoadingFallback fullScreen />
        ) : (
          children
        )}
        
        {/* Error Display */}
        {state.ui.error && (
          <div className="fixed bottom-4 right-4 max-w-md">
            <ErrorAlert message={state.ui.error} />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      
      {/* Command Palette */}
      <CommandPalette />
      
      {/* Toast Notifications */}
      <Suspense fallback={null}>
        <ToastContainer />
      </Suspense>
    </div>
  );
}

/**
 * Error Alert Component
 */
function ErrorAlert({ message }: { message: string }) {
  const { actions } = useAppContext();
  
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        <button
          onClick={() => actions.setError(null)}
          className="ml-3 flex-shrink-0 text-red-600 hover:text-red-800"
          aria-label="Dismiss error"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

/**
 * Container Component
 * 
 * Provides consistent max-width container with padding
 */
export function Container({ children, className = '' }: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Page Header Component
 * 
 * Standard page header with title and optional description
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl">{title}</h1>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {description && (
        <p className="text-gray-600 text-lg">{description}</p>
      )}
    </div>
  );
}