import React from 'react';
import { usePersonaStore } from '../stores/usePersonaStore';
import { generateMarkdown } from '../utils/personaUtils';

export const PersonaPreview: React.FC = () => {
  const { persona } = usePersonaStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl mb-4">📄 Preview</h2>
      <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
        {generateMarkdown(persona)}
      </pre>
    </div>
  );
};
