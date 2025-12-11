/**
 * Platform Sort Utilities
 * Production-grade sorting logic for AI platforms
 * 
 * @module utils/platform/sortUtils
 */

import type { Platform } from '../../types';
import type { SortOption } from '../../constants';

/**
 * Sort platforms by market share (descending)
 */
export function sortByMarketShareDesc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    const aShare = a.marketSharePercent || 0;
    const bShare = b.marketSharePercent || 0;
    return bShare - aShare;
  });
}

/**
 * Sort platforms by market share (ascending)
 */
export function sortByMarketShareAsc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    const aShare = a.marketSharePercent || 0;
    const bShare = b.marketSharePercent || 0;
    return aShare - bShare;
  });
}

/**
 * Sort platforms by price (ascending)
 */
export function sortByPriceAsc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    const aPrice = a.pricingValue || 0;
    const bPrice = b.pricingValue || 0;
    return aPrice - bPrice;
  });
}

/**
 * Sort platforms by price (descending)
 */
export function sortByPriceDesc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    const aPrice = a.pricingValue || 0;
    const bPrice = b.pricingValue || 0;
    return bPrice - aPrice;
  });
}

/**
 * Sort platforms by name (A-Z)
 */
export function sortByNameAsc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Sort platforms by name (Z-A)
 */
export function sortByNameDesc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => b.name.localeCompare(a.name));
}

/**
 * Sort platforms by context window (largest first)
 */
export function sortByContextWindowDesc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    // Extract numeric value from context window string
    const aTokens = parseInt(a.contextWindow.replace(/[^\d]/g, '')) || 0;
    const bTokens = parseInt(b.contextWindow.replace(/[^\d]/g, '')) || 0;
    return bTokens - aTokens;
  });
}

/**
 * Sort platforms by compliance count (most compliant first)
 */
export function sortByComplianceDesc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    const aCount = a.complianceCount || 0;
    const bCount = b.complianceCount || 0;
    return bCount - aCount;
  });
}

/**
 * Sort platforms by growth rate (fastest growing first)
 */
export function sortByGrowthRateDesc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    const aGrowth = a.growthRate || 0;
    const bGrowth = b.growthRate || 0;
    return bGrowth - aGrowth;
  });
}

/**
 * Sort platforms by average score (highest rated first)
 */
export function sortByAvgScoreDesc(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => {
    const aScore = a.avgScore || 0;
    const bScore = b.avgScore || 0;
    return bScore - aScore;
  });
}

/**
 * Sort platforms by provider (alphabetically)
 */
export function sortByProvider(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => a.provider.localeCompare(b.provider));
}

/**
 * Sort platforms by category (alphabetically)
 */
export function sortByCategory(platforms: Platform[]): Platform[] {
  return [...platforms].sort((a, b) => a.categoryLabel.localeCompare(b.categoryLabel));
}

/**
 * Sort platforms using sort option key
 */
export function sortPlatforms(platforms: Platform[], sortBy: SortOption): Platform[] {
  switch (sortBy) {
    case 'marketShare-desc':
      return sortByMarketShareDesc(platforms);
    
    case 'marketShare-asc':
      return sortByMarketShareAsc(platforms);
    
    case 'price-asc':
      return sortByPriceAsc(platforms);
    
    case 'price-desc':
      return sortByPriceDesc(platforms);
    
    case 'name-asc':
      return sortByNameAsc(platforms);
    
    case 'name-desc':
      return sortByNameDesc(platforms);
    
    case 'contextWindow-desc':
      return sortByContextWindowDesc(platforms);
    
    case 'compliance-desc':
      return sortByComplianceDesc(platforms);
    
    case 'growthRate-desc':
      return sortByGrowthRateDesc(platforms);
    
    case 'avgScore-desc':
      return sortByAvgScoreDesc(platforms);
    
    default:
      return platforms;
  }
}

/**
 * Multi-field sort
 * Sort by multiple fields in order of priority
 */
export function multiSort(
  platforms: Platform[],
  sortFields: Array<{ field: keyof Platform; direction: 'asc' | 'desc' }>
): Platform[] {
  return [...platforms].sort((a, b) => {
    for (const { field, direction } of sortFields) {
      const aVal = a[field];
      const bVal = b[field];
      
      let comparison = 0;
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      }
      
      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }
    
    return 0;
  });
}

/**
 * Custom sort function
 * Sort by custom comparator
 */
export function customSort<T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  return [...array].sort(compareFn);
}

/**
 * Stable sort
 * Maintains original order for equal elements
 */
export function stableSort<T>(
  array: T[],
  compareFn: (a: T, b: T) => number
): T[] {
  const indexed = array.map((item, index) => ({ item, index }));
  
  indexed.sort((a, b) => {
    const result = compareFn(a.item, b.item);
    return result !== 0 ? result : a.index - b.index;
  });
  
  return indexed.map(({ item }) => item);
}

/**
 * Get sort direction from sort option
 */
export function getSortDirection(sortBy: SortOption): 'asc' | 'desc' {
  return sortBy.endsWith('-asc') ? 'asc' : 'desc';
}

/**
 * Get sort field from sort option
 */
export function getSortField(sortBy: SortOption): string {
  return sortBy.replace(/-asc|-desc$/, '');
}

/**
 * Toggle sort direction
 */
export function toggleSortDirection(sortBy: SortOption): SortOption {
  const field = getSortField(sortBy);
  const direction = getSortDirection(sortBy);
  const newDirection = direction === 'asc' ? 'desc' : 'asc';
  return `${field}-${newDirection}` as SortOption;
}

/**
 * Get available sort options for platforms
 */
export function getAvailableSortOptions(): Array<{
  value: SortOption;
  label: string;
}> {
  return [
    { value: 'marketShare-desc', label: 'Market Share (High to Low)' },
    { value: 'marketShare-asc', label: 'Market Share (Low to High)' },
    { value: 'price-asc', label: 'Price (Low to High)' },
    { value: 'price-desc', label: 'Price (High to Low)' },
    { value: 'name-asc', label: 'Name (A to Z)' },
    { value: 'name-desc', label: 'Name (Z to A)' },
    { value: 'contextWindow-desc', label: 'Context Window (Largest First)' },
    { value: 'compliance-desc', label: 'Most Compliant' },
    { value: 'growthRate-desc', label: 'Fastest Growing' },
    { value: 'avgScore-desc', label: 'Highest Rated' },
  ];
}
