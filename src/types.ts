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
  avgScore?: number; // Average of all scores
  strengths: string[];
  features: string[]; // Added for filtering
  useCases: string[];
  officialUrl: string;
  description: string;
  verdict: string;
  pricingModel?: string; // Added for better categorization
  soc2?: boolean; // SOC2 compliance
  gdpr?: boolean; // GDPR compliance
  hipaa?: boolean; // HIPAA compliance
  iso27001?: boolean; // ISO 27001 compliance
  apiAccess?: boolean; // Has API access
  fineTuning?: boolean; // Supports fine-tuning
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

export interface WeightConfig {
  capabilities: number; // 0-100
  security: number;     // 0-100
  cost: number;         // 0-100
  customization: number; // 0-100
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}