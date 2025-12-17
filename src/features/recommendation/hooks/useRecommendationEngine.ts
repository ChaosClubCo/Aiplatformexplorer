import { useState, useCallback } from 'react';
import { intelligenceService } from '../../../services/intelligenceService';
import { RecommendationRequestSchema } from '../../../utils/validation';
import { MatchResult } from '../../../types/intelligence';

export function useRecommendationEngine(onToast: (msg: string, type: 'success' | 'error') => void) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  
  // State for inputs
  const [department, setDepartment] = useState<string>('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [ecosystem, setEcosystem] = useState<string>('agnostic');

  const generateRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Prepare Request
      const request = {
        departments: department ? [department] : [],
        capabilities,
        ecosystemPreference: ecosystem
      };

      // 2. Call Service (which handles validation & circuit breaking)
      const data = await intelligenceService.getRecommendations(request as any);
      
      setResults(data);
      onToast('Strategic Analysis Complete', 'success');
      
    } catch (error: any) {
      console.error('Recommendation failed', error);
      onToast(error.message || 'Failed to generate recommendations', 'error');
    } finally {
      setLoading(false);
    }
  }, [department, capabilities, ecosystem, onToast]);

  const toggleCapability = (cap: string) => {
    setCapabilities(prev => 
      prev.includes(cap) 
        ? prev.filter(c => c !== cap) 
        : [...prev, cap]
    );
  };

  const reset = () => {
    setResults(null);
    setDepartment('');
    setCapabilities([]);
    setEcosystem('agnostic');
  };

  return {
    loading,
    results,
    inputs: {
      department,
      capabilities,
      ecosystem
    },
    actions: {
      setDepartment,
      setEcosystem,
      toggleCapability,
      generateRecommendations,
      reset
    }
  };
}
