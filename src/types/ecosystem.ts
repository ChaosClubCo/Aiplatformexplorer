// Phase 4.1: Integration Hub
export interface IntegrationConfig {
  id: string;
  type: 'jira' | 'slack' | 'linear' | 'sap' | 'salesforce';
  status: 'active' | 'disconnected' | 'error';
  config: Record<string, string>;
  lastSync?: string;
}

// Phase 4.2: Custom Marketplace
export interface CustomExtension {
  id: string;
  name: string;
  type: 'platform-adapter' | 'report-template' | 'scoring-model';
  author: string;
  version: string;
  installed: boolean;
}

// Phase 4.3: RFP Generator
export interface RFPSection {
  id: string;
  title: string;
  content: string;
  requirements: string[]; // IDs linking to RecommendationRequirements
}

export interface RFPProject {
  id: string;
  title: string;
  status: 'draft' | 'review' | 'sent';
  vendors: string[]; // platform IDs
  sections: RFPSection[];
  generatedAt: string;
}

// Phase 4.4: Compliance Agent
export interface ComplianceAlert {
  id: string;
  platformId: string;
  type: 'tos-change' | 'cert-expiry' | 'subprocessor-add';
  severity: 'info' | 'warning' | 'critical';
  details: string;
  detectedAt: string;
  acknowledged: boolean;
}

// Phase 4.5: Governance
export interface GovernancePolicy {
  id: string;
  name: string;
  rule: string; // e.g., "min_security_score > 80"
  scope: 'global' | 'project';
  enforcement: 'blocking' | 'warning';
  active: boolean;
}
