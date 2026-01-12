import { Stack } from '../types';

const STORAGE_KEY = 'ai_platform_stacks';

export const stackService = {
  getAll: (): Stack[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load stacks', e);
      return [];
    }
  },

  save: (stack: Stack): void => {
    const stacks = stackService.getAll();
    const existingIndex = stacks.findIndex(s => s.id === stack.id);
    
    if (existingIndex >= 0) {
      stacks[existingIndex] = stack;
    } else {
      stacks.push(stack);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
  },

  delete: (id: string): void => {
    const stacks = stackService.getAll().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
  },

  getById: (id: string): Stack | undefined => {
    return stackService.getAll().find(s => s.id === id);
  }
};
