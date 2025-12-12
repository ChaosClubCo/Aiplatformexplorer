import React from 'react';
import { Trash2 } from 'lucide-react';
import { usePersonaStore } from '../stores/usePersonaStore';
import { PersonaTemplate } from '../model/types';

export const PersonaGoalsForm: React.FC = () => {
  const { persona, updateArrayItem, addArrayItem, removeArrayItem } = usePersonaStore();

  const renderList = (
    label: string,
    field: keyof PersonaTemplate,
    placeholder: string
  ) => (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm">{label}</label>
        <button
          onClick={() => addArrayItem(field)}
          className="text-sm text-orange-500 hover:text-orange-600"
        >
          + Add {label.replace(/s$/, '')}
        </button>
      </div>
      {(persona[field] as string[]).map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateArrayItem(field, index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            placeholder={placeholder}
          />
          {(persona[field] as string[]).length > 1 && (
            <button
              onClick={() => removeArrayItem(field, index)}
              className="px-3 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h2 className="text-xl mb-4">🎯 Goals & Success Metrics</h2>
      {renderList('Primary Goals', 'primaryGoals', 'Enter primary goal...')}
      {renderList('Success Metrics', 'successMetrics', 'Enter success metric...')}
    </div>
  );
};
