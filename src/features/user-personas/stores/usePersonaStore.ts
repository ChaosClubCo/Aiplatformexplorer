import { create } from 'zustand';
import { PersonaTemplate } from '../model/types';
import { defaultPersona, personaTemplates } from '../data/templates';

interface PersonaState {
  persona: PersonaTemplate;
  selectedTemplate: string;
  
  // Actions
  setPersona: (persona: PersonaTemplate) => void;
  setSelectedTemplate: (templateId: string) => void;
  updateField: (field: keyof PersonaTemplate, value: any) => void;
  updateArrayItem: (field: keyof PersonaTemplate, index: number, value: string) => void;
  addArrayItem: (field: keyof PersonaTemplate) => void;
  removeArrayItem: (field: keyof PersonaTemplate, index: number) => void;
  loadTemplate: (templateKey: string) => void;
  reset: () => void;
}

export const usePersonaStore = create<PersonaState>((set) => ({
  persona: defaultPersona,
  selectedTemplate: '',

  setPersona: (persona) => set({ persona }),
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),

  updateField: (field, value) => set((state) => ({
    persona: { ...state.persona, [field]: value }
  })),

  updateArrayItem: (field, index, value) => set((state) => ({
    persona: {
      ...state.persona,
      [field]: (state.persona[field] as string[]).map((item, i) => i === index ? value : item),
    }
  })),

  addArrayItem: (field) => set((state) => ({
    persona: {
      ...state.persona,
      [field]: [...(state.persona[field] as any[]), ''],
    }
  })),

  removeArrayItem: (field, index) => set((state) => ({
    persona: {
      ...state.persona,
      [field]: (state.persona[field] as any[]).filter((_, i) => i !== index),
    }
  })),

  loadTemplate: (templateKey) => {
    const template = personaTemplates[templateKey];
    if (template) {
      set((state) => ({
        selectedTemplate: templateKey,
        persona: {
          ...state.persona, // Keep current values as base? No, the original logic was to reset to default then apply template.
          // Wait, the original logic was merging template into prev.
          // Let's look at original code:
          // setPersona(prev => ({ ...prev, ...template, age: 35, ... })); 
          // It seems it was merging template properties into the current state but also resetting some fields.
          // Actually, looking at the code:
          // ...prev, ...template, age: 35, location: '', etc...
          // It essentially resets most fields but keeps others?
          // Let's simplify and make it robust: merge template into defaultPersona to get a fresh start with template values.
          ...defaultPersona,
          ...template,
          // Explicitly reset fields that shouldn't be carried over from template if they are not in template
          // But since we merge into defaultPersona, we are good.
        }
      }));
    }
  },

  reset: () => set({ persona: defaultPersona, selectedTemplate: '' }),
}));
