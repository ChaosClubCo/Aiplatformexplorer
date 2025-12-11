/**
 * Platform Explorer Page
 * Main platform browsing and filtering interface
 * 
 * @module pages/PlatformExplorer
 */

import React, { useMemo } from 'react';
import { useAppState } from '../../hooks/useAppState';
import { filterPlatforms, sortPlatforms } from '../../utils/platform';
import { FilterBar } from '../../features/platform-explorer/components/FilterBar';
import { PlatformCard } from '../../features/platform-explorer/components/PlatformCard';
import { PlatformTable } from '../../features/platform-explorer/components/PlatformTable';
import { Statistics } from '../../features/platform-explorer/components/Statistics';
import { ViewToggle } from '../../components/common/ViewToggle';
import { Container } from '../../components/layout/Container';

/**
 * Platform Explorer Page Component
 */
export function PlatformExplorer() {
  const { state, actions } = useAppState();
  
  // Get filtered and sorted platforms
  const displayedPlatforms = useMemo(() => {
    const filtered = filterPlatforms(state.platforms.all, state.filters);
    const sorted = sortPlatforms(filtered, state.filters.sortBy);
    return sorted;
  }, [state.platforms.all, state.filters]);
  
  // Statistics
  const stats = useMemo(() => ({
    total: state.platforms.all.length,
    filtered: displayedPlatforms.length,
    providers: new Set(state.platforms.all.map(p => p.provider)).size,
    categories: new Set(state.platforms.all.map(p => p.category)).size,
  }), [state.platforms.all, displayedPlatforms]);
  
  return (
    <Container>
      <div className="py-8 space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-4xl">AI Platform Explorer</h1>
          <p className="text-gray-600 text-lg">
            Compare {stats.total} AI platforms across {stats.categories} categories from {stats.providers} leading providers
          </p>
        </div>
        
        {/* Statistics */}
        <Statistics stats={stats} />
        
        {/* Filter Bar */}
        <FilterBar />
        
        {/* View Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{displayedPlatforms.length}</span> of {stats.total} platforms
          </div>
          
          <ViewToggle
            currentView={state.ui.currentView}
            onChange={actions.ui.setView}
          />
        </div>
        
        {/* Platforms Display */}
        {displayedPlatforms.length > 0 ? (
          state.ui.currentView === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedPlatforms.map(platform => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  isSelected={state.comparison.selected.includes(platform.id)}
                  onSelect={() => actions.comparison.toggle(platform.id)}
                  onView={() => actions.ui.setPlatformModal(platform)}
                />
              ))}
            </div>
          ) : (
            <PlatformTable
              platforms={displayedPlatforms}
              selectedIds={state.comparison.selected}
              onSelect={actions.comparison.toggle}
              onView={actions.ui.setPlatformModal}
            />
          )
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl mb-2">No platforms found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={actions.filters.clear}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </Container>
  );
}

export default PlatformExplorer;
