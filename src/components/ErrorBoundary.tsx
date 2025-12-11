import { Component, ReactNode, ErrorInfo } from 'react';
import { APP_CONFIG } from '../config/app.config';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (APP_CONFIG.app.environment === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, send to error reporting service
    if (APP_CONFIG.app.environment === 'production' && APP_CONFIG.features.errorReporting) {
      this.reportError(error, errorInfo);
    }

    this.setState({
      errorInfo,
    });
  }

  private reportError(error: Error, errorInfo: ErrorInfo) {
    // Send to error reporting service (Sentry, LogRocket, etc.)
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      appVersion: APP_CONFIG.app.version,
      environment: APP_CONFIG.app.environment,
      userAgent: navigator.userAgent,
    };

    // Example: Send to error reporting endpoint
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorReport),
    }).catch(console.error);
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FFFCF8] p-6">
          <div className="max-w-[600px] w-full bg-white border-2 border-[#EDE8E3] rounded-2xl p-8 shadow-lg">
            <div className="mb-6 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-3xl font-serif mb-2 text-[#231C19]">
                Something went wrong
              </h1>
              <p className="text-[#5C524D]">
                We apologize for the inconvenience. An error occurred while loading this page.
              </p>
            </div>

            {APP_CONFIG.app.environment === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-[#FEE2E2] border border-[#DC2626] rounded-lg">
                <h2 className="font-semibold text-[#991B1B] mb-2">Error Details:</h2>
                <p className="text-sm text-[#7F1D1D] font-mono mb-2">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-xs text-[#7F1D1D] overflow-auto max-h-48 p-2 bg-white rounded">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-[#E88A1D] text-white rounded-lg hover:bg-[#D07614] transition-all font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-white border border-[#D9D2CC] rounded-lg hover:bg-[#FAFAFA] transition-all"
              >
                Go Home
              </button>
            </div>

            <div className="mt-6 text-center text-sm text-[#8B8279]">
              <p>
                If this problem persists, please{' '}
                <a
                  href={APP_CONFIG.urls.support}
                  className="text-[#E88A1D] hover:underline"
                >
                  contact support
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Async Error Boundary for Suspense fallback errors
 */
export function AsyncErrorBoundary({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        fallback || (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-[#5C524D]">Failed to load component</p>
            </div>
          </div>
        )
      }
    >
      {children}
    </ErrorBoundary>
  );
}
