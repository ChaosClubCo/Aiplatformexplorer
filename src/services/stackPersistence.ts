import { Stack } from '../types';
import { projectId, publicAnonKey } from '../utils/supabase/info';

const STORAGE_KEY = 'ai_platform_stacks';
const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-8c5e19c9`;

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${publicAnonKey}`
});

export const stackService = {
  // Local Persistence
  getLocal: (): Stack[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to load stacks locally', e);
      return [];
    }
  },

  saveLocal: (stack: Stack): void => {
    const stacks = stackService.getLocal();
    const existingIndex = stacks.findIndex(s => s.id === stack.id);
    
    if (existingIndex >= 0) {
      stacks[existingIndex] = stack;
    } else {
      stacks.push(stack);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
  },

  deleteLocal: (id: string): void => {
    const stacks = stackService.getLocal().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stacks));
  },

  getById: (id: string): Stack | undefined => {
    return stackService.getLocal().find(s => s.id === id);
  },

  // Server Sync
  syncWithServer: async (userId: string): Promise<Stack[]> => {
    try {
      // 1. Fetch remote stacks
      const response = await fetch(`${API_BASE}/stacks/${userId}`, {
        headers: getHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to fetch remote stacks');
      const remoteStacks: Stack[] = await response.json();

      // 2. Merge strategy: ID-based union. In a real app, we'd use timestamps.
      // For now, let's prefer local changes if newer (simple Last Write Wins logic)
      const localStacks = stackService.getLocal();
      
      const mergedMap = new Map<string, Stack>();
      
      // Add remote first
      if (Array.isArray(remoteStacks)) {
        remoteStacks.forEach(s => mergedMap.set(s.id, s));
      }

      // Overwrite/Add local
      localStacks.forEach(s => {
        const existing = mergedMap.get(s.id);
        if (!existing || s.updatedAt > existing.updatedAt) {
          mergedMap.set(s.id, s);
          // If local is newer, push to server (fire and forget)
          stackService.saveRemote(userId, s);
        }
      });

      const mergedStacks = Array.from(mergedMap.values());
      
      // Update local storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedStacks));
      
      return mergedStacks;
    } catch (error) {
      console.error('Sync failed:', error);
      return stackService.getLocal(); // Fallback to local
    }
  },

  saveRemote: async (userId: string, stack: Stack): Promise<void> => {
    try {
      await fetch(`${API_BASE}/stacks/${userId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(stack)
      });
    } catch (error) {
      console.error('Failed to save to server:', error);
    }
  },

  deleteRemote: async (userId: string, stackId: string): Promise<void> => {
     try {
      await fetch(`${API_BASE}/stacks/${userId}/${stackId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
    } catch (error) {
      console.error('Failed to delete from server:', error);
    }
  },

  // Integrations
  exportToNotion: async (stack: Stack, databaseId: string): Promise<{ url: string }> => {
    const response = await fetch(`${API_BASE}/integrations/notion`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ stack, databaseId })
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to export to Notion');
    }
    return await response.json();
  },

  exportToGithub: async (stack: Stack, repoUrl: string): Promise<{ url: string }> => {
    const response = await fetch(`${API_BASE}/integrations/github`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ stack, repoUrl })
    });

    if (!response.ok) {
         const err = await response.json();
        throw new Error(err.error || 'Failed to export to GitHub');
    }
    return await response.json();
  }
};
