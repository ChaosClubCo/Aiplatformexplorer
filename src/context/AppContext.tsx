import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Platform, Filters, ToastMessage } from '../types';
import { PLATFORMS_DATA } from '../data/platforms';
import { APP_CONFIG } from '../config/app.config';
import { TABS, TOAST_TYPES } from '../constants';
import type { Tab, ToastType } from '../constants';

/**
 * Application State Interface
 */
interface AppState {
  // Navigation
  currentTab: Tab;
  
  // Platform Data
  platforms: Platform[];
  selectedPlatforms: string[];
  selectedPlatform: Platform | null;
  
  // Filters
  filters: Filters;
  currentView: 'cards' | 'table';
  
  // UI State
  toasts: ToastMessage[];
  showComparison: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Application Actions Interface
 */
interface AppActions {
  // Navigation
  setCurrentTab: (tab: Tab) => void;
  
  // Platform Selection
  togglePlatformSelection: (platformId: string) => void;
  clearPlatformSelection: () => void;
  setSelectedPlatform: (platform: Platform | null) => void;
  
  // Filters
  setFilters: (filters: Filters) => void;
  clearFilters: () => void;
  setCurrentView: (view: 'cards' | 'table') => void;
  
  // Comparison
  setShowComparison: (show: boolean) => void;
  handleCompare: () => void;
  
  // Toasts
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  
  // Export
  exportData: (format: string) => void;
  
  // Loading & Error
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
}

/**
 * Combined App Context Type
 */
type AppContextType = AppState & AppActions;

/**
 * Initial State
 */
const initialState: AppState = {
  currentTab: TABS.EXPLORER,
  platforms: PLATFORMS_DATA,
  selectedPlatforms: [],
  selectedPlatform: null,
  filters: {
    provider: 'all',
    category: 'all',
    search: '',
    sortBy: 'marketShare-desc',
  },
  currentView: APP_CONFIG.ui.defaultView,
  toasts: [],
  showComparison: false,
  isLoading: false,
  error: null,
};

/**
 * App Context
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Provider Component
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  // Navigation
  const setCurrentTab = useCallback((tab: Tab) => {
    setState(prev => ({ ...prev, currentTab: tab }));
  }, []);

  // Platform Selection
  const togglePlatformSelection = useCallback((platformId: string) => {
    setState(prev => {
      const { selectedPlatforms } = prev;
      const maxCompare = APP_CONFIG.ui.maxPlatformsToCompare;

      if (selectedPlatforms.includes(platformId)) {
        return {
          ...prev,
          selectedPlatforms: selectedPlatforms.filter(id => id !== platformId),
        };
      } else if (selectedPlatforms.length < maxCompare) {
        return {
          ...prev,
          selectedPlatforms: [...selectedPlatforms, platformId],
        };
      } else {
        // Add warning toast
        addToast(`Maximum ${maxCompare} platforms can be compared`, TOAST_TYPES.WARNING);
        return prev;
      }
    });
  }, []);

  const clearPlatformSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedPlatforms: [] }));
  }, []);

  const setSelectedPlatform = useCallback((platform: Platform | null) => {
    setState(prev => ({ ...prev, selectedPlatform: platform }));
  }, []);

  // Filters
  const setFilters = useCallback((filters: Filters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: initialState.filters,
    }));
  }, []);

  const setCurrentView = useCallback((view: 'cards' | 'table') => {
    setState(prev => ({ ...prev, currentView: view }));
  }, []);

  // Comparison
  const setShowComparison = useCallback((show: boolean) => {
    setState(prev => ({ ...prev, showComparison: show }));
  }, []);

  const handleCompare = useCallback(() => {
    if (state.selectedPlatforms.length < 2) {
      addToast('Select at least 2 platforms to compare', TOAST_TYPES.WARNING);
      return;
    }
    setShowComparison(true);
  }, [state.selectedPlatforms.length]);

  // Toasts
  const addToast = useCallback((message: string, type: ToastType = TOAST_TYPES.INFO) => {
    const id = Math.random().toString(36).substring(7);
    const toast: ToastMessage = { id, message, type };
    
    setState(prev => ({
      ...prev,
      toasts: [...prev.toasts, toast],
    }));

    // Auto-remove after duration
    setTimeout(() => {
      removeToast(id);
    }, APP_CONFIG.ui.toastDuration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      toasts: prev.toasts.filter(t => t.id !== id),
    }));
  }, []);

  // Export
  const exportData = useCallback((format: string) => {
    const fileName = `${APP_CONFIG.export.defaultFileName}.${format}`;
    
    if (format === 'csv') {
      const headers = ['Name', 'Provider', 'Category', 'Market Share', 'Pricing', 'Context Window', 'Compliance Count'];
      const rows = state.platforms.map(p => [
        p.name,
        p.provider,
        p.categoryLabel,
        p.marketShare,
        p.pricing,
        p.contextWindow,
        p.complianceCount,
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
      downloadFile(csv, fileName, 'text/csv');
    } else if (format === 'json') {
      const data = {
        exportDate: new Date().toISOString(),
        client: 'INT Inc.',
        platformCount: state.platforms.length,
        platforms: state.platforms,
      };
      downloadFile(JSON.stringify(data, null, 2), fileName, 'application/json');
    }
    
    addToast(`Exported as ${format.toUpperCase()}`, TOAST_TYPES.SUCCESS);
  }, [state.platforms]);

  // Loading & Error
  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState(prev => ({ ...prev, error }));
    if (error) {
      addToast(error.message, TOAST_TYPES.ERROR);
    }
  }, []);

  // Context value
  const value: AppContextType = {
    ...state,
    setCurrentTab,
    togglePlatformSelection,
    clearPlatformSelection,
    setSelectedPlatform,
    setFilters,
    clearFilters,
    setCurrentView,
    setShowComparison,
    handleCompare,
    addToast,
    removeToast,
    exportData,
    setLoading,
    setError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to use App Context
 */
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

/**
 * Helper function to download file
 */
function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
