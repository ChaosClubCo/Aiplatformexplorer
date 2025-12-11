import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Platform, Filters, ROIInputs, ToastMessage } from './types';
import { PLATFORMS_DATA } from './data/platforms';
import Header from './components/Header';
import Navigation from './components/Navigation';
import FilterBar from './components/FilterBar';
import PlatformCard from './components/PlatformCard';
import PlatformTable from './components/PlatformTable';
import ToastContainer from './components/ToastContainer';
import Footer from './components/Footer';
import Statistics from './components/Statistics';

// Lazy load heavy components for better performance
const FeatureMatrix = lazy(() => import('./components/FeatureMatrix'));
const ROICalculator = lazy(() => import('./components/EnhancedROICalculator'));
const ComparisonSidebar = lazy(() => import('./components/ComparisonSidebar'));
const ComparisonModal = lazy(() => import('./components/ComparisonModal'));
const PlatformModal = lazy(() => import('./components/PlatformModal'));
const Glossary = lazy(() => import('./components/Glossary'));

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-[#EDE8E3] border-t-[#E88A1D] rounded-full animate-spin" />
        <p className="text-sm text-[#8B8279]">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('explorer');
  const [currentView, setCurrentView] = useState<'cards' | 'table'>('cards');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [filters, setFilters] = useState<Filters>({
    provider: 'all',
    category: 'all',
    search: '',
    sortBy: 'marketShare-desc'
  });

  const maxCompare = 4;

  // Filter and sort platforms
  const filteredPlatforms = useMemo(() => {
    let filtered = [...PLATFORMS_DATA];

    // Apply filters
    if (filters.provider !== 'all') {
      filtered = filtered.filter(p => p.providerKey === filters.provider);
    }
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.provider.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    const [sortKey, sortDir] = filters.sortBy.split('-');
    filtered.sort((a, b) => {
      let valA: any, valB: any;

      switch (sortKey) {
        case 'marketShare':
          valA = a.marketSharePercent;
          valB = b.marketSharePercent;
          break;
        case 'price':
          valA = a.pricingValue;
          valB = b.pricingValue;
          break;
        case 'contextWindow':
          valA = a.contextTokens;
          valB = b.contextTokens;
          break;
        case 'compliance':
          valA = a.complianceCount;
          valB = b.complianceCount;
          break;
        case 'growthRate':
          valA = a.growthRate;
          valB = b.growthRate;
          break;
        case 'avgScore':
          valA = Object.values(a.scores).reduce((x, y) => x + y, 0) / Object.values(a.scores).length;
          valB = Object.values(b.scores).reduce((x, y) => x + y, 0) / Object.values(b.scores).length;
          break;
        default:
          valA = a.name.toLowerCase();
          valB = b.name.toLowerCase();
      }

      if (sortDir === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    return filtered;
  }, [filters]);

  const addToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const togglePlatformSelection = (platformId: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platformId)) {
        return prev.filter(id => id !== platformId);
      } else if (prev.length < maxCompare) {
        return [...prev, platformId];
      } else {
        addToast(`Maximum ${maxCompare} platforms can be compared`, 'warning');
        return prev;
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      provider: 'all',
      category: 'all',
      search: '',
      sortBy: 'marketShare-desc'
    });
  };

  const clearComparison = () => {
    setSelectedPlatforms([]);
  };

  const handleCompare = () => {
    if (selectedPlatforms.length < 2) {
      addToast('Select at least 2 platforms to compare', 'warning');
      return;
    }
    setShowComparison(true);
  };

  const exportData = (format: string) => {
    const fileName = `ai-platforms-export.${format}`;
    
    if (format === 'csv') {
      const headers = ['Name', 'Provider', 'Category', 'Market Share', 'Pricing', 'Context Window', 'Compliance Count'];
      const rows = filteredPlatforms.map(p => [
        p.name,
        p.provider,
        p.categoryLabel,
        p.marketShare,
        p.pricing,
        p.contextWindow,
        p.complianceCount
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      downloadFile(csv, fileName, 'text/csv');
    } else if (format === 'json') {
      const data = {
        exportDate: new Date().toISOString(),
        client: 'INT Inc.',
        platformCount: filteredPlatforms.length,
        platforms: filteredPlatforms
      };
      downloadFile(JSON.stringify(data, null, 2), fileName, 'application/json');
    }
    
    addToast(`Exported as ${format.toUpperCase()}`, 'success');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        compareCount={selectedPlatforms.length}
        onCompare={handleCompare}
        onExport={exportData}
        compareDisabled={selectedPlatforms.length < 2}
      />

      <Navigation
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        platformCount={PLATFORMS_DATA.length}
      />

      <main className="flex-1">
        {currentTab === 'explorer' && (
          <div className="pb-8">
            <FilterBar
              filters={filters}
              onFilterChange={setFilters}
              onClearFilters={clearFilters}
              currentView={currentView}
              onViewChange={setCurrentView}
              visibleCount={filteredPlatforms.length}
              totalCount={PLATFORMS_DATA.length}
            />

            <div className="max-w-[1440px] mx-auto px-6">
              <div className="mb-4 text-sm text-[#8B8279]">
                Showing <span className="font-semibold text-[#231C19]">{filteredPlatforms.length}</span> of{' '}
                <span className="font-semibold text-[#231C19]">{PLATFORMS_DATA.length}</span> platforms
              </div>

              <Statistics />

              {currentView === 'cards' ? (
                <div className="grid grid-cols-[repeat(auto-fill,minmax(340px,1fr))] gap-5">
                  {filteredPlatforms.map(platform => (
                    <PlatformCard
                      key={platform.id}
                      platform={platform}
                      isSelected={selectedPlatforms.includes(platform.id)}
                      onToggleSelect={togglePlatformSelection}
                      onViewDetails={setSelectedPlatform}
                      disabled={!selectedPlatforms.includes(platform.id) && selectedPlatforms.length >= maxCompare}
                    />
                  ))}
                </div>
              ) : (
                <PlatformTable
                  platforms={filteredPlatforms}
                  selectedPlatforms={selectedPlatforms}
                  onToggleSelect={togglePlatformSelection}
                  onViewDetails={setSelectedPlatform}
                  maxCompare={maxCompare}
                />
              )}
            </div>
          </div>
        )}

        {currentTab === 'matrix' && (
          <div className="py-8">
            <Suspense fallback={<LoadingFallback />}>
              <FeatureMatrix />
            </Suspense>
          </div>
        )}

        {currentTab === 'financial' && (
          <div className="py-8">
            <Suspense fallback={<LoadingFallback />}>
              <ROICalculator onToast={addToast} />
            </Suspense>
          </div>
        )}

        {currentTab === 'assessment' && (
          <div className="py-8 max-w-[1200px] mx-auto px-6">
            <div className="mb-6">
              <h2 className="text-3xl mb-2 font-serif">AI Readiness Assessment</h2>
              <p className="text-lg text-[#5C524D]">
                Evaluate your organization's readiness for AI adoption across key dimensions.
              </p>
            </div>

            <div className="bg-[#E0F2FE] border border-[#0284C7] rounded-xl p-6 text-center">
              <p className="text-lg text-[#0284C7] mb-4">📋 Assessment Module</p>
              <p className="text-[#5C524D]">
                The full AI Readiness Assessment wizard will be available in version 3.2. In the meantime, use the
                Platform Explorer and ROI Calculator to evaluate your options.
              </p>
            </div>
          </div>
        )}

        {currentTab === 'glossary' && (
          <div className="py-8">
            <Suspense fallback={<LoadingFallback />}>
              <Glossary />
            </Suspense>
          </div>
        )}
      </main>

      <Footer onNavigate={setCurrentTab} />

      <Suspense fallback={<LoadingFallback />}>
        <ComparisonSidebar
          selectedPlatforms={selectedPlatforms}
          platforms={PLATFORMS_DATA}
          maxCompare={maxCompare}
          onRemove={togglePlatformSelection}
          onClear={clearComparison}
          onCompare={handleCompare}
        />
      </Suspense>

      {selectedPlatform && (
        <Suspense fallback={<LoadingFallback />}>
          <PlatformModal
            platform={selectedPlatform}
            onClose={() => setSelectedPlatform(null)}
            isSelected={selectedPlatforms.includes(selectedPlatform.id)}
            onToggleSelect={togglePlatformSelection}
          />
        </Suspense>
      )}

      {showComparison && (
        <Suspense fallback={<LoadingFallback />}>
          <ComparisonModal
            platformIds={selectedPlatforms}
            platforms={PLATFORMS_DATA}
            onClose={() => setShowComparison(false)}
            onExport={exportData}
          />
        </Suspense>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}