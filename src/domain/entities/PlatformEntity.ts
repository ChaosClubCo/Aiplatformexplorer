/**
 * Platform Domain Entity
 * 
 * @description Domain-Driven Design entity for AI Platform
 * @module domain/entities/PlatformEntity
 */

import { Platform } from '../../types';

/**
 * Platform Value Objects
 */
export class PlatformId {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Platform ID cannot be empty');
    }
  }
  
  static create(id: string): PlatformId {
    return new PlatformId(id);
  }
  
  getValue(): string {
    return this.value;
  }
  
  equals(other: PlatformId): boolean {
    return this.value === other.value;
  }
}

export class PlatformName {
  private constructor(private readonly value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Platform name cannot be empty');
    }
    if (value.length > 100) {
      throw new Error('Platform name too long');
    }
  }
  
  static create(name: string): PlatformName {
    return new PlatformName(name.trim());
  }
  
  getValue(): string {
    return this.value;
  }
}

export class MarketShare {
  private constructor(private readonly percentage: number) {
    if (percentage < 0 || percentage > 100) {
      throw new Error('Market share must be between 0 and 100');
    }
  }
  
  static create(percentage: number): MarketShare {
    return new MarketShare(percentage);
  }
  
  getValue(): number {
    return this.percentage;
  }
  
  isLeader(): boolean {
    return this.percentage >= 50;
  }
  
  isSignificant(): boolean {
    return this.percentage >= 10;
  }
}

export class PricingModel {
  private constructor(
    private readonly value: number,
    private readonly unit: 'user/month' | 'api-call' | 'custom'
  ) {
    if (value < 0) {
      throw new Error('Pricing cannot be negative');
    }
  }
  
  static create(value: number, unit: 'user/month' | 'api-call' | 'custom' = 'user/month'): PricingModel {
    return new PricingModel(value, unit);
  }
  
  getValue(): number {
    return this.value;
  }
  
  getUnit(): string {
    return this.unit;
  }
  
  format(): string {
    return `$${this.value}/${this.unit}`;
  }
  
  compareTo(other: PricingModel): number {
    return this.value - other.getValue();
  }
  
  isAffordable(budget: number): boolean {
    return this.value <= budget;
  }
}

export class CapabilityScore {
  private constructor(private readonly score: number) {
    if (score < 0 || score > 10) {
      throw new Error('Score must be between 0 and 10');
    }
  }
  
  static create(score: number): CapabilityScore {
    return new CapabilityScore(score);
  }
  
  getValue(): number {
    return this.score;
  }
  
  getRating(): 'poor' | 'fair' | 'good' | 'excellent' {
    if (this.score < 3) return 'poor';
    if (this.score < 6) return 'fair';
    if (this.score < 8) return 'good';
    return 'excellent';
  }
  
  isAcceptable(): boolean {
    return this.score >= 5;
  }
}

export class ComplianceSet {
  private constructor(private readonly standards: Set<string>) {}
  
  static create(standards: string[]): ComplianceSet {
    return new ComplianceSet(new Set(standards));
  }
  
  has(standard: string): boolean {
    return this.standards.has(standard);
  }
  
  getAll(): string[] {
    return Array.from(this.standards);
  }
  
  count(): number {
    return this.standards.size;
  }
  
  meetsRequirement(required: string[]): boolean {
    return required.every(std => this.standards.has(std));
  }
  
  isEnterpriseReady(): boolean {
    return this.has('SOC 2') && this.has('ISO 27001');
  }
  
  isHealthcareReady(): boolean {
    return this.has('HIPAA');
  }
  
  isEUCompliant(): boolean {
    return this.has('GDPR');
  }
}

/**
 * Platform Aggregate Root
 */
export class PlatformEntity {
  private constructor(
    private readonly id: PlatformId,
    private name: PlatformName,
    private readonly provider: string,
    private marketShare: MarketShare,
    private pricing: PricingModel,
    private compliance: ComplianceSet,
    private scores: Map<string, CapabilityScore>,
    private readonly metadata: Platform
  ) {}
  
  /**
   * Factory method to create from data
   */
  static create(data: Platform): PlatformEntity {
    const scores = new Map<string, CapabilityScore>();
    Object.entries(data.scores).forEach(([key, value]) => {
      scores.set(key, CapabilityScore.create(value));
    });
    
    return new PlatformEntity(
      PlatformId.create(data.id),
      PlatformName.create(data.name),
      data.provider,
      MarketShare.create(data.marketSharePercent),
      PricingModel.create(data.pricingValue),
      ComplianceSet.create(data.compliance),
      scores,
      data
    );
  }
  
  /**
   * Getters
   */
  getId(): string {
    return this.id.getValue();
  }
  
  getName(): string {
    return this.name.getValue();
  }
  
  getProvider(): string {
    return this.provider;
  }
  
  getMarketShare(): number {
    return this.marketShare.getValue();
  }
  
  getPricing(): number {
    return this.pricing.getValue();
  }
  
  getCompliance(): string[] {
    return this.compliance.getAll();
  }
  
  getScore(capability: string): number | null {
    const score = this.scores.get(capability);
    return score ? score.getValue() : null;
  }
  
  getAverageScore(): number {
    const scores = Array.from(this.scores.values());
    if (scores.length === 0) return 0;
    
    const sum = scores.reduce((acc, score) => acc + score.getValue(), 0);
    return sum / scores.length;
  }
  
  toPlainObject(): Platform {
    return this.metadata;
  }
  
  /**
   * Business logic methods
   */
  isMarketLeader(): boolean {
    return this.marketShare.isLeader();
  }
  
  isEnterpriseReady(): boolean {
    return this.compliance.isEnterpriseReady();
  }
  
  isHealthcareCompliant(): boolean {
    return this.compliance.isHealthcareReady();
  }
  
  isEUCompliant(): boolean {
    return this.compliance.isEUCompliant();
  }
  
  isAffordable(budget: number): boolean {
    return this.pricing.isAffordable(budget);
  }
  
  meetsRequirements(requirements: {
    minMarketShare?: number;
    maxPrice?: number;
    requiredCompliance?: string[];
    minScores?: Record<string, number>;
  }): boolean {
    // Check market share
    if (requirements.minMarketShare !== undefined) {
      if (this.marketShare.getValue() < requirements.minMarketShare) {
        return false;
      }
    }
    
    // Check pricing
    if (requirements.maxPrice !== undefined) {
      if (!this.pricing.isAffordable(requirements.maxPrice)) {
        return false;
      }
    }
    
    // Check compliance
    if (requirements.requiredCompliance) {
      if (!this.compliance.meetsRequirement(requirements.requiredCompliance)) {
        return false;
      }
    }
    
    // Check scores
    if (requirements.minScores) {
      for (const [capability, minScore] of Object.entries(requirements.minScores)) {
        const score = this.getScore(capability);
        if (score === null || score < minScore) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  /**
   * Calculate compatibility score with use case
   */
  calculateCompatibility(useCase: {
    capabilities: Record<string, number>; // capability -> weight (0-1)
    budget?: number;
    requiredCompliance?: string[];
  }): number {
    let score = 0;
    let totalWeight = 0;
    
    // Score based on capabilities
    for (const [capability, weight] of Object.entries(useCase.capabilities)) {
      const capabilityScore = this.getScore(capability);
      if (capabilityScore !== null) {
        score += (capabilityScore / 10) * weight * 100;
        totalWeight += weight;
      }
    }
    
    // Normalize capability score
    const capabilityScore = totalWeight > 0 ? score / totalWeight : 0;
    
    // Budget penalty
    let budgetScore = 100;
    if (useCase.budget) {
      if (!this.isAffordable(useCase.budget)) {
        budgetScore = 0;
      } else {
        // Score based on how much budget is left
        const utilizationRatio = this.pricing.getValue() / useCase.budget;
        budgetScore = Math.max(0, 100 - (utilizationRatio * 50));
      }
    }
    
    // Compliance requirement
    let complianceScore = 100;
    if (useCase.requiredCompliance && useCase.requiredCompliance.length > 0) {
      if (!this.compliance.meetsRequirement(useCase.requiredCompliance)) {
        complianceScore = 0;
      }
    }
    
    // Weighted final score
    const finalScore = (capabilityScore * 0.6) + (budgetScore * 0.2) + (complianceScore * 0.2);
    
    return Math.round(finalScore);
  }
  
  /**
   * Compare with another platform
   */
  compareTo(other: PlatformEntity, weights: {
    marketShare?: number;
    pricing?: number;
    capabilities?: number;
    compliance?: number;
  } = {}): number {
    const defaultWeights = {
      marketShare: 0.2,
      pricing: 0.3,
      capabilities: 0.4,
      compliance: 0.1,
      ...weights,
    };
    
    let score = 0;
    
    // Market share comparison
    const marketShareDiff = this.getMarketShare() - other.getMarketShare();
    score += marketShareDiff * defaultWeights.marketShare;
    
    // Pricing comparison (lower is better)
    const pricingDiff = other.getPricing() - this.getPricing();
    score += pricingDiff * defaultWeights.pricing;
    
    // Capabilities comparison
    const avgScoreDiff = this.getAverageScore() - other.getAverageScore();
    score += avgScoreDiff * 10 * defaultWeights.capabilities;
    
    // Compliance comparison
    const complianceDiff = this.compliance.count() - other.compliance.count();
    score += complianceDiff * 5 * defaultWeights.compliance;
    
    return score;
  }
  
  /**
   * Clone with modifications
   */
  clone(modifications?: Partial<Platform>): PlatformEntity {
    const newData = { ...this.metadata, ...modifications };
    return PlatformEntity.create(newData);
  }
  
  /**
   * Domain events
   */
  static events = {
    PLATFORM_CREATED: 'platform.created',
    PLATFORM_UPDATED: 'platform.updated',
    PLATFORM_DELETED: 'platform.deleted',
    PLATFORM_SELECTED: 'platform.selected',
    PLATFORM_COMPARED: 'platform.compared',
  } as const;
}

/**
 * Platform Repository Interface
 */
export interface IPlatformRepository {
  findById(id: string): Promise<PlatformEntity | null>;
  findAll(): Promise<PlatformEntity[]>;
  findByProvider(provider: string): Promise<PlatformEntity[]>;
  findByCategory(category: string): Promise<PlatformEntity[]>;
  findMatching(requirements: any): Promise<PlatformEntity[]>;
  save(platform: PlatformEntity): Promise<void>;
  delete(id: string): Promise<void>;
}

/**
 * Platform Specification Pattern
 */
export interface IPlatformSpecification {
  isSatisfiedBy(platform: PlatformEntity): boolean;
  and(other: IPlatformSpecification): IPlatformSpecification;
  or(other: IPlatformSpecification): IPlatformSpecification;
  not(): IPlatformSpecification;
}

export class PlatformSpecification implements IPlatformSpecification {
  constructor(private readonly predicate: (platform: PlatformEntity) => boolean) {}
  
  isSatisfiedBy(platform: PlatformEntity): boolean {
    return this.predicate(platform);
  }
  
  and(other: IPlatformSpecification): IPlatformSpecification {
    return new PlatformSpecification(
      (platform) => this.isSatisfiedBy(platform) && other.isSatisfiedBy(platform)
    );
  }
  
  or(other: IPlatformSpecification): IPlatformSpecification {
    return new PlatformSpecification(
      (platform) => this.isSatisfiedBy(platform) || other.isSatisfiedBy(platform)
    );
  }
  
  not(): IPlatformSpecification {
    return new PlatformSpecification(
      (platform) => !this.isSatisfiedBy(platform)
    );
  }
}

/**
 * Common Specifications
 */
export const PlatformSpecs = {
  isEnterpriseReady: (): IPlatformSpecification =>
    new PlatformSpecification((p) => p.isEnterpriseReady()),
  
  isAffordable: (budget: number): IPlatformSpecification =>
    new PlatformSpecification((p) => p.isAffordable(budget)),
  
  hasMinScore: (capability: string, minScore: number): IPlatformSpecification =>
    new PlatformSpecification((p) => {
      const score = p.getScore(capability);
      return score !== null && score >= minScore;
    }),
  
  hasMarketShare: (minPercent: number): IPlatformSpecification =>
    new PlatformSpecification((p) => p.getMarketShare() >= minPercent),
  
  isProvider: (provider: string): IPlatformSpecification =>
    new PlatformSpecification((p) => p.getProvider() === provider),
};
