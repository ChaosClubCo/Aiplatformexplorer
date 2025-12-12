import React from 'react';
import { Trash2 } from 'lucide-react';
import { usePersonaStore } from '../stores/usePersonaStore';
import { PersonaTemplate } from '../model/types';

export const PersonaTechRequirementsForm: React.FC = () => {
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
          + Add
        </button>
      </div>
      {(persona[field] as string[]).map((item, index) => (
        <div key={index} className="flex gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => updateArrayItem(field, index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder={placeholder}
          />
          {(persona[field] as string[]).length > 1 && (
            <button
              onClick={() => removeArrayItem(field, index)}
              className="px-2 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h2 className="text-xl mb-4">🔧 Technical Requirements</h2>
      <div className="grid grid-cols-3 gap-4">
        {renderList('Must Have', 'mustHave', 'Required feature...')}
        {renderList('Nice to Have', 'niceToHave', 'Optional feature...')}
        {renderList('Deal Breakers', 'dealBreakers', 'Deal breaker...')}
      </div>
    </div>
  );
};
