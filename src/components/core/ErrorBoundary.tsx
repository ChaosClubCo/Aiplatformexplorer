/**
 * Error Boundary Component
 * 
 * @description Catches and handles React errors gracefully
 * @module components/core/ErrorBoundary
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { analyticsService } from '../../services/analyticsService';

/**
 * Error Boundary Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

/**
 * Error Boundary State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * 
 * Implements React error boundary pattern
 * Provides fallback UI and error recovery
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }
  
  /**
   * Update state when error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }
  
  /**
   * Handle error and log to analytics
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to analytics service
    analyticsService.trackError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo,
    });
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught error:', error);
      console.error('Error Info:', errorInfo);
    }
  }
  
  /**
   * Reset error state
   */
  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };
  
  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;
    
    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback && errorInfo) {
        return fallback(error, errorInfo, this.handleReset);
      }
      
      // Default fallback UI
      return <DefaultErrorFallback error={error} reset={this.handleReset} />;
    }
    
    return children;
  }
}

/**
 * Default Error Fallback Component
 */
function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 space-y-6">
        {/* Error Icon */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          
          {/* Error Title */}
          <h1 className="text-2xl mb-2">Something went wrong</h1>
          
          {/* Error Message */}
          <p className="text-gray-600 mb-4">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
        </div>
        
        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-gray-500 mb-2 font-medium">
              Error Details (Development Only)
            </summary>
            <div className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
              <p className="font-semibold mb-1">Error Message:</p>
              <p className="text-red-600 mb-3">{error.message}</p>
              
              {error.stack && (
                <>
                  <p className="font-semibold mb-1">Stack Trace:</p>
                  <pre className="text-gray-700 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </>
              )}
            </div>
          </details>
        )}
        
        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Go to Homepage
          </button>
        </div>
        
        {/* Support Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Need help? Contact us at</p>
          <a
            href="mailto:support@aiplatformexplorer.com"
            className="text-orange-500 hover:text-orange-600 font-medium"
          >
            support@aiplatformexplorer.com
          </a>
        </div>
      </div>
    </div>
  );
}
