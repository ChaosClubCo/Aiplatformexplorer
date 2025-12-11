/**
 * Advanced Cache Manager
 * 
 * @description Multi-layer caching strategy with TTL, LRU, and invalidation
 * @module core/performance/CacheManager
 */

/**
 * Cache Entry
 */
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
  hits: number;
  size?: number;
  tags?: string[];
}

/**
 * Cache Statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  hitRate: number;
  size: number;
  evictions: number;
  totalRequests: number;
}

/**
 * Cache Strategy
 */
export type CacheStrategy = 'lru' | 'lfu' | 'fifo' | 'ttl';

/**
 * Cache Configuration
 */
export interface CacheConfig {
  maxSize?: number;
  defaultTTL?: number;
  strategy?: CacheStrategy;
  enableStats?: boolean;
  onEvict?: (key: string, value: any) => void;
}

/**
 * LRU Cache Node
 */
class LRUNode<T> {
  constructor(
    public key: string,
    public value: T,
    public prev: LRUNode<T> | null = null,
    public next: LRUNode<T> | null = null
  ) {}
}

/**
 * Advanced Cache Manager
 * Implements multiple caching strategies with statistics
 */
export class CacheManager<T = any> {
  private cache: Map<string, CacheEntry<T>> = new Map();
  private config: Required<CacheConfig>;
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    hitRate: 0,
    size: 0,
    evictions: 0,
    totalRequests: 0,
  };
  
  // LRU implementation
  private lruHead: LRUNode<string> | null = null;
  private lruTail: LRUNode<string> | null = null;
  private lruMap: Map<string, LRUNode<string>> = new Map();
  
  constructor(config: CacheConfig = {}) {
    this.config = {
      maxSize: config.maxSize || 1000,
      defaultTTL: config.defaultTTL || 300000, // 5 minutes
      strategy: config.strategy || 'lru',
      enableStats: config.enableStats !== false,
      onEvict: config.onEvict || (() => {}),
    };
  }
  
  /**
   * Get value from cache
   */
  get(key: string): T | null {
    this.stats.totalRequests++;
    
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
    
    // Check TTL
    if (this.isExpired(entry)) {
      this.delete(key);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }
    
    // Update stats
    entry.hits++;
    this.stats.hits++;
    this.updateHitRate();
    
    // Update LRU
    if (this.config.strategy === 'lru') {
      this.updateLRU(key);
    }
    
    return entry.value;
  }
  
  /**
   * Set value in cache
   */
  set(key: string, value: T, ttl?: number): void {
    // Check if we need to evict
    if (this.cache.size >= this.config.maxSize && !this.cache.has(key)) {
      this.evict();
    }
    
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      hits: 0,
      size: this.estimateSize(value),
    };
    
    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
    
    // Update LRU
    if (this.config.strategy === 'lru') {
      this.addToLRU(key);
    }
  }
  
  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    if (this.isExpired(entry)) {
      this.delete(key);
      return false;
    }
    
    return true;
  }
  
  /**
   * Delete entry
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return false;
    }
    
    this.cache.delete(key);
    this.stats.size = this.cache.size;
    
    // Remove from LRU
    if (this.config.strategy === 'lru') {
      this.removeFromLRU(key);
    }
    
    return true;
  }
  
  /**
   * Clear all entries
   */
  clear(): void {
    this.cache.clear();
    this.lruMap.clear();
    this.lruHead = null;
    this.lruTail = null;
    this.stats.size = 0;
  }
  
  /**
   * Get or set (lazy loading pattern)
   */
  async getOrSet(key: string, factory: () => T | Promise<T>, ttl?: number): Promise<T> {
    const cached = this.get(key);
    
    if (cached !== null) {
      return cached;
    }
    
    const value = await factory();
    this.set(key, value, ttl);
    
    return value;
  }
  
  /**
   * Set with tags for group invalidation
   */
  setWithTags(key: string, value: T, tags: string[], ttl?: number): void {
    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.config.defaultTTL,
      hits: 0,
      tags,
    };
    
    this.cache.set(key, entry);
    this.stats.size = this.cache.size;
  }
  
  /**
   * Invalidate by tags
   */
  invalidateByTag(tag: string): number {
    let count = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags?.includes(tag)) {
        this.delete(key);
        count++;
      }
    }
    
    return count;
  }
  
  /**
   * Get multiple values
   */
  mget(keys: string[]): Map<string, T | null> {
    const results = new Map<string, T | null>();
    
    for (const key of keys) {
      results.set(key, this.get(key));
    }
    
    return results;
  }
  
  /**
   * Set multiple values
   */
  mset(entries: Array<{ key: string; value: T; ttl?: number }>): void {
    for (const { key, value, ttl } of entries) {
      this.set(key, value, ttl);
    }
  }
  
  /**
   * Delete multiple values
   */
  mdel(keys: string[]): number {
    let count = 0;
    
    for (const key of keys) {
      if (this.delete(key)) {
        count++;
      }
    }
    
    return count;
  }
  
  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }
  
  /**
   * Get keys matching pattern
   */
  keysMatching(pattern: RegExp): string[] {
    return this.keys().filter(key => pattern.test(key));
  }
  
  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }
  
  /**
   * Reset statistics
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      hitRate: 0,
      size: this.cache.size,
      evictions: 0,
      totalRequests: 0,
    };
  }
  
  /**
   * Get cache size in entries
   */
  size(): number {
    return this.cache.size;
  }
  
  /**
   * Prune expired entries
   */
  prune(): number {
    let pruned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.delete(key);
        pruned++;
      }
    }
    
    return pruned;
  }
  
  /**
   * Check if entry is expired
   */
  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }
  
  /**
   * Evict entry based on strategy
   */
  private evict(): void {
    let keyToEvict: string | null = null;
    
    switch (this.config.strategy) {
      case 'lru':
        keyToEvict = this.evictLRU();
        break;
      case 'lfu':
        keyToEvict = this.evictLFU();
        break;
      case 'fifo':
        keyToEvict = this.evictFIFO();
        break;
      case 'ttl':
        keyToEvict = this.evictTTL();
        break;
    }
    
    if (keyToEvict) {
      const entry = this.cache.get(keyToEvict);
      if (entry) {
        this.config.onEvict(keyToEvict, entry.value);
      }
      this.delete(keyToEvict);
      this.stats.evictions++;
    }
  }
  
  /**
   * Evict least recently used
   */
  private evictLRU(): string | null {
    if (this.lruTail) {
      return this.lruTail.value;
    }
    return null;
  }
  
  /**
   * Evict least frequently used
   */
  private evictLFU(): string | null {
    let minHits = Infinity;
    let keyToEvict: string | null = null;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.hits < minHits) {
        minHits = entry.hits;
        keyToEvict = key;
      }
    }
    
    return keyToEvict;
  }
  
  /**
   * Evict first in first out
   */
  private evictFIFO(): string | null {
    let oldestTime = Infinity;
    let keyToEvict: string | null = null;
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp;
        keyToEvict = key;
      }
    }
    
    return keyToEvict;
  }
  
  /**
   * Evict entry closest to TTL expiration
   */
  private evictTTL(): string | null {
    let shortestTTL = Infinity;
    let keyToEvict: string | null = null;
    
    for (const [key, entry] of this.cache.entries()) {
      const timeLeft = entry.ttl - (Date.now() - entry.timestamp);
      if (timeLeft < shortestTTL) {
        shortestTTL = timeLeft;
        keyToEvict = key;
      }
    }
    
    return keyToEvict;
  }
  
  /**
   * Add to LRU list
   */
  private addToLRU(key: string): void {
    // Remove if exists
    this.removeFromLRU(key);
    
    // Create new node
    const node = new LRUNode(key, key);
    this.lruMap.set(key, node);
    
    // Add to head
    if (!this.lruHead) {
      this.lruHead = node;
      this.lruTail = node;
    } else {
      node.next = this.lruHead;
      this.lruHead.prev = node;
      this.lruHead = node;
    }
  }
  
  /**
   * Update LRU (move to head)
   */
  private updateLRU(key: string): void {
    const node = this.lruMap.get(key);
    if (!node || node === this.lruHead) {
      return;
    }
    
    // Remove from current position
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    if (node === this.lruTail) {
      this.lruTail = node.prev;
    }
    
    // Move to head
    node.prev = null;
    node.next = this.lruHead;
    if (this.lruHead) {
      this.lruHead.prev = node;
    }
    this.lruHead = node;
  }
  
  /**
   * Remove from LRU list
   */
  private removeFromLRU(key: string): void {
    const node = this.lruMap.get(key);
    if (!node) {
      return;
    }
    
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    if (node === this.lruHead) {
      this.lruHead = node.next;
    }
    if (node === this.lruTail) {
      this.lruTail = node.prev;
    }
    
    this.lruMap.delete(key);
  }
  
  /**
   * Update hit rate
   */
  private updateHitRate(): void {
    if (this.stats.totalRequests > 0) {
      this.stats.hitRate = this.stats.hits / this.stats.totalRequests;
    }
  }
  
  /**
   * Estimate size of value
   */
  private estimateSize(value: T): number {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 0;
    }
  }
}

/**
 * Global cache manager instances
 */
export const globalCache = new CacheManager({
  maxSize: 1000,
  defaultTTL: 300000, // 5 minutes
  strategy: 'lru',
  enableStats: true,
});

export const sessionCache = new CacheManager({
  maxSize: 100,
  defaultTTL: 3600000, // 1 hour
  strategy: 'lru',
});

export const persistentCache = new CacheManager({
  maxSize: 5000,
  defaultTTL: 86400000, // 24 hours
  strategy: 'lfu',
});
