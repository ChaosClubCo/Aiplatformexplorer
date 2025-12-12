/**
 * Default persona template
 */
import { PersonaTemplate } from '../model/types';

export const defaultPersona: PersonaTemplate = {
  name: '',
  age: 35,
  role: '',
  company: '',
  companySize: '',
  location: '',
  experience: '',
  teamSize: '',
  budgetAuthority: '',
  background: '',
  primaryGoals: [''],
  successMetrics: [''],
  painPoints: [{ title: '', description: '' }],
  mustHave: [''],
  niceToHave: [''],
  dealBreakers: [''],
  discoveryPhase: [''],
  evaluationPhase: [''],
  decisionPhase: [''],
  behavioralPatterns: [''],
  decisionCriteria: [{ criteria: '', weight: 0 }],
  quotes: [''],
  currentlyUsing: [''],
  preferredPlatforms: [''],
};

/**
 * Persona template library
 */
export const personaTemplates: Record<string, Partial<PersonaTemplate>> = {
  enterprise: {
    name: 'Enterprise AI Architect',
    role: 'Senior AI Architect',
    company: 'Fortune 500 Company',
    companySize: '10,000+ employees',
    budgetAuthority: '$1M+',
    primaryGoals: [
      'Select enterprise-grade AI platform',
      'Ensure regulatory compliance',
      'Build scalable infrastructure',
    ],
    mustHave: ['SOC2', 'GDPR', 'SSO', 'Enterprise SLA'],
    dealBreakers: ['No compliance certifications', 'Consumer-grade only'],
  },
  startup: {
    name: 'Startup CTO',
    role: 'Co-founder & CTO',
    company: 'Early-stage Startup',
    companySize: '10-50 employees',
    budgetAuthority: '$50K-$200K',
    primaryGoals: [
      'Find cost-effective solution',
      'Move fast and iterate',
      'Optimize developer experience',
    ],
    mustHave: ['Pay-as-you-go pricing', 'Good documentation', 'API access'],
    dealBreakers: ['Long-term contracts', 'Enterprise-only pricing'],
  },
  technical: {
    name: 'ML Engineer',
    role: 'Machine Learning Engineer',
    company: 'Tech Company',
    companySize: '500-5,000 employees',
    budgetAuthority: '$100K-$500K',
    primaryGoals: [
      'Access advanced technical features',
      'High performance and reliability',
      'Custom model support',
    ],
    mustHave: ['API access', 'Fine-tuning', 'High context window'],
    dealBreakers: ['Limited technical capabilities', 'Poor API performance'],
  },
  business: {
    name: 'Product Manager',
    role: 'Product Manager',
    company: 'SaaS Company',
    companySize: '100-1,000 employees',
    budgetAuthority: '$200K-$500K',
    primaryGoals: [
      'Demonstrate clear ROI',
      'Easy integration',
      'Improve product capabilities',
    ],
    mustHave: ['Clear ROI', 'Good documentation', 'Customer success'],
    dealBreakers: ['Unclear pricing', 'Poor integration support'],
  },
  compliance: {
    name: 'Compliance Officer',
    role: 'Chief Compliance Officer',
    company: 'Regulated Industry',
    companySize: '1,000-10,000 employees',
    budgetAuthority: 'Review authority',
    primaryGoals: [
      'Ensure regulatory compliance',
      'Verify security standards',
      'Mitigate risk',
    ],
    mustHave: ['Industry certifications', 'Audit logs', 'Data sovereignty'],
    dealBreakers: ['Missing certifications', 'Unclear compliance'],
  },
};
