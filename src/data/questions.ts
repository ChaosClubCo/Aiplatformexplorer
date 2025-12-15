import { Question } from '../types/recommendation';

export const RECOMMENDATION_QUESTIONS: Question[] = [
  // REQUIREMENTS (What you need)
  {
    id: 'existing-ecosystem',
    text: 'Which primary ecosystem does your organization use?',
    helpText: 'This is the most critical factor for your primary AI platform.',
    type: 'single',
    category: 'requirements',
    weight: 1.0, // Critical weight
    options: [
      { value: 'microsoft', label: 'Microsoft 365 (Teams, Outlook, SharePoint)', score: 100, description: 'Deep integration with Copilot' },
      { value: 'google', label: 'Google Workspace (Gmail, Docs, Drive)', score: 100, description: 'Deep integration with Gemini' },
      { value: 'mixed', label: 'Mixed / Best-of-Breed', score: 80, description: 'We use both or other systems' },
      { value: 'other', label: 'Other / On-Premise', score: 60 }
    ]
  },

  {
    id: 'department',
    text: 'Which department is this deployment for?',
    helpText: 'Different functions have different optimal AI tools.',
    type: 'single', // Simplified to single for the wizard flow, or could be multi
    category: 'requirements',
    weight: 0.9,
    options: [
      { value: 'sales', label: 'Sales & Business Development', score: 100 },
      { value: 'marketing', label: 'Marketing & Creative', score: 100 },
      { value: 'service', label: 'Customer Service & Support', score: 100 },
      { value: 'it', label: 'IT & DevOps', score: 100 },
      { value: 'legal', label: 'Legal & Compliance', score: 100 },
      { value: 'hr', label: 'Human Resources', score: 100 },
      { value: 'finance', label: 'Finance & Accounting', score: 100 },
      { value: 'strategy', label: 'Strategy & Leadership', score: 100 },
      { value: 'r_and_d', label: 'R&D / Product', score: 100 }
    ]
  },

  {
    id: 'primary-use-case',
    text: 'What is the primary use case?',
    helpText: 'Select the main capability you need.',
    type: 'single',
    category: 'requirements',
    weight: 0.8,
    options: [
      { value: 'productivity', label: 'General Productivity (Email, Docs, Meetings)', score: 100 },
      { value: 'creative', label: 'Creative Content & Ideation', score: 100 },
      { value: 'code', label: 'Code Generation & Tech Specs', score: 100 },
      { value: 'research', label: 'Deep Research & Analysis', score: 100 },
      { value: 'compliance', label: 'Audit, Risk & Contract Review', score: 100 },
      { value: 'multilingual', label: 'Translation & Global Support', score: 100 }
    ]
  },
  
  // CONSTRAINTS (Deal-breakers)
  {
    id: 'compliance-needs',
    text: 'Which compliance certifications are mandatory?',
    helpText: 'Missing these will disqualify platforms.',
    type: 'multi',
    category: 'constraints',
    weight: 0.9,
    options: [
      { value: 'soc2', label: 'SOC 2', score: 100 },
      { value: 'iso27001', label: 'ISO 27001', score: 100 },
      { value: 'hipaa', label: 'HIPAA', score: 100 },
      { value: 'gdpr', label: 'GDPR', score: 100 },
      { value: 'none', label: 'Standard Commercial Security', score: 50 }
    ]
  },

  {
    id: 'budget-per-user',
    text: 'Target monthly budget per user?',
    helpText: 'Enterprise AI typically ranges $20-$60/user.',
    type: 'single', // Simplified for clarity
    category: 'constraints',
    weight: 0.7,
    options: [
      { value: 'low', label: '< $20 (Basic)', score: 100 },
      { value: 'standard', label: '$30 (Standard Enterprise)', score: 100 },
      { value: 'premium', label: '$60+ (Premium/Specialized)', score: 100 }
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
  'research': 'reasoning',
  'compliance': 'complianceWork',
  'multilingual': 'multilingual'
};

// Map ecosystems to platform IDs for bonus scoring
export const ECOSYSTEM_PLATFORM_MAP: { [key: string]: string[] } = {
  'microsoft': ['copilot', 'github-copilot'],
  'google': ['gemini'],
  'mixed': ['chatgpt', 'perplexity', 'claude'], // Neutral/Best-of-breed
  'other': []
};
