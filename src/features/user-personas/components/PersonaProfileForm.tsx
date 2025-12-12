import React from 'react';
import { usePersonaStore } from '../stores/usePersonaStore';

export const PersonaProfileForm: React.FC = () => {
  const { persona, updateField } = usePersonaStore();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
      <h2 className="text-xl mb-4">👤 Profile</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            value={persona.name}
            onChange={(e) => updateField('name', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Emily Chen"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Age</label>
          <input
            type="number"
            value={persona.age}
            onChange={(e) => updateField('age', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Role</label>
          <input
            type="text"
            value={persona.role}
            onChange={(e) => updateField('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Senior AI Architect"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Company</label>
          <input
            type="text"
            value={persona.company}
            onChange={(e) => updateField('company', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Fortune 500 Financial Services"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Company Size</label>
          <input
            type="text"
            value={persona.companySize}
            onChange={(e) => updateField('companySize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 10,000+ employees"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Location</label>
          <input
            type="text"
            value={persona.location}
            onChange={(e) => updateField('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., New York, NY"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Experience</label>
          <input
            type="text"
            value={persona.experience}
            onChange={(e) => updateField('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 15 years in technology"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Team Size</label>
          <input
            type="text"
            value={persona.teamSize}
            onChange={(e) => updateField('teamSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., Team of 25"
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm mb-1">Budget Authority</label>
          <input
            type="text"
            value={persona.budgetAuthority}
            onChange={(e) => updateField('budgetAuthority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., $5M+ annually"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm mb-1">Background</label>
        <textarea
          value={persona.background}
          onChange={(e) => updateField('background', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          rows={4}
          placeholder="Describe the persona's professional background and context..."
        />
      </div>
    </div>
  );
};
