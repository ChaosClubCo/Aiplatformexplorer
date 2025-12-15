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
    // 1. Ecosystem Fit (Critical Strategic Driver)
    const ecosystemScore = calculateEcosystemScore(platform, answers);
    
    // 2. Departmental Fit (Functional alignment)
    const departmentScore = calculateDepartmentScore(platform, answers);
    
    // 3. Use Case Fit (Capability alignment)
    const useCaseScore = calculateUseCaseScore(platform, answers);

    // 4. Constraints (Budget & Compliance)
    const constraintScore = calculateConstraintsScore(platform, answers);
    
    // Weighted total
    // Ecosystem is dominant factor for "Primary" platform
    // Department is dominant for "Specialized" platform
    const totalScore = 
      (ecosystemScore * 0.35) + 
      (departmentScore * 0.25) +
      (useCaseScore * 0.20) +
      (constraintScore * 0.20);
    
    // Confidence based on clear signals
    const confidence = calculateConfidence(platform, answers, totalScore);
    
    // Generate reasoning
    const reasons = generateReasons(platform, answers, {
      ecosystemScore,
      departmentScore,
      useCaseScore
    });
    
    return {
      platform,
      totalScore,
      confidence,
      matchBreakdown: {
        requirements: ecosystemScore, // Mapping for UI compatibility
        constraints: constraintScore,
        priorities: departmentScore // Mapping department to priority visual
      },
      reasons,
      rank: 0 // Will be set after sorting
    };
  })
  .sort((a, b) => b.totalScore - a.totalScore)
  .map((score, index) => ({ ...score, rank: index + 1 }));
  
  return scores;
}

function calculateEcosystemScore(platform: Platform, answers: UserAnswers): number {
  const ecosystem = answers['existing-ecosystem']?.value;
  if (!ecosystem) return 50; // Neutral start

  if (ecosystem === 'microsoft') {
    if (platform.id === 'copilot' || platform.id === 'github-copilot') return 100;
    if (platform.id === 'copilot-studio') return 95;
    // Specialized tools work fine with MS
    if (['claude', 'perplexity', 'chatgpt'].includes(platform.id)) return 70;
    // Google works poorly with MS ecosystem
    if (platform.id === 'gemini') return 30;
  }

  if (ecosystem === 'google') {
    if (platform.id === 'gemini') return 100;
    if (['claude', 'perplexity', 'chatgpt'].includes(platform.id)) return 75;
    if (platform.id === 'copilot') return 30;
  }

  if (ecosystem === 'mixed') {
    // Best-of-breed approach
    if (['chatgpt', 'claude', 'perplexity'].includes(platform.id)) return 90;
    return 70; // All enterprise platforms valid
  }

  return 60;
}

function calculateDepartmentScore(platform: Platform, answers: UserAnswers): number {
  const dept = answers['department']?.value;
  if (!dept) return 50;

  // Mappings from Executive Summary
  switch (dept) {
    case 'sales':
    case 'finance':
      if (platform.id === 'copilot') return 100; // CRM & Excel
      if (platform.id === 'salesforce-agentforce') return 90;
      break;
    case 'marketing':
      if (platform.id === 'chatgpt') return 100; // Creative
      if (platform.id === 'gemini') return 90; // Analytics
      break;
    case 'service':
      if (platform.id === 'gemini') return 100; // Multilingual
      if (platform.id === 'salesforce-agentforce') return 90;
      break;
    case 'it':
      if (platform.id === 'github-copilot') return 100;
      if (platform.id === 'copilot') return 90;
      break;
    case 'legal':
      if (platform.id === 'claude') return 100; // Context & Safety
      break;
    case 'hr':
      if (platform.id === 'chatgpt') return 90; // Job descriptions
      if (platform.id === 'claude') return 90; // Screening
      break;
    case 'strategy':
    case 'r_and_d':
      if (platform.id === 'perplexity') return 100; // Research
      if (platform.id === 'claude') return 90; // Analysis
      break;
  }

  return 50; // Neutral baseline
}

function calculateUseCaseScore(platform: Platform, answers: UserAnswers): number {
  const useCase = answers['primary-use-case']?.value;
  if (!useCase) return 50;

  switch (useCase) {
    case 'code':
      if (platform.id === 'github-copilot') return 100;
      if (platform.id === 'gemini') return 90;
      break;
    case 'creative':
      if (platform.id === 'chatgpt') return 100;
      break;
    case 'research':
      if (platform.id === 'perplexity') return 100;
      break;
    case 'compliance':
      if (platform.id === 'claude') return 100;
      break;
    case 'multilingual':
      if (platform.id === 'gemini') return 100;
      break;
    case 'productivity':
      if (platform.id === 'copilot') return 95;
      if (platform.id === 'gemini') return 90;
      break;
  }
  
  return platform.scores.reasoning * 10; // Fallback to general capability
}

function calculateConstraintsScore(platform: Platform, answers: UserAnswers): number {
  let score = 100;

  // Compliance Check
  const compliance = answers['compliance-needs']?.selectedOptions;
  if (compliance) {
    const needed = compliance.map(c => c.value).filter(v => v !== 'none');
    // Map answer values to platform strings
    const map: Record<string, string> = { 'soc2': 'SOC 2', 'hipaa': 'HIPAA', 'gdpr': 'GDPR' };
    
    needed.forEach(n => {
      const key = map[n as string];
      if (key && !platform.compliance.includes(key)) score -= 30; // Hard hit
    });
  }

  // Budget Check
  const budget = answers['budget-per-user']?.value;
  if (budget === 'low' && platform.pricingValue > 20) score -= 40;
  if (budget === 'standard' && platform.pricingValue > 30) score -= 20;

  return Math.max(0, score);
}

function calculateConfidence(platform: Platform, answers: UserAnswers, totalScore: number): number {
  let confidence = 85;
  // If mixed signals (e.g., MS Ecosystem but Google Dept preference), lower confidence
  return confidence;
}

function generateReasons(platform: Platform, answers: UserAnswers, scores: any) {
  const strengths = [];
  const concerns = [];
  const differentiators = [];

  const ecosystem = answers['existing-ecosystem']?.value;
  const dept = answers['department']?.value;

  if (scores.ecosystemScore > 80) strengths.push(`Perfect fit for your ${ecosystem} ecosystem`);
  if (scores.departmentScore > 80) strengths.push(`Top-tier performance for ${dept} workflows`);
  if (scores.useCaseScore > 90) strengths.push(`Industry leader for this use case`);

  if (platform.complianceCount >= 4) differentiators.push("Enterprise-grade compliance coverage");
  if (platform.multimodal === 'Yes') differentiators.push("Full multimodal capabilities");

  if (scores.ecosystemScore < 40) concerns.push(`Integration friction with ${ecosystem}`);
  
  return { strengths, concerns, differentiators };
}

export function calculateAverageScore(platform: Platform): number {
  return 85; // Placeholder
}

export function exportRecommendations(recommendations: RecommendationScore[], answers: UserAnswers): string {
  return JSON.stringify({ recommendations, answers }, null, 2);
}
