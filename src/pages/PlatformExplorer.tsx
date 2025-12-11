/**
 * Platform Explorer Page
 * 
 * @description Main platform browsing and filtering interface
 * @module pages/PlatformExplorer
 */

import React, { useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Container, PageHeader } from '../components/layouts/MainLayout';
import { filterPlatforms, sortPlatforms } from '../utils/platform/filterUtils';
import { analyticsService } from '../services/analyticsService';

// Import existing components directly
import FilterBar from '../components/FilterBar';
import PlatformCard from '../components/PlatformCard';
import PlatformTable from '../components/PlatformTable';
import Statistics from '../components/Statistics';
import ViewToggle from '../components/ViewToggle';

/**
 * Platform Explorer Page Component
 * 
 * Main page for browsing and filtering AI platforms
 * Implements filtering, sorting, and view switching
 * 
 * @returns {JSX.Element} Platform Explorer page
 */
export default function PlatformExplorer(): JSX.Element {
  const { state, actions } = useAppContext();
  
  // Filter and sort platforms based on current filters
  const filteredAndSortedPlatforms = useMemo(() => {
    const filtered = filterPlatforms(state.platforms.all, state.filters);
    const sorted = sortPlatforms(filtered, state.filters.sortBy);
    return sorted;
  }, [state.platforms.all, state.filters]);
  
  // Update filtered platforms in state
  useEffect(() => {
    actions.setFilteredPlatforms(filteredAndSortedPlatforms);
  }, [filteredAndSortedPlatforms, actions]);
  
  // Track page view
  useEffect(() => {
    analyticsService.trackPageView('platform-explorer');
  }, []);
  
  // Calculate statistics
  const stats = useMemo(() => ({
    total: state.platforms.all.length,
    filtered: filteredAndSortedPlatforms.length,
    selected: state.platforms.selected.length,
    providers: new Set(state.platforms.all.map(p => p.provider)).size,
    categories: new Set(state.platforms.all.map(p => p.category)).size,
  }), [state.platforms, filteredAndSortedPlatforms]);
  
  // Handle platform selection
  const handlePlatformSelect = (id: string) => {
    actions.togglePlatformSelection(id);
    analyticsService.trackEvent('platform', 'select', id);
  };
  
  // Handle platform view
  const handlePlatformView = (platform: any) => {
    actions.showPlatformModal(platform.id);
    analyticsService.trackEvent('platform', 'view', platform.id);
  };
  
  // Handle view change
  const handleViewChange = (view: 'cards' | 'table') => {
    actions.setView(view);
    analyticsService.trackEvent('ui', 'view-change', view);
  };
  
  // Handle filter change
  const handleFilterChange = (newFilters: any) => {
    actions.setFilters(newFilters);
    analyticsService.trackEvent('filter', 'change', JSON.stringify(newFilters));
  };
  
  // Handle clear filters
  const handleClearFilters = () => {
    actions.resetFilters();
    analyticsService.trackEvent('filter', 'clear');
  };
  
  return (
    <Container className="py-8">
      {/* Page Header */}
      <PageHeader
        title="AI Platform Explorer"
        description={`Compare ${stats.total} AI platforms across ${stats.categories} categories from ${stats.providers} leading providers`}
        actions={
          <ViewToggle
            currentView={state.ui.currentView}
            onChange={handleViewChange}
          />
        }
      />
      
      {/* Statistics */}
      <Statistics stats={stats} />
      
      {/* Filter Bar */}
      <FilterBar
        filters={state.filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        currentView={state.ui.currentView}
        onViewChange={handleViewChange}
        visibleCount={filteredAndSortedPlatforms.length}
        totalCount={stats.total}
      />
      
      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredAndSortedPlatforms.length}</span> of {stats.total} platforms
          {state.platforms.selected.length > 0 && (
            <span className="ml-2">
              • <span className="font-semibold text-orange-600">{state.platforms.selected.length}</span> selected
            </span>
          )}
        </div>
        
        {/* Clear Selection Button */}
        {state.platforms.selected.length > 0 && (
          <button
            onClick={() => actions.clearPlatformSelection()}
            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
          >
            Clear Selection
          </button>
        )}
      </div>
      
      {/* Platforms Display */}
      {filteredAndSortedPlatforms.length > 0 ? (
        state.ui.currentView === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedPlatforms.map(platform => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                isSelected={state.platforms.selected.includes(platform.id)}
                onToggleSelect={handlePlatformSelect}
                onViewDetails={handlePlatformView}
              />
            ))}
          </div>
        ) : (
          <PlatformTable
            platforms={filteredAndSortedPlatforms}
            selectedIds={state.platforms.selected}
            onToggleSelect={handlePlatformSelect}
            onViewDetails={handlePlatformView}
          />
        )
      ) : (
        <EmptyState onReset={() => actions.resetFilters()} />
      )}
    </Container>
  );
}

/**
 * Empty State Component
 * 
 * Displayed when no platforms match the current filters
 */
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="text-center py-16 bg-white rounded-lg shadow">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      
      <h3 className="text-xl mb-2">No platforms found</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        No platforms match your current filters. Try adjusting your search criteria or clearing all filters.
      </p>
      
      <button
        onClick={onReset}
        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        Clear All Filters
      </button>
    </div>
  );
}