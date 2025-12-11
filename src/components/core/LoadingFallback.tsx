/**
 * Loading Fallback Component
 * 
 * @description Loading indicator for Suspense boundaries
 * @module components/core/LoadingFallback
 */

import React from 'react';

/**
 * Loading Fallback Props
 */
interface LoadingFallbackProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

/**
 * Loading Fallback Component
 * 
 * Displays loading spinner with optional message
 * Accessible with ARIA attributes
 * 
 * @param {LoadingFallbackProps} props - Component props
 * @returns {JSX.Element} Loading fallback UI
 */
export function LoadingFallback({
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
}: LoadingFallbackProps): JSX.Element {
  const spinnerSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'flex items-center justify-center py-12';
  
  return (
    <div
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div
          className={`${spinnerSizes[size]} border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin`}
          aria-hidden="true"
        />
        
        {/* Loading Message */}
        <p className="text-sm text-gray-600 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * Skeleton Loading Component
 * 
 * Provides skeleton UI for content loading
 */
export function SkeletonLoader({ count = 3 }: { count?: number }): JSX.Element {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg p-6 shadow">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      ))}
    </div>
  );
}

/**
 * Card Skeleton Component
 */
export function CardSkeleton(): JSX.Element {
  return (
    <div className="bg-white rounded-lg p-6 shadow animate-pulse">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded"></div>
        <div className="ml-3 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}
