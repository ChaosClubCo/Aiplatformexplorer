/**
 * Platform Filter Utilities
 * Production-grade filtering logic for AI platforms
 * 
 * @module utils/platform/filterUtils
 */

import type { Platform, Filters } from '../../types';

/**
 * Filter platforms by search query
 * Searches across name, provider, category, and features
 */
export function filterBySearch(platforms: Platform[], search: string): Platform[] {
  if (!search.trim()) return platforms;
  
  const query = search.toLowerCase().trim();
  
  return platforms.filter(platform => {
    // Search in name
    if (platform.name.toLowerCase().includes(query)) return true;
    
    // Search in provider
    if (platform.provider.toLowerCase().includes(query)) return true;
    
    // Search in category
    if (platform.categoryLabel.toLowerCase().includes(query)) return true;
    
    // Search in features
    if (platform.features.some(f => f.toLowerCase().includes(query))) return true;
    
    // Search in compliance (if exists)
    if (platform.compliance && 
        platform.compliance.some(c => c.toLowerCase().includes(query))) {
      return true;
    }
    
    return false;
  });
}

/**
 * Filter platforms by provider
 */
export function filterByProvider(platforms: Platform[], provider: string): Platform[] {
  if (!provider || provider === 'all') return platforms;
  
  return platforms.filter(p => p.provider.toLowerCase() === provider.toLowerCase());
}

/**
 * Filter platforms by category
 */
export function filterByCategory(platforms: Platform[], category: string): Platform[] {
  if (!category || category === 'all') return platforms;
  
  return platforms.filter(p => p.category === category);
}

/**
 * Filter platforms by price range
 */
export function filterByPriceRange(
  platforms: Platform[],
  min: number,
  max: number
): Platform[] {
  return platforms.filter(p => {
    const price = p.pricingValue || 0;
    return price >= min && price <= max;
  });
}

/**
 * Filter platforms by market share range
 */
export function filterByMarketShare(
  platforms: Platform[],
  min: number,
  max: number
): Platform[] {
  return platforms.filter(p => {
    const marketShare = p.marketSharePercent || 0;
    return marketShare >= min && marketShare <= max;
  });
}

/**
 * Filter platforms by compliance requirements
 */
export function filterByCompliance(
  platforms: Platform[],
  required: string[]
): Platform[] {
  if (!required.length) return platforms;
  
  return platforms.filter(p => {
    if (!p.compliance) return false;
    
    // Platform must have ALL required compliance certifications
    return required.every(req => 
      p.compliance!.some(c => c.toLowerCase() === req.toLowerCase())
    );
  });
}

/**
 * Filter platforms by features
 */
export function filterByFeatures(
  platforms: Platform[],
  requiredFeatures: string[]
): Platform[] {
  if (!requiredFeatures.length) return platforms;
  
  return platforms.filter(p => {
    // Platform must have ALL required features
    return requiredFeatures.every(req =>
      p.features.some(f => f.toLowerCase().includes(req.toLowerCase()))
    );
  });
}

/**
 * Filter platforms by minimum score
 */
export function filterByMinScore(platforms: Platform[], minScore: number): Platform[] {
  return platforms.filter(p => (p.avgScore || 0) >= minScore);
}

/**
 * Filter platforms by context window size
 */
export function filterByContextWindow(
  platforms: Platform[],
  minTokens: number
): Platform[] {
  return platforms.filter(p => {
    // Extract numeric value from context window string
    const tokens = parseInt(p.contextWindow.replace(/[^\d]/g, ''));
    return tokens >= minTokens;
  });
}

/**
 * Filter platforms by multiple criteria (master filter)
 */
export function filterPlatforms(platforms: Platform[], filters: Filters): Platform[] {
  let filtered = platforms;
  
  // Apply search filter
  if (filters.search) {
    filtered = filterBySearch(filtered, filters.search);
  }
  
  // Apply provider filter
  if (filters.provider && filters.provider !== 'all') {
    filtered = filterByProvider(filtered, filters.provider);
  }
  
  // Apply category filter
  if (filters.category && filters.category !== 'all') {
    filtered = filterByCategory(filtered, filters.category);
  }
  
  // Apply price range filter (if exists)
  if (filters.priceRange) {
    filtered = filterByPriceRange(
      filtered,
      filters.priceRange.min,
      filters.priceRange.max
    );
  }
  
  // Apply market share filter (if exists)
  if (filters.marketShareRange) {
    filtered = filterByMarketShare(
      filtered,
      filters.marketShareRange.min,
      filters.marketShareRange.max
    );
  }
  
  // Apply compliance filter (if exists)
  if (filters.compliance && filters.compliance.length > 0) {
    filtered = filterByCompliance(filtered, filters.compliance);
  }
  
  // Apply features filter (if exists)
  if (filters.features && filters.features.length > 0) {
    filtered = filterByFeatures(filtered, filters.features);
  }
  
  // Apply minimum score filter (if exists)
  if (filters.minScore !== undefined) {
    filtered = filterByMinScore(filtered, filters.minScore);
  }
  
  return filtered;
}

/**
 * Get filter suggestions based on current platforms
 */
export function getFilterSuggestions(platforms: Platform[]): {
  providers: string[];
  categories: string[];
  features: string[];
  compliance: string[];
  priceRange: { min: number; max: number };
  marketShareRange: { min: number; max: number };
} {
  const providers = Array.from(new Set(platforms.map(p => p.provider))).sort();
  const categories = Array.from(new Set(platforms.map(p => p.category))).sort();
  
  const allFeatures = platforms.flatMap(p => p.features);
  const features = Array.from(new Set(allFeatures)).sort();
  
  const allCompliance = platforms.flatMap(p => p.compliance || []);
  const compliance = Array.from(new Set(allCompliance)).sort();
  
  const prices = platforms.map(p => p.pricingValue || 0);
  const priceRange = {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
  
  const marketShares = platforms.map(p => p.marketSharePercent || 0);
  const marketShareRange = {
    min: Math.min(...marketShares),
    max: Math.max(...marketShares),
  };
  
  return {
    providers,
    categories,
    features,
    compliance,
    priceRange,
    marketShareRange,
  };
}

/**
 * Count platforms matching filter criteria
 */
export function countFilteredPlatforms(
  platforms: Platform[],
  filters: Filters
): number {
  return filterPlatforms(platforms, filters).length;
}

/**
 * Check if any filters are active
 */
export function hasActiveFilters(filters: Filters): boolean {
  return !!(
    filters.search ||
    (filters.provider && filters.provider !== 'all') ||
    (filters.category && filters.category !== 'all') ||
    filters.priceRange ||
    filters.marketShareRange ||
    (filters.compliance && filters.compliance.length > 0) ||
    (filters.features && filters.features.length > 0) ||
    filters.minScore !== undefined
  );
}

/**
 * Clear all filters
 */
export function clearFilters(): Filters {
  return {
    provider: 'all',
    category: 'all',
    search: '',
    sortBy: 'marketShare-desc',
  };
}

/**
 * Get active filter count
 */
export function getActiveFilterCount(filters: Filters): number {
  let count = 0;
  
  if (filters.search) count++;
  if (filters.provider && filters.provider !== 'all') count++;
  if (filters.category && filters.category !== 'all') count++;
  if (filters.priceRange) count++;
  if (filters.marketShareRange) count++;
  if (filters.compliance && filters.compliance.length > 0) count++;
  if (filters.features && filters.features.length > 0) count++;
  if (filters.minScore !== undefined) count++;
  
  return count;
}

/**
 * Get filter summary text
 */
export function getFilterSummary(filters: Filters): string {
  const parts: string[] = [];
  
  if (filters.search) {
    parts.push(`search: "${filters.search}"`);
  }
  
  if (filters.provider && filters.provider !== 'all') {
    parts.push(`provider: ${filters.provider}`);
  }
  
  if (filters.category && filters.category !== 'all') {
    parts.push(`category: ${filters.category}`);
  }
  
  if (parts.length === 0) {
    return 'No filters applied';
  }
  
  return parts.join(', ');
}
