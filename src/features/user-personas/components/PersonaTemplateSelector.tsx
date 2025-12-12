import React from 'react';
import { Users } from 'lucide-react';
import { usePersonaStore } from '../stores/usePersonaStore';
import { personaTemplates } from '../data/templates';

export const PersonaTemplateSelector: React.FC = () => {
  const { selectedTemplate, loadTemplate } = usePersonaStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl mb-4">Start with a Template</h2>
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(personaTemplates).map(([key, template]) => (
          <button
            key={key}
            onClick={() => loadTemplate(key)}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedTemplate === key
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 hover:border-orange-300'
            }`}
          >
            <Users className="w-8 h-8 mx-auto mb-2 text-orange-500" />
            <div className="text-sm text-center">{template.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
