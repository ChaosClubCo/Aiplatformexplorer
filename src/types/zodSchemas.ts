import { z } from 'zod';

export const PlatformSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  providerKey: z.string(),
  logo: z.string(),
  category: z.string(),
  categoryLabel: z.string(),
  model: z.string(),
  marketShare: z.string(),
  marketSharePercent: z.number(),
  contextWindow: z.string(),
  contextTokens: z.number(),
  focus: z.string(),
  pricing: z.string(),
  pricingValue: z.number(),
  pricingNotes: z.string().optional(),
  compliance: z.array(z.string()),
  complianceCount: z.number(),
  dataResidency: z.string(),
  multimodal: z.string(),
  intPriority: z.string(),
  intPriorityClass: z.string(),
  intRecommendation: z.string(),
  growthRate: z.number(),
  implementationTime: z.string(),
  scores: z.object({
    codeGeneration: z.number(),
    creativeWriting: z.number(),
    dataAnalysis: z.number(),
    customerService: z.number(),
    complianceWork: z.number(),
    agentCapabilities: z.number(),
    apiAccess: z.number(),
    customization: z.number(),
    multilingual: z.number(),
    reasoning: z.number(),
  }),
  avgScore: z.number().optional(),
  strengths: z.array(z.string()),
  features: z.array(z.string()).optional(),
  useCases: z.array(z.string()),
  officialUrl: z.string(),
  description: z.string(),
  verdict: z.string(),
  pricingModel: z.string().optional(),
  soc2: z.boolean().optional(),
  gdpr: z.boolean().optional(),
  hipaa: z.boolean().optional(),
  iso27001: z.boolean().optional(),
  apiAccess: z.boolean().optional(),
  fineTuning: z.boolean().optional(),
});

export const PlatformArraySchema = z.array(PlatformSchema);

export const QuestionOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
  score: z.number(),
  description: z.string().optional(),
});

export const QuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  helpText: z.string(),
  type: z.enum(['single', 'multi']),
  category: z.string(),
  weight: z.number(),
  options: z.array(QuestionOptionSchema),
});

export const QuestionArraySchema = z.array(QuestionSchema);
