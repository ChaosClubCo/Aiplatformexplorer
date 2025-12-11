/**
 * Factory Pattern Implementation
 * 
 * @description Enterprise factory patterns for object creation
 * @pattern Factory Method, Abstract Factory
 * @module core/patterns/Factory
 */

/**
 * Generic Factory Interface
 */
export interface IFactory<T> {
  create(...args: any[]): T;
  createMany(count: number, ...args: any[]): T[];
}

/**
 * Abstract Factory Interface
 */
export interface IAbstractFactory<T> {
  createProduct(...args: any[]): T;
  supports(type: string): boolean;
}

/**
 * Factory Registry
 * Central registry for managing factories
 */
export class FactoryRegistry {
  private static instance: FactoryRegistry;
  private factories: Map<string, IAbstractFactory<any>> = new Map();
  
  private constructor() {}
  
  static getInstance(): FactoryRegistry {
    if (!FactoryRegistry.instance) {
      FactoryRegistry.instance = new FactoryRegistry();
    }
    return FactoryRegistry.instance;
  }
  
  /**
   * Register factory
   */
  register<T>(name: string, factory: IAbstractFactory<T>): void {
    if (this.factories.has(name)) {
      console.warn(`Factory "${name}" is being overwritten`);
    }
    this.factories.set(name, factory);
  }
  
  /**
   * Get factory
   */
  get<T>(name: string): IAbstractFactory<T> | undefined {
    return this.factories.get(name) as IAbstractFactory<T> | undefined;
  }
  
  /**
   * Unregister factory
   */
  unregister(name: string): boolean {
    return this.factories.delete(name);
  }
  
  /**
   * Check if factory exists
   */
  has(name: string): boolean {
    return this.factories.has(name);
  }
  
  /**
   * Get all factory names
   */
  getFactoryNames(): string[] {
    return Array.from(this.factories.keys());
  }
  
  /**
   * Clear all factories
   */
  clear(): void {
    this.factories.clear();
  }
}

/**
 * Builder Pattern
 * Fluent interface for complex object construction
 */
export abstract class Builder<T> {
  protected product: Partial<T> = {};
  
  /**
   * Build final product
   */
  abstract build(): T;
  
  /**
   * Reset builder
   */
  reset(): this {
    this.product = {};
    return this;
  }
  
  /**
   * Clone builder state
   */
  clone(): this {
    const cloned = Object.create(Object.getPrototypeOf(this));
    cloned.product = { ...this.product };
    return cloned;
  }
}

/**
 * Object Pool Pattern
 * Reusable object pool for performance optimization
 */
export class ObjectPool<T> {
  private available: T[] = [];
  private inUse: Set<T> = new Set();
  private factory: () => T;
  private reset?: (obj: T) => void;
  private maxSize: number;
  private minSize: number;
  
  constructor(
    factory: () => T,
    options: {
      maxSize?: number;
      minSize?: number;
      reset?: (obj: T) => void;
    } = {}
  ) {
    this.factory = factory;
    this.reset = options.reset;
    this.maxSize = options.maxSize || 100;
    this.minSize = options.minSize || 0;
    
    // Pre-create minimum objects
    for (let i = 0; i < this.minSize; i++) {
      this.available.push(this.factory());
    }
  }
  
  /**
   * Acquire object from pool
   */
  acquire(): T {
    let obj: T;
    
    if (this.available.length > 0) {
      obj = this.available.pop()!;
    } else {
      if (this.inUse.size >= this.maxSize) {
        throw new Error(`Object pool size limit (${this.maxSize}) reached`);
      }
      obj = this.factory();
    }
    
    this.inUse.add(obj);
    return obj;
  }
  
  /**
   * Release object back to pool
   */
  release(obj: T): void {
    if (!this.inUse.has(obj)) {
      console.warn('Attempting to release object not from this pool');
      return;
    }
    
    this.inUse.delete(obj);
    
    // Reset object if reset function provided
    if (this.reset) {
      this.reset(obj);
    }
    
    // Return to pool if under max size
    if (this.available.length < this.maxSize) {
      this.available.push(obj);
    }
  }
  
  /**
   * Get pool statistics
   */
  getStats(): {
    available: number;
    inUse: number;
    total: number;
    maxSize: number;
  } {
    return {
      available: this.available.length,
      inUse: this.inUse.size,
      total: this.available.length + this.inUse.size,
      maxSize: this.maxSize,
    };
  }
  
  /**
   * Clear pool
   */
  clear(): void {
    this.available = [];
    this.inUse.clear();
  }
}

/**
 * Lazy Loading Factory
 * Defers object creation until first access
 */
export class LazyFactory<T> {
  private instance: T | null = null;
  private factory: () => T;
  
  constructor(factory: () => T) {
    this.factory = factory;
  }
  
  /**
   * Get instance (creates on first access)
   */
  get(): T {
    if (!this.instance) {
      this.instance = this.factory();
    }
    return this.instance;
  }
  
  /**
   * Check if instance is created
   */
  isCreated(): boolean {
    return this.instance !== null;
  }
  
  /**
   * Reset instance
   */
  reset(): void {
    this.instance = null;
  }
}

/**
 * Singleton Factory
 * Ensures only one instance exists
 */
export class Singleton<T> {
  private static instances: Map<string, any> = new Map();
  
  static getInstance<T>(
    key: string,
    factory: () => T
  ): T {
    if (!Singleton.instances.has(key)) {
      Singleton.instances.set(key, factory());
    }
    return Singleton.instances.get(key) as T;
  }
  
  static hasInstance(key: string): boolean {
    return Singleton.instances.has(key);
  }
  
  static resetInstance(key: string): void {
    Singleton.instances.delete(key);
  }
  
  static resetAll(): void {
    Singleton.instances.clear();
  }
}

/**
 * Prototype Pattern
 * Clone existing objects
 */
export interface ICloneable<T> {
  clone(): T;
  deepClone(): T;
}

export class CloneFactory {
  /**
   * Shallow clone
   */
  static shallowClone<T extends object>(obj: T): T {
    return { ...obj };
  }
  
  /**
   * Deep clone using structured clone (modern browsers)
   */
  static deepClone<T>(obj: T): T {
    try {
      return structuredClone(obj);
    } catch {
      // Fallback to JSON method (loses functions, dates, etc.)
      return JSON.parse(JSON.stringify(obj));
    }
  }
  
  /**
   * Clone array
   */
  static cloneArray<T>(arr: T[]): T[] {
    return arr.map(item => 
      typeof item === 'object' && item !== null
        ? CloneFactory.deepClone(item)
        : item
    );
  }
}

/**
 * Dependency Injection Container
 * Service locator pattern for dependency management
 */
export class DIContainer {
  private static instance: DIContainer;
  private services: Map<string, any> = new Map();
  private factories: Map<string, () => any> = new Map();
  private singletons: Map<string, any> = new Map();
  
  private constructor() {}
  
  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }
  
  /**
   * Register singleton service
   */
  registerSingleton<T>(name: string, instance: T): void {
    this.singletons.set(name, instance);
  }
  
  /**
   * Register transient service (created each time)
   */
  registerTransient<T>(name: string, factory: () => T): void {
    this.factories.set(name, factory);
  }
  
  /**
   * Register scoped service (singleton within scope)
   */
  registerScoped<T>(name: string, factory: () => T): void {
    this.services.set(name, factory);
  }
  
  /**
   * Resolve service
   */
  resolve<T>(name: string): T {
    // Check singletons first
    if (this.singletons.has(name)) {
      return this.singletons.get(name) as T;
    }
    
    // Check transient factories
    if (this.factories.has(name)) {
      const factory = this.factories.get(name)!;
      return factory() as T;
    }
    
    // Check scoped services
    if (this.services.has(name)) {
      const factory = this.services.get(name);
      
      // Create singleton for this scope
      if (!this.singletons.has(name)) {
        this.singletons.set(name, factory());
      }
      
      return this.singletons.get(name) as T;
    }
    
    throw new Error(`Service "${name}" not registered`);
  }
  
  /**
   * Check if service is registered
   */
  has(name: string): boolean {
    return this.singletons.has(name) || 
           this.factories.has(name) || 
           this.services.has(name);
  }
  
  /**
   * Clear all services
   */
  clear(): void {
    this.services.clear();
    this.factories.clear();
    this.singletons.clear();
  }
  
  /**
   * Create child container (for scoping)
   */
  createScope(): DIContainer {
    const scope = new DIContainer();
    
    // Copy factories
    this.factories.forEach((factory, key) => {
      scope.factories.set(key, factory);
    });
    
    // Copy scoped services
    this.services.forEach((service, key) => {
      scope.services.set(key, service);
    });
    
    return scope;
  }
}

/**
 * Factory Method Examples
 */

// Platform Factory Example
export interface IPlatform {
  id: string;
  name: string;
  type: string;
}

export class PlatformFactory implements IFactory<IPlatform> {
  create(type: string, name: string): IPlatform {
    return {
      id: this.generateId(),
      name,
      type,
    };
  }
  
  createMany(count: number, type: string): IPlatform[] {
    const platforms: IPlatform[] = [];
    for (let i = 0; i < count; i++) {
      platforms.push(this.create(type, `Platform ${i + 1}`));
    }
    return platforms;
  }
  
  private generateId(): string {
    return `plat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Test Data Factory
export class TestDataFactory {
  /**
   * Create mock platform
   */
  static createMockPlatform(overrides?: Partial<IPlatform>): IPlatform {
    return {
      id: `test-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Test Platform',
      type: 'enterprise',
      ...overrides,
    };
  }
  
  /**
   * Create multiple mock platforms
   */
  static createMockPlatforms(count: number): IPlatform[] {
    return Array.from({ length: count }, (_, i) =>
      TestDataFactory.createMockPlatform({ name: `Platform ${i + 1}` })
    );
  }
}
