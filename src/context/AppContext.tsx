/**
 * Application Context
 * 
 * @description Global state management using React Context API
 * @module context/AppContext
 * @architecture Flux-inspired unidirectional data flow
 */

import React, { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { Platform, Filters, WeightConfig, Stack } from '../types';
import { PLATFORMS_DATA } from '../data/platforms';
import { storageService } from '../services/storageService';
import { stackService } from '../services/stackPersistence';

/**
 * Application State Interface
 */
export interface AppState {
  // Platform data
  platforms: {
    all: Platform[];
    filtered: Platform[];
    selected: string[];
  };
  
  // Stacks (Saved Collections)
  stacks: Stack[];

  // Filters
  filters: Filters;
  
  // UI state
  ui: {
    currentView: 'cards' | 'table';
    showComparison: boolean;
    showPlatformModal: boolean;
    selectedPlatformId: string | null;
    loading: boolean;
    error: string | null;
  };
  
  // Navigation
  navigation: {
    currentRoute: string;
    history: string[];
  };
  
  // User preferences
  preferences: {
    theme: 'light' | 'dark';
    language: 'en';
    itemsPerPage: number;
    weights: WeightConfig;
  };
}

/**
 * Action Types
 */
type Action =
  // Platform actions
  | { type: 'SET_PLATFORMS'; payload: Platform[] }
  | { type: 'SET_FILTERED_PLATFORMS'; payload: Platform[] }
  | { type: 'TOGGLE_PLATFORM_SELECTION'; payload: string }
  | { type: 'CLEAR_PLATFORM_SELECTION' }
  | { type: 'SET_PLATFORM_SELECTION'; payload: string[] }
  
  // Stack actions
  | { type: 'SET_STACKS'; payload: Stack[] }
  | { type: 'ADD_STACK'; payload: Stack }
  | { type: 'DELETE_STACK'; payload: string }

  // Filter actions
  | { type: 'SET_FILTERS'; payload: Partial<Filters> }
  | { type: 'RESET_FILTERS' }
  
  // UI actions
  | { type: 'SET_VIEW'; payload: 'cards' | 'table' }
  | { type: 'TOGGLE_COMPARISON' }
  | { type: 'SHOW_PLATFORM_MODAL'; payload: string }
  | { type: 'HIDE_PLATFORM_MODAL' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  
  // Navigation actions
  | { type: 'NAVIGATE'; payload: string }
  
  // Preference actions
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_ITEMS_PER_PAGE'; payload: number }
  | { type: 'SET_WEIGHTS'; payload: WeightConfig };

/**
 * Initial State
 */
const initialState: AppState = {
  platforms: {
    all: PLATFORMS_DATA,
    filtered: PLATFORMS_DATA,
    selected: [],
  },
  stacks: [],
  filters: {
    provider: 'all',
    category: 'all',
    search: '',
    sortBy: 'marketShare-desc',
  },
  ui: {
    currentView: 'cards',
    showComparison: false,
    showPlatformModal: false,
    selectedPlatformId: null,
    loading: false,
    error: null,
  },
  navigation: {
    currentRoute: 'explorer',
    history: ['explorer'],
  },
  preferences: {
    theme: 'light',
    language: 'en',
    itemsPerPage: 12,
    weights: {
      capabilities: 50,
      security: 50,
      cost: 50,
      customization: 50,
    },
  },
};

/**
 * Reducer Function
 * 
 * Handles all state mutations following Flux pattern
 */
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    // Platform actions
    case 'SET_PLATFORMS':
      return {
        ...state,
        platforms: {
          ...state.platforms,
          all: action.payload,
        },
      };
      
    case 'SET_FILTERED_PLATFORMS':
      return {
        ...state,
        platforms: {
          ...state.platforms,
          filtered: action.payload,
        },
      };
      
    case 'TOGGLE_PLATFORM_SELECTION': {
      const isSelected = state.platforms.selected.includes(action.payload);
      const selected = isSelected
        ? state.platforms.selected.filter(id => id !== action.payload)
        : [...state.platforms.selected, action.payload];
      
      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected,
        },
      };
    }
    
    case 'CLEAR_PLATFORM_SELECTION':
      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected: [],
        },
      };
      
    case 'SET_PLATFORM_SELECTION':
      return {
        ...state,
        platforms: {
          ...state.platforms,
          selected: action.payload,
        },
      };

    // Stack Actions
    case 'SET_STACKS':
      return { ...state, stacks: action.payload };

    case 'ADD_STACK': {
      const newStacks = [...state.stacks, action.payload];
      stackService.save(action.payload); // Side effect: persist
      return { ...state, stacks: newStacks };
    }

    case 'DELETE_STACK': {
      const newStacks = state.stacks.filter(s => s.id !== action.payload);
      stackService.delete(action.payload); // Side effect: persist
      return { ...state, stacks: newStacks };
    }
    
    // Filter actions
    case 'SET_FILTERS':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
      
    case 'RESET_FILTERS':
      return {
        ...state,
        filters: initialState.filters,
      };
    
    // UI actions
    case 'SET_VIEW':
      return {
        ...state,
        ui: {
          ...state.ui,
          currentView: action.payload,
        },
      };
      
    case 'TOGGLE_COMPARISON':
      return {
        ...state,
        ui: {
          ...state.ui,
          showComparison: !state.ui.showComparison,
        },
      };
      
    case 'SHOW_PLATFORM_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          showPlatformModal: true,
          selectedPlatformId: action.payload,
        },
      };
      
    case 'HIDE_PLATFORM_MODAL':
      return {
        ...state,
        ui: {
          ...state.ui,
          showPlatformModal: false,
          selectedPlatformId: null,
        },
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };
      
    case 'SET_ERROR':
      return {
        ...state,
        ui: {
          ...state.ui,
          error: action.payload,
        },
      };
    
    // Navigation actions
    case 'NAVIGATE': {
      const history = [...state.navigation.history];
      if (history[history.length - 1] !== action.payload) {
        history.push(action.payload);
      }
      
      return {
        ...state,
        navigation: {
          currentRoute: action.payload,
          history,
        },
      };
    }
    
    // Preference actions
    case 'SET_THEME':
      storageService.set('theme', action.payload);
      return {
        ...state,
        preferences: {
          ...state.preferences,
          theme: action.payload,
        },
      };
      
    case 'SET_ITEMS_PER_PAGE':
      storageService.set('itemsPerPage', action.payload);
      return {
        ...state,
        preferences: {
          ...state.preferences,
          itemsPerPage: action.payload,
        },
      };

    case 'SET_WEIGHTS':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          weights: action.payload,
        },
      };
    
    default:
      return state;
  }
}

/**
 * Context Type
 */
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  actions: {
    // Platform actions
    setPlatforms: (platforms: Platform[]) => void;
    setFilteredPlatforms: (platforms: Platform[]) => void;
    togglePlatformSelection: (id: string) => void;
    clearPlatformSelection: () => void;
    setPlatformSelection: (ids: string[]) => void;
    
    // Stack actions
    addStack: (stack: Stack) => void;
    deleteStack: (id: string) => void;

    // Filter actions
    setFilters: (filters: Partial<Filters>) => void;
    resetFilters: () => void;
    
    // UI actions
    setView: (view: 'cards' | 'table') => void;
    toggleComparison: () => void;
    showPlatformModal: (id: string) => void;
    hidePlatformModal: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    
    // Navigation actions
    navigate: (route: string) => void;
    
    // Preference actions
    setTheme: (theme: 'light' | 'dark') => void;
    setItemsPerPage: (count: number) => void;
    setWeights: (weights: WeightConfig) => void;
  };
}

/**
 * Create Context
 */
const AppContext = createContext<AppContextType | undefined>(undefined);

/**
 * App Provider Component
 * 
 * Provides global state to all child components
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  // Load initial preferences from storage
  const storedTheme = storageService.get<'light' | 'dark'>('theme');
  const storedItemsPerPage = storageService.get<number>('itemsPerPage');
  
  // Load stacks
  const storedStacks = stackService.getAll();

  const initialStateWithPreferences: AppState = {
    ...initialState,
    stacks: storedStacks,
    preferences: {
      ...initialState.preferences,
      theme: storedTheme || initialState.preferences.theme,
      itemsPerPage: storedItemsPerPage || initialState.preferences.itemsPerPage,
    },
  };
  
  const [state, dispatch] = useReducer(appReducer, initialStateWithPreferences);
  
  // Action creators (memoized)
  const actions = useMemo(() => ({
    // Platform actions
    setPlatforms: (platforms: Platform[]) =>
      dispatch({ type: 'SET_PLATFORMS', payload: platforms }),
    
    setFilteredPlatforms: (platforms: Platform[]) =>
      dispatch({ type: 'SET_FILTERED_PLATFORMS', payload: platforms }),
    
    togglePlatformSelection: (id: string) =>
      dispatch({ type: 'TOGGLE_PLATFORM_SELECTION', payload: id }),
    
    clearPlatformSelection: () =>
      dispatch({ type: 'CLEAR_PLATFORM_SELECTION' }),
    
    setPlatformSelection: (ids: string[]) =>
      dispatch({ type: 'SET_PLATFORM_SELECTION', payload: ids }),
    
    // Stack actions
    addStack: (stack: Stack) => 
      dispatch({ type: 'ADD_STACK', payload: stack }),
      
    deleteStack: (id: string) => 
      dispatch({ type: 'DELETE_STACK', payload: id }),

    // Filter actions
    setFilters: (filters: Partial<Filters>) =>
      dispatch({ type: 'SET_FILTERS', payload: filters }),
    
    resetFilters: () =>
      dispatch({ type: 'RESET_FILTERS' }),
    
    // UI actions
    setView: (view: 'cards' | 'table') =>
      dispatch({ type: 'SET_VIEW', payload: view }),
    
    toggleComparison: () =>
      dispatch({ type: 'TOGGLE_COMPARISON' }),
    
    showPlatformModal: (id: string) =>
      dispatch({ type: 'SHOW_PLATFORM_MODAL', payload: id }),
    
    hidePlatformModal: () =>
      dispatch({ type: 'HIDE_PLATFORM_MODAL' }),
    
    setLoading: (loading: boolean) =>
      dispatch({ type: 'SET_LOADING', payload: loading }),
    
    setError: (error: string | null) =>
      dispatch({ type: 'SET_ERROR', payload: error }),
    
    // Navigation actions
    navigate: (route: string) =>
      dispatch({ type: 'NAVIGATE', payload: route }),
    
    // Preference actions
    setTheme: (theme: 'light' | 'dark') =>
      dispatch({ type: 'SET_THEME', payload: theme }),
    
    setItemsPerPage: (count: number) =>
      dispatch({ type: 'SET_ITEMS_PER_PAGE', payload: count }),

    setWeights: (weights: WeightConfig) =>
      dispatch({ type: 'SET_WEIGHTS', payload: weights }),
  }), []);
  
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    actions,
  }), [state, actions]);
  
  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

/**
 * Hook to use App Context
 * 
 * @throws {Error} If used outside of AppProvider
 * @returns {AppContextType} Application context
 */
export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  
  return context;
}

/**
 * Selector hook for optimized re-renders
 * 
 * @template T - Selected value type
 * @param {function} selector - Function to select slice of state
 * @returns {T} Selected state value
 */
export function useAppSelector<T>(selector: (state: AppState) => T): T {
  const { state } = useAppContext();
  return useMemo(() => selector(state), [state, selector]);
}
