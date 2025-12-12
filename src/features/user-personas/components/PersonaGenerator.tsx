import React from 'react';
import { PersonaHeader } from './PersonaHeader';
import { PersonaTemplateSelector } from './PersonaTemplateSelector';
import { PersonaProfileForm } from './PersonaProfileForm';
import { PersonaGoalsForm } from './PersonaGoalsForm';
import { PersonaTechRequirementsForm } from './PersonaTechRequirementsForm';
import { PersonaQuotesForm } from './PersonaQuotesForm';
import { PersonaPreview } from './PersonaPreview';

export const PersonaGenerator: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <PersonaHeader />
      <PersonaTemplateSelector />
      <PersonaProfileForm />
      <PersonaGoalsForm />
      <PersonaTechRequirementsForm />
      <PersonaQuotesForm />
      <PersonaPreview />
    </div>
  );
};
