import React from 'react';
import { Slider } from '../../../components/ui/slider';
import { useAppContext } from '../../../context/AppContext';
import { WeightConfig } from '../../../types';
import { motion } from 'motion/react';

export function WeightControls() {
  const { state, actions } = useAppContext();
  const { weights } = state.preferences;

  const handleWeightChange = (key: keyof WeightConfig, value: number[]) => {
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
      className="bg-white p-6 border border-[#EDE8E3] rounded-xl mb-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-lg">
          Custom Evaluation Weighting
        </h3>
        <button 
          onClick={() => actions.setWeights({ capabilities: 50, security: 50, cost: 50, customization: 50 })}
          className="text-xs text-[#E88A1D] hover:underline"
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
              className="[&>.bg-primary]:bg-[#E88A1D]"
            />
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${color} opacity-80 transition-all duration-300`} 
                style={{ width: `${weights[key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
