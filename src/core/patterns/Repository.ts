/**
 * Repository Pattern Implementation
 * 
 * @description Enterprise-grade data access abstraction layer
 * @pattern Repository Pattern
 * @module core/patterns/Repository
 */

/**
 * Generic Repository Interface
 * Provides standard CRUD operations for any entity
 */
export interface IRepository<T, ID = string> {
  // Read operations
  findById(id: ID): Promise<T | null>;
  findAll(filter?: Partial<T>): Promise<T[]>;
  findOne(filter: Partial<T>): Promise<T | null>;
  exists(id: ID): Promise<boolean>;
  count(filter?: Partial<T>): Promise<number>;
  
  // Write operations
  create(entity: Omit<T, 'id'>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T>;
  delete(id: ID): Promise<boolean>;
  
  // Batch operations
  createMany(entities: Omit<T, 'id'>[]): Promise<T[]>;
  updateMany(filter: Partial<T>, updates: Partial<T>): Promise<number>;
  deleteMany(filter: Partial<T>): Promise<number>;
}

/**
 * Cache Strategy Interface
 */
export interface ICacheStrategy<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

/**
 * Query Options
 */
export interface QueryOptions<T> {
  filter?: Partial<T>;
  sort?: { field: keyof T; order: 'asc' | 'desc' }[];
  limit?: number;
  offset?: number;
  select?: (keyof T)[];
}

/**
 * Paginated Result
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Abstract Repository Base Class
 * Implements common repository functionality with caching
 */
export abstract class BaseRepository<T extends { id: string }, ID = string> implements IRepository<T, ID> {
  protected cache?: ICacheStrategy<T>;
  protected cacheEnabled: boolean = true;
  protected cacheTTL: number = 300000; // 5 minutes default
  
  constructor(cache?: ICacheStrategy<T>) {
    this.cache = cache;
  }
  
  /**
   * Generate cache key for entity
   */
  protected getCacheKey(id: ID): string {
    return `${this.getEntityName()}:${id}`;
  }
  
  /**
   * Generate cache key for query
   */
  protected getQueryCacheKey(filter: Partial<T>): string {
    const filterStr = JSON.stringify(filter);
    return `${this.getEntityName()}:query:${filterStr}`;
  }
  
  /**
   * Get entity name for cache keys
   */
  protected abstract getEntityName(): string;
  
  /**
   * Load entity from storage
   */
  protected abstract loadFromStorage(id: ID): Promise<T | null>;
  
  /**
   * Save entity to storage
   */
  protected abstract saveToStorage(entity: T): Promise<T>;
  
  /**
   * Delete entity from storage
   */
  protected abstract deleteFromStorage(id: ID): Promise<boolean>;
  
  /**
   * Query entities from storage
   */
  protected abstract queryFromStorage(filter?: Partial<T>): Promise<T[]>;
  
  /**
   * Find by ID with caching
   */
  async findById(id: ID): Promise<T | null> {
    // Check cache first
    if (this.cacheEnabled && this.cache) {
      const cached = await this.cache.get(this.getCacheKey(id));
      if (cached) {
        return cached;
      }
    }
    
    // Load from storage
    const entity = await this.loadFromStorage(id);
    
    // Cache result
    if (entity && this.cacheEnabled && this.cache) {
      await this.cache.set(this.getCacheKey(id), entity, this.cacheTTL);
    }
    
    return entity;
  }
  
  /**
   * Find all entities with optional filtering
   */
  async findAll(filter?: Partial<T>): Promise<T[]> {
    // Check cache
    if (this.cacheEnabled && this.cache && filter) {
      const cacheKey = this.getQueryCacheKey(filter);
      const cached = await this.cache.get(cacheKey as any);
      if (cached) {
        return cached as any;
      }
    }
    
    // Query from storage
    const entities = await this.queryFromStorage(filter);
    
    // Cache results
    if (this.cacheEnabled && this.cache && filter) {
      const cacheKey = this.getQueryCacheKey(filter);
      await this.cache.set(cacheKey as any, entities as any, this.cacheTTL);
    }
    
    return entities;
  }
  
  /**
   * Find one entity matching filter
   */
  async findOne(filter: Partial<T>): Promise<T | null> {
    const results = await this.findAll(filter);
    return results[0] || null;
  }
  
  /**
   * Check if entity exists
   */
  async exists(id: ID): Promise<boolean> {
    const entity = await this.findById(id);
    return entity !== null;
  }
  
  /**
   * Count entities matching filter
   */
  async count(filter?: Partial<T>): Promise<number> {
    const entities = await this.findAll(filter);
    return entities.length;
  }
  
  /**
   * Create new entity
   */
  async create(entityData: Omit<T, 'id'>): Promise<T> {
    const entity = {
      ...entityData,
      id: this.generateId(),
    } as T;
    
    const saved = await this.saveToStorage(entity);
    
    // Invalidate query caches
    if (this.cacheEnabled && this.cache) {
      await this.invalidateQueryCaches();
    }
    
    return saved;
  }
  
  /**
   * Update existing entity
   */
  async update(id: ID, updates: Partial<T>): Promise<T> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Entity with id ${id} not found`);
    }
    
    const updated = {
      ...existing,
      ...updates,
      id: existing.id, // Preserve ID
    };
    
    const saved = await this.saveToStorage(updated);
    
    // Update cache
    if (this.cacheEnabled && this.cache) {
      await this.cache.set(this.getCacheKey(id), saved, this.cacheTTL);
      await this.invalidateQueryCaches();
    }
    
    return saved;
  }
  
  /**
   * Delete entity
   */
  async delete(id: ID): Promise<boolean> {
    const result = await this.deleteFromStorage(id);
    
    // Clear from cache
    if (this.cacheEnabled && this.cache) {
      await this.cache.delete(this.getCacheKey(id));
      await this.invalidateQueryCaches();
    }
    
    return result;
  }
  
  /**
   * Create multiple entities
   */
  async createMany(entitiesData: Omit<T, 'id'>[]): Promise<T[]> {
    const created: T[] = [];
    
    for (const entityData of entitiesData) {
      const entity = await this.create(entityData);
      created.push(entity);
    }
    
    return created;
  }
  
  /**
   * Update multiple entities
   */
  async updateMany(filter: Partial<T>, updates: Partial<T>): Promise<number> {
    const entities = await this.findAll(filter);
    
    for (const entity of entities) {
      await this.update(entity.id as ID, updates);
    }
    
    return entities.length;
  }
  
  /**
   * Delete multiple entities
   */
  async deleteMany(filter: Partial<T>): Promise<number> {
    const entities = await this.findAll(filter);
    
    for (const entity of entities) {
      await this.delete(entity.id as ID);
    }
    
    return entities.length;
  }
  
  /**
   * Paginated query
   */
  async findPaginated(options: QueryOptions<T>): Promise<PaginatedResult<T>> {
    const { filter, sort, limit = 20, offset = 0, select } = options;
    
    // Get all matching entities
    let entities = await this.findAll(filter);
    
    // Apply sorting
    if (sort && sort.length > 0) {
      entities = this.applySorting(entities, sort);
    }
    
    // Calculate pagination
    const total = entities.length;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    
    // Apply pagination
    const paginatedData = entities.slice(offset, offset + limit);
    
    // Apply field selection
    const resultData = select 
      ? paginatedData.map(entity => this.selectFields(entity, select))
      : paginatedData;
    
    return {
      data: resultData as T[],
      total,
      page,
      pageSize: limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }
  
  /**
   * Apply sorting to entities
   */
  protected applySorting(entities: T[], sort: { field: keyof T; order: 'asc' | 'desc' }[]): T[] {
    return [...entities].sort((a, b) => {
      for (const { field, order } of sort) {
        const aVal = a[field];
        const bVal = b[field];
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
  
  /**
   * Select specific fields from entity
   */
  protected selectFields(entity: T, fields: (keyof T)[]): Partial<T> {
    const selected: Partial<T> = {};
    for (const field of fields) {
      selected[field] = entity[field];
    }
    return selected;
  }
  
  /**
   * Generate unique ID
   */
  protected generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Invalidate all query caches
   */
  protected async invalidateQueryCaches(): Promise<void> {
    // Override in subclass if needed
  }
  
  /**
   * Enable/disable caching
   */
  setCacheEnabled(enabled: boolean): void {
    this.cacheEnabled = enabled;
  }
  
  /**
   * Clear all caches
   */
  async clearCache(): Promise<void> {
    if (this.cache) {
      await this.cache.clear();
    }
  }
}

/**
 * In-Memory Repository Implementation
 * Useful for testing and prototyping
 */
export class InMemoryRepository<T extends { id: string }> extends BaseRepository<T> {
  private storage: Map<string, T> = new Map();
  private entityName: string;
  
  constructor(entityName: string, cache?: ICacheStrategy<T>) {
    super(cache);
    this.entityName = entityName;
  }
  
  protected getEntityName(): string {
    return this.entityName;
  }
  
  protected async loadFromStorage(id: string): Promise<T | null> {
    return this.storage.get(id) || null;
  }
  
  protected async saveToStorage(entity: T): Promise<T> {
    this.storage.set(entity.id, entity);
    return entity;
  }
  
  protected async deleteFromStorage(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }
  
  protected async queryFromStorage(filter?: Partial<T>): Promise<T[]> {
    const all = Array.from(this.storage.values());
    
    if (!filter) {
      return all;
    }
    
    return all.filter(entity => {
      return Object.entries(filter).every(([key, value]) => {
        return entity[key as keyof T] === value;
      });
    });
  }
  
  /**
   * Clear all data
   */
  async clearAll(): Promise<void> {
    this.storage.clear();
    await this.clearCache();
  }
}
