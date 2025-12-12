import React from 'react';
import { Download, FileText, Trash2 } from 'lucide-react';
import { usePersonaStore } from '../stores/usePersonaStore';
import { downloadMarkdown, exportPersonaJson } from '../utils/personaUtils';

export const PersonaHeader: React.FC = () => {
  const { persona, reset } = usePersonaStore();

  const handleExportJson = async () => {
    await exportPersonaJson(persona);
  };

  const handleExportMarkdown = () => {
    downloadMarkdown(persona);
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl mb-2">User Persona Generator</h1>
        <p className="text-gray-600">
          Create detailed user personas for AI platform evaluation
        </p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={handleExportJson}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <Download className="w-4 h-4" />
          Export JSON
        </button>
        
        <button
          onClick={handleExportMarkdown}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <FileText className="w-4 h-4" />
          Export Markdown
        </button>
        
        <button
          onClick={reset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          <Trash2 className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
};
