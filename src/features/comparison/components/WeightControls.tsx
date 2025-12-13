import React from 'react';
import { Slider } from '../../../components/ui/slider';
import { useAppContext } from '../../../context/AppContext';
import { useAuth } from '../../../contexts/AuthContext';
import { WeightConfig } from '../../../types';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

export function WeightControls() {
  const { state, actions } = useAppContext();
  const { hasPermission } = useAuth();
  const { weights } = state.preferences;
  
  const canEdit = hasPermission('edit_weights');

  const handleWeightChange = (key: keyof WeightConfig, value: number[]) => {
    if (!canEdit) return;
    actions.setWeights({
      ...weights,
      [key]: value[0]
    });
  };

  const categories: { key: keyof WeightConfig; label: string; color: string }[] = [
    { key: 'capabilities', label: 'Core Capabilities', color: 'bg-blue-500' },
    { key: 'security', label: 'Security & Compliance', color: 'bg-green-500' },
    { key: 'cost', label: 'Cost Efficiency', color: 'bg-orange-500' },
    { key: 'customization', label: 'Customization & API', color: 'bg-purple-500' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 border border-[#EDE8E3] rounded-xl mb-6 relative"
    >
      {!canEdit && (
        <div className="absolute top-2 right-2 text-gray-400 flex items-center gap-1 text-xs">
          <Lock className="w-3 h-3" />
          Read-only
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-lg">
          Custom Evaluation Weighting
        </h3>
        <button 
          onClick={() => canEdit && actions.setWeights({ capabilities: 50, security: 50, cost: 50, customization: 50 })}
          disabled={!canEdit}
          className={`text-xs ${canEdit ? 'text-[#E88A1D] hover:underline' : 'text-gray-400 cursor-not-allowed'}`}
        >
          Reset Defaults
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
        {categories.map(({ key, label, color }) => (
          <div key={key} className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-[#5C524D]">
                {label}
              </label>
              <span className={`text-sm font-bold ${color.replace('bg-', 'text-')}`}>
                {weights[key]}%
              </span>
            </div>
            <Slider
              value={[weights[key]]}
              onValueChange={(val) => handleWeightChange(key, val)}
              max={100}
              step={5}
              disabled={!canEdit}
              className={canEdit ? "[&>.bg-primary]:bg-[#E88A1D]" : "opacity-60 cursor-not-allowed"}
            />
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${color} ${canEdit ? 'opacity-80' : 'opacity-40'} transition-all duration-300`} 
                style={{ width: `${weights[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
