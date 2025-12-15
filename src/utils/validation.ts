import { z } from 'zod';

/**
 * Validation Schemas (Zod)
 * Ensures runtime type safety for all inputs/outputs.
 */

// --- 1. ROI Calculator Schemas ---

export const ROIInputsSchema = z.object({
  employeeCount: z.number().min(1, "Must have at least 1 employee").max(1000000),
  avgSalary: z.number().min(0),
  platformCost: z.number().min(0),
  implementationCost: z.number().min(0),
  adoptionRate: z.number().min(0).max(100),
  productivityGain: z.enum(['conservative', 'midpoint', 'optimistic']),
  timeHorizon: z.number().min(1).max(60), // Months
  industry: z.enum(['general', 'financial', 'technology', 'healthcare', 'manufacturing'])
});

export type ROIInputs = z.infer<typeof ROIInputsSchema>;

// --- 2. Recommendation Engine Schemas ---

export const UserAnswerSchema = z.object({
  value: z.union([z.string(), z.number()]),
  selectedOptions: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional()
});

export const RecommendationRequestSchema = z.object({
  department: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
  ecosystem: z.string().optional()
});

// --- 3. Platform Schemas ---

export const PlatformSchema = z.object({
  id: z.string(),
  name: z.string(),
  provider: z.string(),
  pricingValue: z.number(),
  compliance: z.array(z.string()),
  scores: z.record(z.number())
});
