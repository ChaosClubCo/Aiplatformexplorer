import React from 'react';
import { Trash2 } from 'lucide-react';
import { usePersonaStore } from '../stores/usePersonaStore';

export const PersonaQuotesForm: React.FC = () => {
  const { persona, updateArrayItem, addArrayItem, removeArrayItem } = usePersonaStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl">💬 Quotes</h2>
        <button
          onClick={() => addArrayItem('quotes')}
          className="text-sm text-orange-500 hover:text-orange-600"
        >
          + Add Quote
        </button>
      </div>
      {persona.quotes.map((quote, index) => (
        <div key={index} className="flex gap-2">
          <textarea
            value={quote}
            onChange={(e) => updateArrayItem('quotes', index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
            rows={2}
            placeholder="Enter a representative quote from this persona..."
          />
          {persona.quotes.length > 1 && (
            <button
              onClick={() => removeArrayItem('quotes', index)}
              className="px-3 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
