import { Question } from '../types/recommendation';

export const RECOMMENDATION_QUESTIONS: Question[] = [
  // REQUIREMENTS (What you need)
  {
    id: 'primary-use-case',
    text: 'What is your primary use case for AI?',
    helpText: 'Select the main capability you need. This heavily influences recommendations.',
    type: 'single',
    category: 'requirements',
    weight: 1.0,
    options: [
      { value: 'code', label: 'Code Generation & Development', score: 100, description: 'Writing, reviewing, and debugging code' },
      { value: 'creative', label: 'Creative Writing & Content', score: 100, description: 'Marketing copy, articles, creative content' },
      { value: 'data', label: 'Data Analysis & Insights', score: 100, description: 'Analyzing data, generating insights, visualization' },
      { value: 'customer', label: 'Customer Service & Support', score: 100, description: 'Chatbots, support automation, customer interactions' },
      { value: 'automation', label: 'Process Automation & Workflows', score: 100, description: 'Automating repetitive tasks and workflows' },
      { value: 'research', label: 'Research & Knowledge Work', score: 100, description: 'Information synthesis, research, summarization' }
    ]
  },
  
  {
    id: 'team-size',
    text: 'How many employees will use AI tools?',
    helpText: 'Larger teams typically need enterprise features and support.',
    type: 'range',
    category: 'requirements',
    weight: 0.8,
    rangeConfig: {
      min: 1,
      max: 10000,
      step: 1,
      unit: 'employees'
    }
  },
  
  {
    id: 'integration-needs',
    text: 'Which integrations are important to you?',
    helpText: 'Select all that apply. This affects ecosystem compatibility.',
    type: 'multi',
    category: 'requirements',
    weight: 0.7,
    options: [
      { value: 'microsoft', label: 'Microsoft 365 (Teams, Office, etc.)', score: 80 },
      { value: 'google', label: 'Google Workspace (Gmail, Docs, etc.)', score: 80 },
      { value: 'slack', label: 'Slack', score: 60 },
      { value: 'salesforce', label: 'Salesforce CRM', score: 70 },
      { value: 'api', label: 'Custom API Integration', score: 90 },
      { value: 'none', label: 'No specific integration needed', score: 50 }
    ]
  },
  
  // CONSTRAINTS (Deal-breakers)
  {
    id: 'budget-per-user',
    text: 'What is your maximum budget per user per month?',
    helpText: 'Set realistic budget expectations. This is a hard constraint.',
    type: 'range',
    category: 'constraints',
    weight: 0.95,
    rangeConfig: {
      min: 0,
      max: 100,
      step: 5,
      unit: '$/user/month'
    }
  },
  
  {
    id: 'compliance-needs',
    text: 'Which compliance certifications are required?',
    helpText: 'Select all mandatory certifications. Missing these will heavily penalize platforms.',
    type: 'multi',
    category: 'constraints',
    weight: 0.9,
    options: [
      { value: 'soc2', label: 'SOC 2', score: 100, description: 'Security and availability controls' },
      { value: 'iso27001', label: 'ISO 27001', score: 100, description: 'Information security management' },
      { value: 'gdpr', label: 'GDPR Compliant', score: 100, description: 'EU data protection regulation' },
      { value: 'hipaa', label: 'HIPAA', score: 100, description: 'Healthcare data protection' },
      { value: 'fedramp', label: 'FedRAMP', score: 100, description: 'US government cloud security' },
      { value: 'none', label: 'No specific compliance required', score: 50 }
    ]
  },
  
  {
    id: 'existing-ecosystem',
    text: 'Which ecosystem does your organization currently use?',
    helpText: 'Platforms that integrate well with your ecosystem get bonus points.',
    type: 'single',
    category: 'constraints',
    weight: 0.85,
    options: [
      { value: 'microsoft', label: 'Microsoft 365', score: 100, description: 'Teams, Office, Azure' },
      { value: 'google', label: 'Google Workspace', score: 100, description: 'Gmail, Docs, Cloud Platform' },
      { value: 'salesforce', label: 'Salesforce', score: 100, description: 'CRM-centric' },
      { value: 'mixed', label: 'Mixed / Multi-vendor', score: 80, description: 'Use multiple ecosystems' },
      { value: 'other', label: 'Other / Custom', score: 70, description: 'Custom or other systems' }
    ]
  },
  
  {
    id: 'data-residency',
    text: 'Do you have data residency requirements?',
    helpText: 'Where must your data be stored geographically?',
    type: 'multi',
    category: 'constraints',
    weight: 0.7,
    options: [
      { value: 'us', label: 'United States only', score: 100 },
      { value: 'eu', label: 'European Union only', score: 100 },
      { value: 'uk', label: 'United Kingdom', score: 100 },
      { value: 'global', label: 'Global (any region acceptable)', score: 100 },
      { value: 'flexible', label: 'No specific requirement', score: 80 }
    ]
  },
  
  // PRIORITIES (Nice-to-haves)
  {
    id: 'capability-priorities',
    text: 'Rank these capabilities by importance (drag to reorder):',
    helpText: 'Your top priorities will influence the final recommendation.',
    type: 'priority',
    category: 'priorities',
    weight: 0.6,
    options: [
      { value: 'code', label: 'Code Generation', score: 0 }, // Score calculated by rank
      { value: 'creative', label: 'Creative Writing', score: 0 },
      { value: 'data', label: 'Data Analysis', score: 0 },
      { value: 'customer', label: 'Customer Service', score: 0 },
      { value: 'multilingual', label: 'Multilingual Support', score: 0 },
      { value: 'agents', label: 'Agent Capabilities', score: 0 }
    ]
  },
  
  {
    id: 'implementation-speed',
    text: 'How quickly do you need to deploy?',
    helpText: 'Urgency affects which platforms are recommended.',
    type: 'single',
    category: 'priorities',
    weight: 0.5,
    options: [
      { value: 'immediate', label: 'Immediate (< 1 month)', score: 100, description: 'Need to deploy ASAP' },
      { value: 'fast', label: 'Fast (1-3 months)', score: 80, description: 'Quick deployment preferred' },
      { value: 'standard', label: 'Standard (3-6 months)', score: 60, description: 'Normal timeline acceptable' },
      { value: 'flexible', label: 'Flexible (6+ months)', score: 40, description: 'No rush, can take time' }
    ]
  },
  
  {
    id: 'context-window-importance',
    text: 'How important is a large context window (ability to process long documents)?',
    helpText: 'Large context windows help with analyzing long documents, codebases, etc.',
    type: 'single',
    category: 'priorities',
    weight: 0.4,
    options: [
      { value: 'critical', label: 'Critical - We need 100K+ tokens', score: 100 },
      { value: 'important', label: 'Important - Prefer 50K+ tokens', score: 70 },
      { value: 'nice', label: 'Nice to have - 10K+ is fine', score: 40 },
      { value: 'notimportant', label: 'Not important - Standard context is fine', score: 10 }
    ]
  },
  
  {
    id: 'market-leader-preference',
    text: 'How important is choosing a market leader?',
    helpText: 'Market leaders have more resources but may cost more.',
    type: 'single',
    category: 'priorities',
    weight: 0.3,
    options: [
      { value: 'critical', label: 'Critical - Must be top 3 in market share', score: 100 },
      { value: 'important', label: 'Important - Prefer established players', score: 70 },
      { value: 'neutral', label: 'Neutral - Open to any vendor', score: 50 },
      { value: 'underdog', label: 'Prefer innovative underdogs', score: 30 }
    ]
  }
];

// Map use cases to platform score keys
export const USE_CASE_SCORE_MAP: { [key: string]: keyof Platform['scores'] } = {
  'code': 'codeGeneration',
  'creative': 'creativeWriting',
  'data': 'dataAnalysis',
  'customer': 'customerService',
  'automation': 'agentCapabilities',
  'research': 'reasoning'
};

// Map ecosystems to platform IDs for bonus scoring
export const ECOSYSTEM_PLATFORM_MAP: { [key: string]: string[] } = {
  'microsoft': ['copilot', 'azure-openai'],
  'google': ['gemini', 'vertex-ai'],
  'salesforce': ['agentforce', 'einstein'],
  'mixed': [], // No specific bonus
  'other': []
};
