// Phase 3.1: Recommendation Engine
export interface RecommendationRequirements {
  budget: {
    maxAnnual: number;
    currency: string;
  };
  users: {
    count: number;
    type: 'dev' | 'business' | 'mixed';
  };
  compliance: ('soc2' | 'hipaa' | 'gdpr' | 'iso27001')[];
  features: {
    priority: 'critical' | 'nice-to-have';
    category: 'nlp' | 'vision' | 'audio' | 'multi-modal';
  }[];
  techStack: ('python' | 'node' | 'go' | 'java')[];
}

export interface MatchResult {
  platformId: string;
  score: number;
  gapAnalysis: {
    missingCritical: string[];
    missingNiceToHave: string[];
    complianceGaps: string[];
  };
}

// Phase 3.2: Vendor Risk Monitor
export interface RiskEvent {
  id: string;
  date: string;
  type: 'security' | 'outage' | 'legal' | 'news';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  sourceUrl?: string;
}

export interface VendorRiskProfile {
  platformId: string;
  riskScore: number; // 0-100 (100 is risky)
  trend: 'improving' | 'stable' | 'degrading';
  uptimesla: number;
  lastIncident?: string;
  events: RiskEvent[];
}

// Phase 3.3: TCO & ROI Validation
export interface ROIRealizationEntry {
  period: string; // "Q1 2024"
  projectedCost: number;
  actualCost: number;
  projectedAdoption: number;
  actualAdoption: number;
  productivityGainActual: number;
}

// Phase 3.4: Collaboration
export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  targetId: string; // platformId or cellId
  resolved: boolean;
  replies: Comment[];
}
