import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { Scenario, ScenarioData } from '../types/scenario';
import { scenarioService } from '../services/scenarioService';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface ScenarioState {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  comparisonMode: boolean;
  comparisonTargetId: string | null;
  isLoading: boolean;
  error: string | null;
}

type ScenarioAction =
  | { type: 'SET_SCENARIOS'; payload: Scenario[] }
  | { type: 'ADD_SCENARIO'; payload: Scenario }
  | { type: 'UPDATE_SCENARIO'; payload: Scenario }
  | { type: 'DELETE_SCENARIO'; payload: string }
  | { type: 'SET_ACTIVE'; payload: string | null }
  | { type: 'SET_COMPARISON'; payload: { mode: boolean; targetId: string | null } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string };

const initialState: ScenarioState = {
  scenarios: [],
  activeScenarioId: null,
  comparisonMode: false,
  comparisonTargetId: null,
  isLoading: false,
  error: null,
};

function scenarioReducer(state: ScenarioState, action: ScenarioAction): ScenarioState {
  switch (action.type) {
    case 'SET_SCENARIOS':
      return { ...state, scenarios: action.payload, isLoading: false };
    case 'ADD_SCENARIO':
      return { ...state, scenarios: [action.payload, ...state.scenarios] };
    case 'UPDATE_SCENARIO':
      return {
        ...state,
        scenarios: state.scenarios.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SCENARIO':
      return {
        ...state,
        scenarios: state.scenarios.filter(s => s.id !== action.payload),
        activeScenarioId: state.activeScenarioId === action.payload ? null : state.activeScenarioId
      };
    case 'SET_ACTIVE':
      return { ...state, activeScenarioId: action.payload };
    case 'SET_COMPARISON':
      return { 
        ...state, 
        comparisonMode: action.payload.mode, 
        comparisonTargetId: action.payload.targetId 
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

interface ScenarioContextType {
  state: ScenarioState;
  loadScenarios: () => Promise<void>;
  saveScenario: (name: string, type: Scenario['type'], data: ScenarioData, description?: string, existingId?: string) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
  activateScenario: (id: string) => void;
  toggleComparison: (targetId: string | null) => void;
  getActiveScenario: () => Scenario | undefined;
}

const ScenarioContext = createContext<ScenarioContextType | undefined>(undefined);

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(scenarioReducer, initialState);
  const { user } = useAuth();

  const loadScenarios = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const data = await scenarioService.list();
      dispatch({ type: 'SET_SCENARIOS', payload: data });
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load scenarios' });
      toast.error('Failed to load scenarios');
    }
  };

  useEffect(() => {
    loadScenarios();
  }, []);

  const saveScenario = async (
    name: string, 
    type: Scenario['type'], 
    data: ScenarioData, 
    description?: string, 
    existingId?: string
  ) => {
    if (!user) {
      toast.error('You must be logged in to save scenarios');
      return;
    }

    try {
      const scenario = await scenarioService.save(name, type, data, user.id, description, existingId);
      if (existingId) {
        dispatch({ type: 'UPDATE_SCENARIO', payload: scenario });
        toast.success('Scenario updated successfully');
      } else {
        dispatch({ type: 'ADD_SCENARIO', payload: scenario });
        toast.success('New scenario saved successfully');
      }
    } catch (err) {
      toast.error('Failed to save scenario');
      console.error(err);
    }
  };

  const deleteScenario = async (id: string) => {
    try {
      await scenarioService.delete(id);
      dispatch({ type: 'DELETE_SCENARIO', payload: id });
      toast.success('Scenario deleted');
    } catch (err) {
      toast.error('Failed to delete scenario');
    }
  };

  const activateScenario = (id: string) => {
    dispatch({ type: 'SET_ACTIVE', payload: id });
    const scenario = state.scenarios.find(s => s.id === id);
    if (scenario) {
      toast.info(`Loaded scenario: ${scenario.name}`);
    }
  };

  const toggleComparison = (targetId: string | null) => {
    dispatch({ 
      type: 'SET_COMPARISON', 
      payload: { mode: !!targetId, targetId } 
    });
  };

  const getActiveScenario = () => state.scenarios.find(s => s.activeScenarioId === s.id);

  const value = useMemo(() => ({
    state,
    loadScenarios,
    saveScenario,
    deleteScenario,
    activateScenario,
    toggleComparison,
    getActiveScenario
  }), [state, user]);

  return (
    <ScenarioContext.Provider value={value}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const context = useContext(ScenarioContext);
  if (context === undefined) {
    throw new Error('useScenario must be used within a ScenarioProvider');
  }
  return context;
}
