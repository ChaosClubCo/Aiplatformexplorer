import { BaseService, performanceMonitor } from '../core';
import { RecommendationRequirements, MatchResult, VendorRiskProfile, ROIRealizationEntry, Comment } from '../types/intelligence';
import { RecommendationRequestSchema } from '../utils/validation';

/**
 * Service Layer: Intelligence
 * 
 * Refactored for:
 * 1. Circuit Breaker protection (Resilience)
 * 2. Zod Validation (Type Safety)
 * 3. Consistent Error Handling
 */
class IntelligenceService extends BaseService {
  
  // Phase 3.1: Recommendation Engine
  async getRecommendations(reqs: RecommendationRequirements): Promise<MatchResult[]> {
    return this.circuitBreaker.execute(async () => {
      performanceMonitor.mark('reco-start');
      
      // 1. Validation
      const validation = RecommendationRequestSchema.safeParse({
        department: reqs.departments?.[0], // Simplified mapping for validation
        capabilities: reqs.capabilities
      });

      if (!validation.success) {
        console.warn('[IntelligenceService] Invalid request:', validation.error);
        // We continue with best-effort instead of throwing, for resilience
      }

      this.log('Generating strategic recommendations', reqs);

      // 2. Business Logic (Mocked for Demo, but structured for replacement)
      const recommendations: MatchResult[] = [];
      const departments = reqs.departments || [];
      const capabilities = reqs.capabilities || [];

      const addReco = (id: string, score: number, reason: string) => {
        recommendations.push({
          platformId: id,
          score,
          gapAnalysis: {
            missingCritical: [],
            missingNiceToHave: [],
            complianceGaps: []
          },
          reason
        } as any);
      };

      // Rules Engine (Simulating DB Lookup)
      if (departments.some(d => ['sales', 'finance', 'it'].includes(d.toLowerCase()))) {
        addReco('copilot', 95, "Primary Choice: Native M365/Dynamics integration");
      }
      if (departments.some(d => ['marketing', 'customer_service'].includes(d.toLowerCase()))) {
        addReco('gemini', 94, "Primary Choice: Multimodal analytics & content");
      }
      if (departments.some(d => ['legal', 'security'].includes(d.toLowerCase()))) {
        addReco('claude', 98, "Specialized Choice: High-context safety & compliance");
      }
      if (departments.some(d => ['strategy', 'r_and_d'].includes(d.toLowerCase()))) {
        addReco('perplexity', 90, "Specialized Choice: Real-time research synthesis");
      }
      
      // Fallbacks
      if (recommendations.length === 0) {
        if (capabilities.includes('code_generation')) addReco('github-copilot', 90, "Best for Code");
        else addReco('chatgpt', 85, "Versatile Generalist");
      }

      performanceMonitor.mark('reco-end');
      performanceMonitor.measure('recommendation-engine', 'reco-start', 'reco-end');
      
      return recommendations.sort((a, b) => b.score - a.score);
    });
  }

  // Phase 3.2: Risk Monitor
  async getRiskProfile(platformId: string): Promise<VendorRiskProfile> {
    return this.circuitBreaker.execute(async () => {
      // Mock Data - In production this hits an external Risk API
      const profiles: Record<string, Partial<VendorRiskProfile>> = {
        'copilot': { riskScore: 12, trend: 'stable', uptimesla: 99.9 },
        'gemini': { riskScore: 15, trend: 'stable', uptimesla: 99.9 },
        'chatgpt': { riskScore: 25, trend: 'improving', uptimesla: 99.5 },
        'claude': { riskScore: 8, trend: 'stable', uptimesla: 99.9 },
        'perplexity': { riskScore: 30, trend: 'stable', uptimesla: 99.0 }
      };

      const profile = profiles[platformId] || { riskScore: 50, trend: 'unknown' };

      return {
        platformId,
        riskScore: profile.riskScore || 50,
        trend: profile.trend as any,
        uptimesla: profile.uptimesla || 99.0,
        lastIncident: undefined,
        events: []
      };
    });
  }

  // Phase 3.3: ROI Tracking
  async getROIRealization(scenarioId: string): Promise<ROIRealizationEntry[]> {
    return this.circuitBreaker.execute(async () => {
      // Simulating a DB call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return [
        { period: 'Month 1', projectedCost: 85000, actualCost: 85000, projectedAdoption: 10, actualAdoption: 12, productivityGainActual: 0 },
        { period: 'Month 3', projectedCost: 145000, actualCost: 140000, projectedAdoption: 30, actualAdoption: 35, productivityGainActual: 50000 },
        { period: 'Month 6', projectedCost: 205000, actualCost: 195000, projectedAdoption: 60, actualAdoption: 65, productivityGainActual: 250000 },
        { period: 'Month 12', projectedCost: 325000, actualCost: 310000, projectedAdoption: 80, actualAdoption: 82, productivityGainActual: 1200000 },
      ];
    });
  }
}

export const intelligenceService = new IntelligenceService();
