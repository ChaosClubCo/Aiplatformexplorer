export interface Platform {
  id: string;
  name: string;
  provider: string;
  providerKey: string;
  logo: string;
  category: string;
  categoryLabel: string;
  model: string;
  marketShare: string;
  marketSharePercent: number;
  contextWindow: string;
  contextTokens: number;
  focus: string;
  pricing: string;
  pricingValue: number;
  pricingNotes?: string;
  compliance: string[];
  complianceCount: number;
  dataResidency: string;
  multimodal: string;
  intPriority: string;
  intPriorityClass: string;
  intRecommendation: string;
  growthRate: number;
  implementationTime: string;
  scores: {
    codeGeneration: number;
    creativeWriting: number;
    dataAnalysis: number;
    customerService: number;
    complianceWork: number;
    agentCapabilities: number;
    apiAccess: number;
    customization: number;
    multilingual: number;
    reasoning: number;
  };
  strengths: string[];
  useCases: string[];
  officialUrl: string;
  description: string;
  verdict: string;
}

export interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  isNumeric?: boolean;
  isBinary?: boolean;
  isPrice?: boolean;
  unit?: string;
}

export interface Filters {
  provider: string;
  category: string;
  search: string;
  sortBy: string;
}

export interface ROIInputs {
  employeeCount: number;
  avgSalary: number;
  platformCost: number;
  implementationCost: number;
  adoptionRate: number;
  productivityGain: 'conservative' | 'midpoint' | 'optimistic';
  timeHorizon: number;
}

export interface ROIResults {
  roi: number;
  netBenefit: number;
  paybackMonths: number;
  grossSavings: number;
  totalInvestment: number;
  effectiveUsers: number;
  productivityValue: number;
  breakEvenMonth: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}
