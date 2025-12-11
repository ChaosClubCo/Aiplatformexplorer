import { Platform } from '../types';
import { RecommendationScore, UserAnswers, UserAnswer } from '../types/recommendation';
import { USE_CASE_SCORE_MAP, ECOSYSTEM_PLATFORM_MAP } from '../data/questions';

/**
 * Main recommendation engine
 * Calculates scores for all platforms based on user answers
 */
export function calculateRecommendations(
  platforms: Platform[],
  answers: UserAnswers
): RecommendationScore[] {
  const scores = platforms.map(platform => {
    // 1. Requirements Score (Must-match: 40% weight)
    const reqScore = calculateRequirementsScore(platform, answers);
    
    // 2. Constraints Score (Deal-breakers: 40% weight)
    const constraintScore = calculateConstraintsScore(platform, answers);
    
    // 3. Priorities Score (Nice-to-haves: 20% weight)
    const priorityScore = calculatePrioritiesScore(platform, answers);
    
    // Weighted total
    const totalScore = 
      (reqScore * 0.4) + 
      (constraintScore * 0.4) + 
      (priorityScore * 0.2);
    
    // Confidence based on data completeness and answer certainty
    const confidence = calculateConfidence(platform, answers, {
      reqScore,
      constraintScore,
      priorityScore
    });
    
    // Generate reasoning
    const reasons = generateReasons(platform, answers, {
      reqScore,
      constraintScore,
      priorityScore
    });
    
    return {
      platform,
      totalScore,
      confidence,
      matchBreakdown: {
        requirements: reqScore,
        constraints: constraintScore,
        priorities: priorityScore
      },
      reasons,
      rank: 0 // Will be set after sorting
    };
  })
  .sort((a, b) => b.totalScore - a.totalScore)
  .map((score, index) => ({ ...score, rank: index + 1 }));
  
  return scores;
}

/**
 * Calculate requirements score (40% weight)
 */
function calculateRequirementsScore(
  platform: Platform,
  answers: UserAnswers
): number {
  let score = 0;
  let maxScore = 0;
  
  // Primary use case alignment
  const primaryUseCase = answers['primary-use-case'];
  if (primaryUseCase) {
    maxScore += 100;
    const scoreKey = USE_CASE_SCORE_MAP[primaryUseCase.value as string];
    if (scoreKey) {
      score += platform.scores[scoreKey] * 10;
    }
  }
  
  // Team size support
  const teamSize = answers['team-size'];
  if (teamSize) {
    maxScore += 100;
    const size = teamSize.value as number;
    
    if (size > 1000) {
      // Enterprise platforms for large teams
      if (platform.category === 'enterprise') {
        score += 100;
      } else if (platform.category === 'crm') {
        score += 80;
      } else {
        score += 40;
      }
    } else if (size > 100) {
      // Mid-market
      if (platform.category === 'enterprise' || platform.category === 'crm') {
        score += 90;
      } else if (platform.category === 'developer') {
        score += 70;
      } else {
        score += 60;
      }
    } else {
      // Small teams - developer tools work great
      if (platform.category === 'developer') {
        score += 100;
      } else if (platform.category === 'research') {
        score += 85;
      } else {
        score += 70;
      }
    }
  }
  
  // Integration needs
  const integrations = answers['integration-needs'];
  if (integrations && integrations.selectedOptions) {
    maxScore += 100;
    let integrationScore = 0;
    
    integrations.selectedOptions.forEach(opt => {
      if (opt.value === 'microsoft' && ['copilot', 'azure-openai'].includes(platform.id)) {
        integrationScore += 100;
      } else if (opt.value === 'google' && ['gemini', 'vertex-ai'].includes(platform.id)) {
        integrationScore += 100;
      } else if (opt.value === 'salesforce' && ['agentforce', 'einstein'].includes(platform.id)) {
        integrationScore += 100;
      } else if (opt.value === 'api' && platform.scores.apiAccess >= 8) {
        integrationScore += 90;
      } else if (opt.value === 'none') {
        integrationScore += 70;
      } else {
        integrationScore += 50; // Partial credit
      }
    });
    
    score += Math.min(100, integrationScore / integrations.selectedOptions.length);
  }
  
  return maxScore > 0 ? (score / maxScore) * 100 : 0;
}

/**
 * Calculate constraints score (40% weight)
 * Start at 100, deduct for mismatches
 */
function calculateConstraintsScore(
  platform: Platform,
  answers: UserAnswers
): number {
  let score = 100;
  
  // Budget constraint (hard limit)
  const budget = answers['budget-per-user'];
  if (budget) {
    const budgetLimit = budget.value as number;
    if (platform.pricingValue > budgetLimit) {
      // Heavy penalty for budget overage
      const overage = (platform.pricingValue - budgetLimit) / budgetLimit;
      score -= Math.min(50, overage * 30); // Max 50 point penalty
    } else if (platform.pricingValue < budgetLimit * 0.5) {
      // Small bonus for being well under budget
      score += 5;
    }
  }
  
  // Compliance requirements (critical)
  const compliance = answers['compliance-needs'];
  if (compliance && compliance.selectedOptions) {
    const requiredCerts = compliance.selectedOptions.filter(opt => opt.value !== 'none');
    
    if (requiredCerts.length > 0) {
      const complianceMap: { [key: string]: string } = {
        'soc2': 'SOC 2',
        'iso27001': 'ISO 27001',
        'gdpr': 'GDPR',
        'hipaa': 'HIPAA',
        'fedramp': 'FedRAMP'
      };
      
      const missingCerts = requiredCerts.filter(cert => {
        const certName = complianceMap[cert.value as string];
        return certName && !platform.compliance.includes(certName);
      });
      
      // 15 points per missing cert
      score -= missingCerts.length * 15;
    }
  }
  
  // Ecosystem compatibility
  const ecosystem = answers['existing-ecosystem'];
  if (ecosystem) {
    const ecosystemKey = ecosystem.value as string;
    const preferredPlatforms = ECOSYSTEM_PLATFORM_MAP[ecosystemKey];
    
    if (preferredPlatforms && preferredPlatforms.length > 0) {
      if (preferredPlatforms.includes(platform.id)) {
        score += 20; // Bonus for native integration
      } else {
        score -= 10; // Penalty for different ecosystem
      }
    }
  }
  
  // Data residency
  const residency = answers['data-residency'];
  if (residency && residency.selectedOptions) {
    const hasFlexible = residency.selectedOptions.some(opt => 
      opt.value === 'flexible' || opt.value === 'global'
    );
    
    if (!hasFlexible) {
      // Check if platform supports required regions
      // For now, assume major platforms support all regions
      // In production, this would check platform.dataResidency
      const supportedRegions = ['us', 'eu', 'uk', 'global'];
      const unsupportedRegions = residency.selectedOptions.filter(opt =>
        !supportedRegions.includes(opt.value as string)
      );
      
      if (unsupportedRegions.length > 0) {
        score -= 20;
      }
    }
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate priorities score (20% weight)
 */
function calculatePrioritiesScore(
  platform: Platform,
  answers: UserAnswers
): number {
  let score = 0;
  let maxScore = 0;
  
  // Capability priorities
  const capPriorities = answers['capability-priorities'];
  if (capPriorities && capPriorities.value) {
    maxScore += 100;
    const priorityList = capPriorities.value as string[];
    
    // Top priority gets 100%, second gets 80%, third 60%, etc.
    let capScore = 0;
    priorityList.forEach((cap, index) => {
      const weight = 100 - (index * 15); // Diminishing weights
      const scoreKey = USE_CASE_SCORE_MAP[cap];
      if (scoreKey) {
        capScore += (platform.scores[scoreKey] / 10) * weight;
      }
    });
    
    score += capScore / priorityList.length;
  }
  
  // Implementation speed
  const speed = answers['implementation-speed'];
  if (speed && speed.selectedOptions && speed.selectedOptions[0]) {
    maxScore += 100;
    const speedValue = speed.selectedOptions[0].value as string;
    
    const implTimeMap: { [key: string]: number } = {
      '1-2 weeks': 100,
      '2-4 weeks': 90,
      '4-8 weeks': 70,
      '8-12 weeks': 50,
      '3-6 months': 30
    };
    
    const platformSpeed = implTimeMap[platform.implementationTime] || 60;
    
    if (speedValue === 'immediate' && platformSpeed >= 90) {
      score += 100;
    } else if (speedValue === 'fast' && platformSpeed >= 70) {
      score += 90;
    } else if (speedValue === 'standard') {
      score += 80;
    } else {
      score += 70;
    }
  }
  
  // Context window importance
  const contextImportance = answers['context-window-importance'];
  if (contextImportance && contextImportance.selectedOptions && contextImportance.selectedOptions[0]) {
    maxScore += 100;
    const importance = contextImportance.selectedOptions[0].value as string;
    
    if (importance === 'critical' && platform.contextTokens >= 100000) {
      score += 100;
    } else if (importance === 'important' && platform.contextTokens >= 50000) {
      score += 90;
    } else if (importance === 'nice' && platform.contextTokens >= 10000) {
      score += 80;
    } else {
      score += 60;
    }
  }
  
  // Market leader preference
  const marketPref = answers['market-leader-preference'];
  if (marketPref && marketPref.selectedOptions && marketPref.selectedOptions[0]) {
    maxScore += 100;
    const pref = marketPref.selectedOptions[0].value as string;
    
    if (pref === 'critical' && platform.marketSharePercent >= 30) {
      score += 100;
    } else if (pref === 'important' && platform.marketSharePercent >= 15) {
      score += 90;
    } else if (pref === 'neutral') {
      score += 80;
    } else if (pref === 'underdog' && platform.marketSharePercent < 10) {
      score += 100;
    } else {
      score += 60;
    }
  }
  
  return maxScore > 0 ? (score / maxScore) * 100 : 0;
}

/**
 * Calculate confidence score
 */
function calculateConfidence(
  platform: Platform,
  answers: UserAnswers,
  scores: { reqScore: number; constraintScore: number; priorityScore: number }
): number {
  let confidence = 80; // Base confidence
  
  // Higher confidence if all scores are high
  const avgScore = (scores.reqScore + scores.constraintScore + scores.priorityScore) / 3;
  if (avgScore >= 85) {
    confidence += 10;
  } else if (avgScore >= 70) {
    confidence += 5;
  } else if (avgScore < 50) {
    confidence -= 10;
  }
  
  // Lower confidence if constraints score is low (deal-breaker issues)
  if (scores.constraintScore < 60) {
    confidence -= 15;
  }
  
  // Higher confidence for well-established platforms
  if (platform.marketSharePercent > 20) {
    confidence += 5;
  }
  
  // Number of answers affects confidence
  const answerCount = Object.keys(answers).length;
  if (answerCount < 5) {
    confidence -= 10;
  } else if (answerCount >= 10) {
    confidence += 5;
  }
  
  return Math.max(0, Math.min(100, confidence));
}

/**
 * Generate reasoning for the recommendation
 */
function generateReasons(
  platform: Platform,
  answers: UserAnswers,
  scores: { reqScore: number; constraintScore: number; priorityScore: number }
): { strengths: string[]; concerns: string[]; differentiators: string[] } {
  const strengths: string[] = [];
  const concerns: string[] = [];
  const differentiators: string[] = [];
  
  // STRENGTHS
  
  // Use case alignment
  const primaryUseCase = answers['primary-use-case'];
  if (primaryUseCase) {
    const scoreKey = USE_CASE_SCORE_MAP[primaryUseCase.value as string];
    if (scoreKey && platform.scores[scoreKey] >= 8) {
      const useCaseLabel = primaryUseCase.selectedOptions?.[0]?.label || 'your use case';
      strengths.push(`Excellent for ${useCaseLabel} (${platform.scores[scoreKey]}/10 rating)`);
    }
  }
  
  // Compliance
  if (platform.complianceCount >= 4) {
    strengths.push(`Strong compliance coverage (${platform.complianceCount} certifications)`);
  }
  
  // Implementation speed
  const speed = answers['implementation-speed'];
  if (speed && speed.selectedOptions && speed.selectedOptions[0]) {
    const speedValue = speed.selectedOptions[0].value;
    if ((speedValue === 'immediate' || speedValue === 'fast') && 
        (platform.implementationTime === '1-2 weeks' || platform.implementationTime === '2-4 weeks')) {
      strengths.push(`Fast implementation timeline (${platform.implementationTime}) matches your needs`);
    }
  }
  
  // Market position
  if (platform.marketSharePercent > 30) {
    strengths.push(`Market leader with ${platform.marketShare} adoption`);
  }
  
  // Growth
  if (platform.growthRate > 50) {
    strengths.push(`Rapidly growing (${platform.growthRate}% YoY growth)`);
  }
  
  // Add platform-specific strengths
  if (platform.strengths.length > 0) {
    strengths.push(...platform.strengths.slice(0, 2));
  }
  
  // CONCERNS
  
  // Budget
  const budget = answers['budget-per-user'];
  if (budget) {
    const budgetLimit = budget.value as number;
    if (platform.pricingValue > budgetLimit) {
      const overagePercent = Math.round(((platform.pricingValue - budgetLimit) / budgetLimit) * 100);
      concerns.push(`Price ($${platform.pricingValue}/user/mo) is ${overagePercent}% above your budget`);
    }
  }
  
  // Missing compliance
  const compliance = answers['compliance-needs'];
  if (compliance && compliance.selectedOptions) {
    const requiredCerts = compliance.selectedOptions.filter(opt => opt.value !== 'none');
    const complianceMap: { [key: string]: string } = {
      'soc2': 'SOC 2',
      'iso27001': 'ISO 27001',
      'gdpr': 'GDPR',
      'hipaa': 'HIPAA',
      'fedramp': 'FedRAMP'
    };
    
    const missing = requiredCerts
      .filter(cert => {
        const certName = complianceMap[cert.value as string];
        return certName && !platform.compliance.includes(certName);
      })
      .map(cert => complianceMap[cert.value as string]);
    
    if (missing.length > 0) {
      concerns.push(`Missing required certifications: ${missing.join(', ')}`);
    }
  }
  
  // Team size mismatch
  const teamSize = answers['team-size'];
  if (teamSize) {
    const size = teamSize.value as number;
    if (size > 500 && platform.category !== 'enterprise' && platform.category !== 'crm') {
      concerns.push('May not be optimized for enterprise-scale deployment');
    } else if (size < 50 && platform.category === 'enterprise') {
      concerns.push('Enterprise platform may be overkill for small teams');
    }
  }
  
  // Ecosystem mismatch
  const ecosystem = answers['existing-ecosystem'];
  if (ecosystem) {
    const ecosystemKey = ecosystem.value as string;
    const preferredPlatforms = ECOSYSTEM_PLATFORM_MAP[ecosystemKey];
    
    if (preferredPlatforms && preferredPlatforms.length > 0 && !preferredPlatforms.includes(platform.id)) {
      const ecosystemLabel = ecosystem.selectedOptions?.[0]?.label || 'your ecosystem';
      concerns.push(`Not natively integrated with ${ecosystemLabel}`);
    }
  }
  
  // DIFFERENTIATORS
  
  // Context window
  if (platform.contextTokens > 100000) {
    differentiators.push(`Large context window (${platform.contextWindow}) for complex tasks`);
  }
  
  // INT priority
  if (platform.intPriority === 'BASELINE') {
    differentiators.push('Industry-standard baseline platform for broad adoption');
  } else if (platform.intPriority === 'SPECIALIST') {
    differentiators.push('Specialist tool for specific use cases');
  }
  
  // Multimodal
  if (platform.multimodal === 'Yes') {
    differentiators.push('Supports text, images, audio, and video');
  }
  
  // Customization
  if (platform.scores.customization >= 8) {
    differentiators.push('Highly customizable to your needs');
  }
  
  // API access
  if (platform.scores.apiAccess >= 9) {
    differentiators.push('Excellent API access for custom integrations');
  }
  
  return {
    strengths: strengths.slice(0, 5),
    concerns: concerns.slice(0, 4),
    differentiators: differentiators.slice(0, 3)
  };
}

/**
 * Calculate average score across all capability dimensions
 */
export function calculateAverageScore(platform: Platform): number {
  const scores = Object.values(platform.scores);
  return scores.reduce((sum, score) => sum + score, 0) / scores.length;
}

/**
 * Export recommendations as structured data
 */
export function exportRecommendations(
  recommendations: RecommendationScore[],
  answers: UserAnswers
): string {
  const data = {
    generatedAt: new Date().toISOString(),
    client: 'INT Inc.',
    userRequirements: Object.entries(answers).map(([qId, answer]) => ({
      question: qId,
      answer: answer.value,
      selectedOptions: answer.selectedOptions?.map(opt => opt.label)
    })),
    recommendations: recommendations.map(rec => ({
      rank: rec.rank,
      platform: rec.platform.name,
      provider: rec.platform.provider,
      totalScore: Math.round(rec.totalScore),
      confidence: Math.round(rec.confidence),
      breakdown: {
        requirements: Math.round(rec.matchBreakdown.requirements),
        constraints: Math.round(rec.matchBreakdown.constraints),
        priorities: Math.round(rec.matchBreakdown.priorities)
      },
      strengths: rec.reasons.strengths,
      concerns: rec.reasons.concerns,
      differentiators: rec.reasons.differentiators,
      pricing: rec.platform.pricing,
      marketShare: rec.platform.marketShare,
      implementationTime: rec.platform.implementationTime
    }))
  };
  
  return JSON.stringify(data, null, 2);
}
