import { Scenario, ScenarioData } from '../types/scenario';

const STORAGE_KEY = 'ape_scenarios_v1';

class ScenarioService {
  private getStoredScenarios(): Scenario[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load scenarios', error);
      return [];
    }
  }

  private saveStoredScenarios(scenarios: Scenario[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    } catch (error) {
      console.error('Failed to save scenarios', error);
    }
  }

  async list(): Promise<Scenario[]> {
    return this.getStoredScenarios().sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getById(id: string): Promise<Scenario | null> {
    const scenarios = this.getStoredScenarios();
    return scenarios.find(s => s.id === id) || null;
  }

  async save(
    name: string, 
    type: Scenario['type'], 
    data: ScenarioData, 
    userId: string = 'current-user',
    description?: string,
    existingId?: string
  ): Promise<Scenario> {
    const scenarios = this.getStoredScenarios();
    const now = new Date().toISOString();

    if (existingId) {
      const index = scenarios.findIndex(s => s.id === existingId);
      if (index === -1) throw new Error('Scenario not found');

      const updated: Scenario = {
        ...scenarios[index],
        name,
        description,
        data: { ...scenarios[index].data, ...data },
        updatedAt: now,
      };
      
      scenarios[index] = updated;
      this.saveStoredScenarios(scenarios);
      return updated;
    } else {
      const newScenario: Scenario = {
        id: crypto.randomUUID(),
        name,
        description,
        type,
        data,
        createdAt: now,
        updatedAt: now,
        createdBy: userId,
        version: 1,
      };
      
      scenarios.push(newScenario);
      this.saveStoredScenarios(scenarios);
      return newScenario;
    }
  }

  async delete(id: string): Promise<void> {
    const scenarios = this.getStoredScenarios();
    const filtered = scenarios.filter(s => s.id !== id);
    this.saveStoredScenarios(filtered);
  }

  async duplicate(id: string, newName: string): Promise<Scenario> {
    const source = await this.getById(id);
    if (!source) throw new Error('Scenario not found');

    return this.save(
      newName, 
      source.type, 
      source.data, 
      source.createdBy, 
      `Copy of ${source.name}`
    );
  }
}

export const scenarioService = new ScenarioService();
