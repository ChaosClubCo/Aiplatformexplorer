/**
 * Data Management Service
 * Production-grade centralized data management with caching, versioning, and sync
 * 
 * @module services/dataManagementService
 */

import { Platform } from '../types';
import { storageService } from './storageService';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { PlatformArraySchema, QuestionArraySchema } from '../types/zodSchemas';
import { PLATFORMS_DATA } from '../data/platforms';
import { RECOMMENDATION_QUESTIONS } from '../data/questions';

/**
 * Data version information
 */
export interface DataVersion {
  version: string;
  timestamp: Date;
  checksum: string;
  changeLog: string[];
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean;
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum cache size in bytes
  strategy: 'lru' | 'lfu' | 'fifo';
}

/**
 * Data source configuration
 */
export interface DataSource {
  type: 'local' | 'notion' | 'api' | 'file';
  priority: number;
  enabled: boolean;
  config?: Record<string, any>;
}

/**
 * Sync status
 */
export interface SyncStatus {
  lastSync: Date | null;
  inProgress: boolean;
  errors: Array<{ source: string; error: string; timestamp: Date }>;
  successfulSources: string[];
  failedSources: string[];
}

/**
 * Data Management Service
 * Centralized service for managing platform data with caching, versioning, and multi-source sync
 */
class DataManagementService {
  private cache: Map<string, { data: any; timestamp: Date; size: number }> = new Map();
  private cacheConfig: CacheConfig = {
    enabled: true,
    ttl: 3600000, // 1 hour
    maxSize: 10 * 1024 * 1024, // 10MB
    strategy: 'lru',
  };
  
  private dataSources: Map<string, DataSource> = new Map([
    ['api', { type: 'api', priority: 1, enabled: true }],
    ['local', { type: 'local', priority: 2, enabled: true }],
    ['notion', { type: 'notion', priority: 3, enabled: false }],
  ]);
  
  private currentVersion: DataVersion = {
    version: '3.0.0',
    timestamp: new Date(),
    checksum: '',
    changeLog: ['Initial version'],
  };
  
  private syncStatus: SyncStatus = {
    lastSync: null,
    inProgress: false,
    errors: [],
    successfulSources: [],
    failedSources: [],
  };
  
  /**
   * Configure cache settings
   */
  configureCac(config: Partial<CacheConfig>): void {
    this.cacheConfig = {
      ...this.cacheConfig,
      ...config,
    };
  }
  
  /**
   * Get cache configuration
   */
  getCacheConfig(): CacheConfig {
    return { ...this.cacheConfig };
  }
  
  /**
   * Configure data sources
   */
  configureDataSource(name: string, config: Partial<DataSource>): void {
    const existing = this.dataSources.get(name);
    if (existing) {
      this.dataSources.set(name, { ...existing, ...config });
    } else {
      this.dataSources.set(name, config as DataSource);
    }
  }
  
  /**
   * Get all data sources
   */
  getDataSources(): Map<string, DataSource> {
    return new Map(this.dataSources);
  }
  
  /**
   * Get data from cache or source
   */
  async getData<T = any>(key: string, options?: {
    skipCache?: boolean;
    source?: string;
  }): Promise<T | null> {
    // Check cache first
    if (this.cacheConfig.enabled && !options?.skipCache) {
      const cached = this.cache.get(key);
      if (cached) {
        const age = Date.now() - cached.timestamp.getTime();
        if (age < this.cacheConfig.ttl) {
          return cached.data as T;
        }
        // Expired, remove from cache
        this.cache.delete(key);
      }
    }
    
    // Fetch from source
    const data = await this.fetchFromSource<T>(key, options?.source);
    
    // Cache the result
    if (data && this.cacheConfig.enabled) {
      this.setCache(key, data);
    }
    
    return data;
  }
  
  /**
   * Set data in cache
   */
  private setCache(key: string, data: any): void {
    const size = new Blob([JSON.stringify(data)]).size;
    
    // Check if cache is full
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, item) => sum + item.size, 0);
    
    if (totalSize + size > this.cacheConfig.maxSize) {
      this.evictCache();
    }
    
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      size,
    });
  }
  
  /**
   * Evict cache entries based on strategy
   */
  private evictCache(): void {
    if (this.cache.size === 0) return;
    
    switch (this.cacheConfig.strategy) {
      case 'lru': // Least Recently Used
        let oldest: [string, any] | null = null;
        this.cache.forEach((value, key) => {
          if (!oldest || value.timestamp < oldest[1].timestamp) {
            oldest = [key, value];
          }
        });
        if (oldest) {
          this.cache.delete(oldest[0]);
        }
        break;
        
      case 'fifo': // First In First Out
        const firstKey = this.cache.keys().next().value;
        if (firstKey) {
          this.cache.delete(firstKey);
        }
        break;
        
      case 'lfu': // Least Frequently Used
        // Would need access count tracking
        // For now, fallback to LRU
        this.evictCache();
        break;
    }
  }
  
  /**
   * Fetch data from a specific source
   */
  private async fetchFromSource<T>(key: string, sourceName?: string): Promise<T | null> {
    if (sourceName) {
      const source = this.dataSources.get(sourceName);
      if (source && source.enabled) {
        return this.fetchFromSpecificSource<T>(key, source);
      }
      return null;
    }
    
    // Try all sources in priority order
    const sortedSources = Array.from(this.dataSources.entries())
      .filter(([_, source]) => source.enabled)
      .sort((a, b) => a[1].priority - b[1].priority);
    
    for (const [name, source] of sortedSources) {
      try {
        const data = await this.fetchFromSpecificSource<T>(key, source);
        if (data) {
          return data;
        }
      } catch (error) {
        console.error(`Error fetching from ${name}:`, error);
        this.syncStatus.errors.push({
          source: name,
          error: String(error),
          timestamp: new Date(),
        });
      }
    }
    
    return null;
  }
  
  /**
   * Fetch from a specific data source
   */
  private async fetchFromSpecificSource<T>(
    key: string,
    source: DataSource
  ): Promise<T | null> {
    switch (source.type) {
      case 'local':
        return storageService.get<T>(key);
        
      case 'notion':
        // Notion integration would go here
        return null;
        
      case 'api':
        const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8c5e19c9`;
        try {
            const response = await fetch(`${baseUrl}/${key}`, {
              headers: {
                'Authorization': `Bearer ${publicAnonKey}`
              }
            });
            
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
            }
            
            const json = await response.json();
            
            // Validate with Zod
            if (key === 'platforms') {
                const result = PlatformArraySchema.safeParse(json);
                if (!result.success) {
                    console.error('Zod validation failed for platforms:', result.error);
                    return null;
                }
                // Check if empty array, might want to fallback if we expect data
                if (result.data.length === 0) return null;
                return result.data as T;
            } else if (key === 'questions') {
                 const result = QuestionArraySchema.safeParse(json);
                 if (!result.success) {
                    console.error('Zod validation failed for questions:', result.error);
                    return null;
                }
                 if (result.data.length === 0) return null;
                return result.data as T;
            }
            
            return json as T;
        } catch (e) {
            console.error('Fetch error:', e);
            return null;
        }
        
      case 'file':
        // File system read would go here
        return null;
        
      default:
        return null;
    }
  }
  
  /**
   * Seed data to API
   */
  async seedData(): Promise<boolean> {
     const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-8c5e19c9`;
     try {
        const response = await fetch(`${baseUrl}/seed`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${publicAnonKey}`
            },
            body: JSON.stringify({
                platforms: PLATFORMS_DATA,
                questions: RECOMMENDATION_QUESTIONS
            })
        });
        
        if (!response.ok) {
           const errorText = await response.text();
           console.error('Seed API error:', response.status, response.statusText, errorText);
           return false;
        }
        
        return true;
     } catch (e) {
         console.error('Seed error:', e);
         return false;
     }
  }

  /**
   * Save data to all enabled sources
   */
  async setData(key: string, data: any, options?: {
    sources?: string[];
    skipCache?: boolean;
  }): Promise<boolean> {
    const sources = options?.sources
      ? options.sources.map(name => [name, this.dataSources.get(name)!]).filter(([_, s]) => s)
      : Array.from(this.dataSources.entries()).filter(([_, source]) => source.enabled);
    
    let allSucceeded = true;
    
    for (const [name, source] of sources) {
      try {
        await this.saveToSource(key, data, source);
        if (!this.syncStatus.successfulSources.includes(name)) {
          this.syncStatus.successfulSources.push(name);
        }
      } catch (error) {
        console.error(`Error saving to ${name}:`, error);
        allSucceeded = false;
        if (!this.syncStatus.failedSources.includes(name)) {
          this.syncStatus.failedSources.push(name);
        }
        this.syncStatus.errors.push({
          source: name,
          error: String(error),
          timestamp: new Date(),
        });
      }
    }
    
    // Update cache
    if (this.cacheConfig.enabled && !options?.skipCache) {
      this.setCache(key, data);
    }
    
    return allSucceeded;
  }
  
  /**
   * Save data to a specific source
   */
  private async saveToSource(key: string, data: any, source: DataSource): Promise<void> {
    switch (source.type) {
      case 'local':
        storageService.set(key, data);
        break;
        
      case 'notion':
        // Notion save would go here
        break;
        
      case 'api':
        // We don't have a generic save endpoint, but seeding handles initial data
        break;
        
      case 'file':
        // File save would go here
        break;
    }
  }
  
  /**
   * Synchronize data across all sources
   */
  async syncAllSources(): Promise<SyncStatus> {
    if (this.syncStatus.inProgress) {
      throw new Error('Sync already in progress');
    }
    
    try {
      this.syncStatus.inProgress = true;
      this.syncStatus.errors = [];
      this.syncStatus.successfulSources = [];
      this.syncStatus.failedSources = [];
      
      // Get all platforms
      const platforms = await this.getData<Platform[]>('platforms');
      if (!platforms) {
        throw new Error('No platform data found');
      }
      
      // Sync to all enabled sources
      await this.setData('platforms', platforms);
      
      this.syncStatus.lastSync = new Date();
      return { ...this.syncStatus };
    } finally {
      this.syncStatus.inProgress = false;
    }
  }
  
  /**
   * Get sync status
   */
  getSyncStatus(): SyncStatus {
    return { ...this.syncStatus };
  }
  
  /**
   * Clear cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
  
  /**
   * Get cache statistics
   */
  getCacheStats(): {
    size: number;
    entries: number;
    totalSize: number;
    hitRate: number;
  } {
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, item) => sum + item.size, 0);
    
    return {
      size: this.cache.size,
      entries: this.cache.size,
      totalSize,
      hitRate: 0, // Would need hit tracking
    };
  }
  
  /**
   * Get current data version
   */
  getVersion(): DataVersion {
    return { ...this.currentVersion };
  }
  
  /**
   * Update data version
   */
  updateVersion(version: Partial<DataVersion>): void {
    this.currentVersion = {
      ...this.currentVersion,
      ...version,
      timestamp: new Date(),
    };
  }
  
  /**
   * Validate data integrity
   */
  async validateIntegrity(): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    try {
      const platforms = await this.getData<Platform[]>('platforms');
      
      if (!platforms) {
        errors.push('No platform data found');
      } else {
         const result = PlatformArraySchema.safeParse(platforms);
         if (!result.success) {
            result.error.errors.forEach(err => {
                errors.push(`Validation error at ${err.path.join('.')}: ${err.message}`);
            });
         }
      }
    } catch (error) {
      errors.push(`Validation error: ${error}`);
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Backup data to localStorage
   */
  async backup(): Promise<{
    success: boolean;
    backupKey: string;
    timestamp: Date;
  }> {
    const timestamp = new Date();
    const backupKey = `backup_${timestamp.getTime()}`;
    
    try {
      const platforms = await this.getData<Platform[]>('platforms');
      if (!platforms) {
        throw new Error('No data to backup');
      }
      
      const backup = {
        version: this.currentVersion,
        timestamp,
        data: platforms,
      };
      
      storageService.set(backupKey, backup);
      
      return {
        success: true,
        backupKey,
        timestamp,
        timestamp,
      };
    } catch (error) {
      console.error('Backup failed:', error);
      return {
        success: false,
        backupKey: '',
        timestamp,
      };
    }
  }
  
  /**
   * Restore data from backup
   */
  async restore(backupKey: string): Promise<{
    success: boolean;
    restoredVersion?: DataVersion;
  }> {
    try {
      const backup = storageService.get<{
        version: DataVersion;
        timestamp: Date;
        data: Platform[];
      }>(backupKey);
      
      if (!backup) {
        throw new Error('Backup not found');
      }
      
      await this.setData('platforms', backup.data);
      this.currentVersion = backup.version;
      
      return {
        success: true,
        restoredVersion: backup.version,
      };
    } catch (error) {
      console.error('Restore failed:', error);
      return {
        success: false,
      };
    }
  }
  
  /**
   * List all available backups
   */
  listBackups(): Array<{
    key: string;
    version: string;
    timestamp: Date;
  }> {
    const allKeys = storageService.keys();
    const backupKeys = allKeys.filter(key => key.startsWith('backup_'));
    
    return backupKeys.map(key => {
      const backup = storageService.get<{
        version: DataVersion;
        timestamp: Date;
        data: Platform[];
      }>(key);
      
      return {
        key,
        version: backup?.version.version || 'unknown',
        timestamp: backup?.timestamp || new Date(0),
      };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
}

// Singleton instance
export const dataManagementService = new DataManagementService();

export default dataManagementService;
