/**
 * Storage Service
 * Centralized service for managing localStorage and sessionStorage
 * with error handling and type safety
 */

import { APP_CONFIG } from '../config/app.config';

export class StorageService {
  private prefix: string;
  private version: number;

  constructor() {
    this.prefix = APP_CONFIG.storage.prefix;
    this.version = APP_CONFIG.storage.version;
  }

  /**
   * Get prefixed key
   */
  private getKey(key: string): string {
    return `${this.prefix}-v${this.version}-${key}`;
  }

  /**
   * Get item from localStorage
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting item from storage: ${key}`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Set item in localStorage
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item in storage: ${key}`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error(`Error removing item from storage: ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all items with this prefix
   */
  clear(): boolean {
    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => 
        key.startsWith(`${this.prefix}-v${this.version}`)
      );
      prefixedKeys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing storage', error);
      return false;
    }
  }

  /**
   * Get multiple items at once
   */
  getMany<T>(keys: string[]): Record<string, T | null> {
    const result: Record<string, T | null> = {};
    keys.forEach(key => {
      result[key] = this.get<T>(key);
    });
    return result;
  }

  /**
   * Set multiple items at once
   */
  setMany(items: Record<string, any>): boolean {
    try {
      Object.entries(items).forEach(([key, value]) => {
        this.set(key, value);
      });
      return true;
    } catch (error) {
      console.error('Error setting multiple items', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  has(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Get all keys with this prefix
   */
  keys(): string[] {
    try {
      const allKeys = Object.keys(localStorage);
      const prefix = `${this.prefix}-v${this.version}-`;
      return allKeys
        .filter(key => key.startsWith(prefix))
        .map(key => key.substring(prefix.length));
    } catch (error) {
      console.error('Error getting keys', error);
      return [];
    }
  }

  /**
   * Get storage size in bytes
   */
  getSize(): number {
    try {
      let size = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key.startsWith(this.prefix)) {
          size += localStorage[key].length + key.length;
        }
      }
      return size;
    } catch (error) {
      console.error('Error calculating storage size', error);
      return 0;
    }
  }

  /**
   * Migrate data from old version
   */
  migrate(oldVersion: number): boolean {
    try {
      const oldPrefix = `${this.prefix}-v${oldVersion}-`;
      const keys = Object.keys(localStorage);
      const oldKeys = keys.filter(key => key.startsWith(oldPrefix));

      oldKeys.forEach(oldKey => {
        const value = localStorage.getItem(oldKey);
        if (value) {
          const newKey = oldKey.replace(oldPrefix, `${this.prefix}-v${this.version}-`);
          localStorage.setItem(newKey, value);
          localStorage.removeItem(oldKey);
        }
      });

      return true;
    } catch (error) {
      console.error(`Error migrating from version ${oldVersion}`, error);
      return false;
    }
  }
}

/**
 * Session Storage Service
 * Similar to StorageService but uses sessionStorage
 */
export class SessionStorageService {
  private prefix: string;

  constructor() {
    this.prefix = APP_CONFIG.storage.prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}-${key}`;
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error getting item from session storage: ${key}`, error);
      return defaultValue ?? null;
    }
  }

  set<T>(key: string, value: T): boolean {
    try {
      sessionStorage.setItem(this.getKey(key), JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item in session storage: ${key}`, error);
      return false;
    }
  }

  remove(key: string): boolean {
    try {
      sessionStorage.removeItem(this.getKey(key));
      return true;
    } catch (error) {
      console.error(`Error removing item from session storage: ${key}`, error);
      return false;
    }
  }

  clear(): boolean {
    try {
      const keys = Object.keys(sessionStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      prefixedKeys.forEach(key => sessionStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing session storage', error);
      return false;
    }
  }
}

// Export singleton instances
export const storage = new StorageService();
export const sessionStorage = new SessionStorageService();

// Default export for backward compatibility
export const storageService = storage;
export default storageService;