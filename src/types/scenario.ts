export interface Scenario {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // user id
  type: 'platform-selection' | 'roi-projection' | 'full-evaluation';
  data: ScenarioData;
  tags?: string[];
  version: number;
}

export interface ScenarioData {
  weights?: {
    capabilities: number;
    security: number;
    cost: number;
    customization: number;
  };
  roiInputs?: {
    employeeCount: number;
    avgSalary: number;
    platformCost: number;
    implementationCost: number;
    adoptionRate: number;
    productivityGain: 'conservative' | 'midpoint' | 'optimistic';
    timeHorizon: number;
  };
  selectedPlatforms?: string[];
  notes?: string;
}

export interface ScenarioComparison {
  baseId: string;
  targetId: string;
  diffs: {
    weights: boolean;
    roi: boolean;
    selection: boolean;
  };
  deltas: {
    roiValue?: number;
    scoreDelta?: Record<string, number>; // platformId -> score diff
  };
}
