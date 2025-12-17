import { useState, useMemo, useEffect } from 'react';
import { z } from 'zod';

// Schema defined locally to avoid circular dependency/initialization issues
const ROIInputsSchema = z.object({
  employeeCount: z.number().min(1, "Must have at least 1 employee").max(1000000),
  avgSalary: z.number().min(0),
  platformCost: z.number().min(0),
  implementationCost: z.number().min(0),
  adoptionRate: z.number().min(0).max(100),
  productivityGain: z.enum(['conservative', 'midpoint', 'optimistic']),
  timeHorizon: z.number().min(1).max(60), // Months
  industry: z.enum(['general', 'financial', 'technology', 'healthcare', 'manufacturing'])
});

type ROIInputs = z.infer<typeof ROIInputsSchema>;

/**
 * Custom Hook: Logic for ROI Calculator
 * Separates business logic from UI rendering.
 */
export function useROICalculator(onToast: (msg: string, type: 'success' | 'warning' | 'error') => void) {
  const [activeScenario, setActiveScenario] = useState<'custom' | 'microsoft' | 'google' | 'hybrid'>('custom');
  
  const [inputs, setInputs] = useState<ROIInputs>({
    employeeCount: 1000,
    avgSalary: 75000,
    platformCost: 30,
    implementationCost: 200000,
    adoptionRate: 80,
    productivityGain: 'midpoint',
    timeHorizon: 12,
    industry: 'general'
  });

  const [isDemoMode, setIsDemoMode] = useState(false);

  // Industry Benchmarks (Configuration)
  const industryMultipliers = {
    general: 1.0,
    financial: 1.15,
    healthcare: 1.10,
    technology: 1.20,
    manufacturing: 1.05
  };

  const loadScenario = (scenario: 'microsoft' | 'google' | 'hybrid') => {
    setActiveScenario(scenario);
    let newInputs: Partial<ROIInputs> = {};

    switch (scenario) {
      case 'microsoft':
        newInputs = {
          employeeCount: 1000,
          avgSalary: 90000,
          platformCost: 30,
          implementationCost: 200000,
          adoptionRate: 100,
          productivityGain: 'optimistic',
          timeHorizon: 12,
          industry: 'general'
        };
        break;
      case 'google':
        newInputs = {
          employeeCount: 1000,
          avgSalary: 90000,
          platformCost: 45,
          implementationCost: 200000,
          adoptionRate: 100,
          productivityGain: 'optimistic',
          timeHorizon: 12,
          industry: 'technology'
        };
        break;
      case 'hybrid':
        newInputs = {
          employeeCount: 1100,
          avgSalary: 95000,
          platformCost: 55,
          implementationCost: 250000,
          adoptionRate: 90,
          productivityGain: 'optimistic',
          timeHorizon: 12,
          industry: 'technology'
        };
        break;
    }

    setInputs(prev => ({ ...prev, ...newInputs }));
    onToast(`Loaded Scenario: ${scenario.charAt(0).toUpperCase() + scenario.slice(1)}`, 'success');
  };

  const results = useMemo(() => {
    // Validate inputs safely
    const validation = ROIInputsSchema.safeParse(inputs);
    if (!validation.success) {
      // In a real app, you might expose field-level errors here
      console.warn('ROI Calculation Validation Failed', validation.error);
    }

    const productivityValues = {
      conservative: 3000,
      midpoint: 9000,
      optimistic: 30000
    };

    const baseProductivityValue = productivityValues[inputs.productivityGain];
    const industryMultiplier = industryMultipliers[inputs.industry];
    const productivityValue = baseProductivityValue * industryMultiplier;

    const effectiveUsers = Math.round(inputs.employeeCount * (inputs.adoptionRate / 100));
    const annualPlatformCost = inputs.employeeCount * inputs.platformCost * 12;
    const supportCost = annualPlatformCost * 0.15;
    
    const totalInvestment =
      inputs.implementationCost +
      (annualPlatformCost * inputs.timeHorizon) / 12 +
      (supportCost * inputs.timeHorizon) / 12;

    const grossSavings = effectiveUsers * productivityValue * (inputs.timeHorizon / 12);
    const netBenefit = grossSavings - totalInvestment;
    const roi = totalInvestment > 0 ? (netBenefit / totalInvestment) * 100 : 0;
    const paybackMonths = grossSavings > 0 ? (totalInvestment / (grossSavings / inputs.timeHorizon)) : 0;

    const roiMultiplier = (100 + roi) / 100;
    const performanceCategory = 
      roiMultiplier >= 3.0 ? 'Excellent (Top 5%)' :
      roiMultiplier >= 1.7 ? 'Above Average' :
      roiMultiplier >= 1.0 ? 'Below Average' :
      'Negative ROI';

    return {
      roi,
      netBenefit,
      paybackMonths,
      grossSavings,
      totalInvestment,
      effectiveUsers,
      productivityValue,
      annualPlatformCost,
      supportCost,
      roiMultiplier,
      performanceCategory
    };
  }, [inputs]);

  return {
    inputs,
    setInputs,
    results,
    activeScenario,
    loadScenario,
    isDemoMode,
    setIsDemoMode
  };
}
