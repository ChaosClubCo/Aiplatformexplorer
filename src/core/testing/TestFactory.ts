/**
 * Test Factory and Utilities
 * 
 * @description Comprehensive testing utilities for unit and integration tests
 * @module core/testing/TestFactory
 */

import { Platform, ROIInputs, ROIResults, Filters } from '../../types';

/**
 * Mock Data Generator
 */
export class MockDataGenerator {
  /**
   * Generate mock platform
   */
  static createPlatform(overrides?: Partial<Platform>): Platform {
    const id = overrides?.id || `test-platform-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      id,
      name: 'Test Platform',
      provider: 'Test Provider',
      providerKey: 'test-provider',
      logo: '🧪',
      category: 'enterprise',
      categoryLabel: 'Enterprise Foundation',
      model: 'GPT-4 Test',
      marketShare: '50% Test',
      marketSharePercent: 50,
      contextWindow: '128K tokens',
      contextTokens: 128000,
      focus: 'Testing Integration',
      pricing: '$30/user/month',
      pricingValue: 30,
      compliance: ['SOC 2', 'ISO 27001'],
      complianceCount: 2,
      dataResidency: 'Global',
      multimodal: 'Yes',
      intPriority: 'BASELINE',
      intPriorityClass: 'baseline',
      intRecommendation: 'Test recommendation',
      growthRate: 25,
      implementationTime: '2-4 weeks',
      scores: {
        codeGeneration: 7,
        creativeWriting: 7,
        dataAnalysis: 8,
        customerService: 7,
        complianceWork: 8,
        agentCapabilities: 7,
        apiAccess: 8,
        customization: 7,
        multilingual: 7,
        reasoning: 8,
      },
      strengths: ['Test strength 1', 'Test strength 2'],
      features: ['feature1', 'feature2'],
      useCases: ['Use case 1', 'Use case 2'],
      officialUrl: 'https://test-platform.com',
      description: 'Test platform description',
      verdict: 'Test verdict',
      ...overrides,
    };
  }
  
  /**
   * Generate multiple platforms
   */
  static createPlatforms(count: number, overrides?: Partial<Platform>): Platform[] {
    return Array.from({ length: count }, (_, i) =>
      this.createPlatform({
        ...overrides,
        id: `platform-${i}`,
        name: `Platform ${i + 1}`,
      })
    );
  }
  
  /**
   * Generate ROI inputs
   */
  static createROIInputs(overrides?: Partial<ROIInputs>): ROIInputs {
    return {
      employeeCount: 100,
      avgSalary: 75000,
      platformCost: 3000,
      implementationCost: 10000,
      adoptionRate: 0.8,
      productivityGain: 'midpoint',
      timeHorizon: 12,
      ...overrides,
    };
  }
  
  /**
   * Generate ROI results
   */
  static createROIResults(overrides?: Partial<ROIResults>): ROIResults {
    return {
      roi: 250,
      netBenefit: 100000,
      paybackMonths: 3,
      grossSavings: 120000,
      totalInvestment: 40000,
      effectiveUsers: 80,
      productivityValue: 150000,
      breakEvenMonth: 3,
      ...overrides,
    };
  }
  
  /**
   * Generate filters
   */
  static createFilters(overrides?: Partial<Filters>): Filters {
    return {
      provider: 'all',
      category: 'all',
      search: '',
      sortBy: 'marketShare-desc',
      ...overrides,
    };
  }
}

/**
 * Test Fixtures
 */
export class TestFixtures {
  /**
   * Sample platforms dataset
   */
  static getSamplePlatforms(): Platform[] {
    return [
      MockDataGenerator.createPlatform({
        id: 'copilot',
        name: 'Microsoft Copilot',
        provider: 'Microsoft',
        providerKey: 'microsoft',
        marketSharePercent: 80,
        category: 'enterprise',
      }),
      MockDataGenerator.createPlatform({
        id: 'chatgpt',
        name: 'ChatGPT',
        provider: 'OpenAI',
        providerKey: 'openai',
        marketSharePercent: 70,
        category: 'general',
      }),
      MockDataGenerator.createPlatform({
        id: 'claude',
        name: 'Claude',
        provider: 'Anthropic',
        providerKey: 'anthropic',
        marketSharePercent: 60,
        category: 'specialized',
      }),
    ];
  }
  
  /**
   * Empty state
   */
  static getEmptyState() {
    return {
      platforms: [],
      filters: MockDataGenerator.createFilters(),
      selectedPlatforms: [],
    };
  }
}

/**
 * Mock Services
 */
export class MockServices {
  /**
   * Mock analytics service
   */
  static createAnalyticsService() {
    return {
      trackEvent: jest.fn(),
      trackPageView: jest.fn(),
      trackError: jest.fn(),
      setUserId: jest.fn(),
    };
  }
  
  /**
   * Mock storage service
   */
  static createStorageService() {
    const storage = new Map<string, any>();
    
    return {
      get: jest.fn((key: string) => storage.get(key)),
      set: jest.fn((key: string, value: any) => storage.set(key, value)),
      remove: jest.fn((key: string) => storage.delete(key)),
      clear: jest.fn(() => storage.clear()),
    };
  }
  
  /**
   * Mock export service
   */
  static createExportService() {
    return {
      exportToPDF: jest.fn().mockResolvedValue(new Blob()),
      exportToCSV: jest.fn().mockResolvedValue('csv-data'),
      exportToJSON: jest.fn().mockResolvedValue('{}'),
    };
  }
}

/**
 * Test Helpers
 */
export class TestHelpers {
  /**
   * Wait for async operations
   */
  static async wait(ms: number = 0): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Flush promises
   */
  static async flushPromises(): Promise<void> {
    return new Promise(resolve => setImmediate(resolve));
  }
  
  /**
   * Create mock event
   */
  static createEvent<T extends Event>(
    type: string,
    properties?: Partial<T>
  ): T {
    const event = new Event(type) as T;
    if (properties) {
      Object.assign(event, properties);
    }
    return event;
  }
  
  /**
   * Create mock mouse event
   */
  static createMouseEvent(
    type: string,
    properties?: Partial<MouseEvent>
  ): MouseEvent {
    return new MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      ...properties,
    });
  }
  
  /**
   * Create mock keyboard event
   */
  static createKeyboardEvent(
    type: string,
    key: string,
    properties?: Partial<KeyboardEvent>
  ): KeyboardEvent {
    return new KeyboardEvent(type, {
      key,
      bubbles: true,
      cancelable: true,
      ...properties,
    });
  }
  
  /**
   * Generate random string
   */
  static randomString(length: number = 10): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }
  
  /**
   * Generate random number
   */
  static randomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  /**
   * Generate random boolean
   */
  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }
}

/**
 * Assertion Helpers
 */
export class AssertHelpers {
  /**
   * Assert deep equal
   */
  static deepEqual<T>(actual: T, expected: T): void {
    expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  }
  
  /**
   * Assert array contains
   */
  static arrayContains<T>(array: T[], item: T): void {
    expect(array).toContain(item);
  }
  
  /**
   * Assert array length
   */
  static arrayLength<T>(array: T[], length: number): void {
    expect(array).toHaveLength(length);
  }
  
  /**
   * Assert object has properties
   */
  static hasProperties<T extends object>(obj: T, properties: (keyof T)[]): void {
    properties.forEach(prop => {
      expect(obj).toHaveProperty(prop);
    });
  }
  
  /**
   * Assert function throws
   */
  static throws(fn: () => void, errorMessage?: string): void {
    if (errorMessage) {
      expect(fn).toThrow(errorMessage);
    } else {
      expect(fn).toThrow();
    }
  }
  
  /**
   * Assert async function throws
   */
  static async asyncThrows(fn: () => Promise<void>, errorMessage?: string): Promise<void> {
    if (errorMessage) {
      await expect(fn()).rejects.toThrow(errorMessage);
    } else {
      await expect(fn()).rejects.toThrow();
    }
  }
}

/**
 * Performance Testing
 */
export class PerformanceTester {
  /**
   * Measure execution time
   */
  static async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const duration = performance.now() - start;
    
    return { result, duration };
  }
  
  /**
   * Run performance benchmark
   */
  static async benchmark(
    name: string,
    fn: () => void | Promise<void>,
    iterations: number = 1000
  ): Promise<{
    name: string;
    iterations: number;
    totalTime: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
  }> {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
      const start = performance.now();
      await fn();
      const duration = performance.now() - start;
      times.push(duration);
    }
    
    return {
      name,
      iterations,
      totalTime: times.reduce((a, b) => a + b, 0),
      averageTime: times.reduce((a, b) => a + b, 0) / times.length,
      minTime: Math.min(...times),
      maxTime: Math.max(...times),
    };
  }
}

/**
 * Integration Test Helpers
 */
export class IntegrationTestHelpers {
  /**
   * Mock fetch
   */
  static mockFetch(response: any, status: number = 200): void {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      } as Response)
    );
  }
  
  /**
   * Mock localStorage
   */
  static mockLocalStorage(): void {
    const storage: Record<string, string> = {};
    
    global.localStorage = {
      getItem: (key: string) => storage[key] || null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
      clear: () => {
        Object.keys(storage).forEach(key => delete storage[key]);
      },
      length: Object.keys(storage).length,
      key: (index: number) => Object.keys(storage)[index] || null,
    };
  }
  
  /**
   * Mock performance API
   */
  static mockPerformance(): void {
    global.performance = {
      now: () => Date.now(),
      mark: jest.fn(),
      measure: jest.fn(),
      getEntriesByName: jest.fn(() => []),
      getEntriesByType: jest.fn(() => []),
    } as any;
  }
}

/**
 * Export all test utilities
 */
export const TestUtils = {
  mock: MockDataGenerator,
  fixtures: TestFixtures,
  services: MockServices,
  helpers: TestHelpers,
  assert: AssertHelpers,
  performance: PerformanceTester,
  integration: IntegrationTestHelpers,
};

export default TestUtils;
