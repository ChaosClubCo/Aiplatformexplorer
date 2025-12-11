/**
 * Application Router
 * 
 * @description Client-side routing with code splitting and lazy loading
 * @module routes/Router
 */

import React, { lazy, Suspense } from 'react';
import { LoadingFallback } from '../components/core/LoadingFallback';
import { useAppContext } from '../context/AppContext';
import { MainLayout } from '../components/layouts/MainLayout';
import { useEventToasts } from '../hooks/useEventToasts';

// Lazy load pages for code splitting
const PlatformExplorer = lazy(() => import('../pages/PlatformExplorer').then(module => ({ default: module.default || module })));

// Placeholder for pages that don't exist yet
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div className="bg-white rounded-lg shadow p-8 text-center">
      <h1 className="text-3xl mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">This page is under construction.</p>
      <p className="text-sm text-gray-500">Coming soon in the next release!</p>
    </div>
  </div>
);

/**
 * Route configuration
 */
const ROUTES = {
  explorer: { 
    component: PlatformExplorer, 
    title: 'Platform Explorer' 
  },
  comparison: { 
    component: () => <PlaceholderPage title="Platform Comparison" />, 
    title: 'Comparison' 
  },
  recommendation: { 
    component: () => <PlaceholderPage title="AI Recommendations" />, 
    title: 'Recommendations' 
  },
  roi: { 
    component: () => <PlaceholderPage title="ROI Calculator" />, 
    title: 'ROI Calculator' 
  },
  analytics: { 
    component: () => <PlaceholderPage title="Analytics Dashboard" />, 
    title: 'Analytics' 
  },
  personas: { 
    component: () => <PlaceholderPage title="Persona Generator" />, 
    title: 'Persona Generator' 
  },
  projects: { 
    component: () => <PlaceholderPage title="Project Dashboard" />, 
    title: 'Projects' 
  },
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * Main Router Component
 * 
 * Simple client-side routing based on active tab
 * Uses Suspense for loading states
 * 
 * @returns {JSX.Element} Router with current page
 */
export default function Router(): JSX.Element {
  const { state } = useAppContext();
  const currentRoute = state.navigation.currentRoute as RouteKey;
  
  // Initialize event-to-toast integration
  useEventToasts();
  
  const route = ROUTES[currentRoute] || ROUTES.explorer;
  const PageComponent = route.component;
  
  // Update document title
  React.useEffect(() => {
    document.title = `${route.title} | AI Platform Explorer`;
  }, [route.title]);
  
  return (
    <MainLayout>
      <Suspense fallback={<LoadingFallback />}>
        <PageComponent />
      </Suspense>
    </MainLayout>
  );
}