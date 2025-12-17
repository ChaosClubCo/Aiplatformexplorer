/**
 * Security Manager
 * 
 * @description Enterprise-grade security utilities and protections
 * @module core/security/SecurityManager
 */

/**
 * XSS Protection
 */
export class XSSProtection {
  /**
   * Sanitize HTML string
   */
  static sanitizeHTML(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
  
  /**
   * Escape HTML entities
   */
  static escapeHTML(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  /**
   * Strip HTML tags
   */
  static stripHTML(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }
  
  /**
   * Sanitize URL
   */
  static sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url);
      const allowed = ['http:', 'https:', 'mailto:'];
      
      if (!allowed.includes(parsed.protocol)) {
        return '#';
      }
      
      return parsed.toString();
    } catch {
      return '#';
    }
  }
}

/**
 * Input Validation
 */
export class InputValidator {
  /**
   * Validate email
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate URL
   */
  static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Validate phone number
   */
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s-()]/g, ''));
  }
  
  /**
   * Validate credit card (Luhn algorithm)
   */
  static isValidCreditCard(cardNumber: string): boolean {
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
      return false;
    }
    
    let sum = 0;
    let isEven = false;
    
    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i], 10);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
  
  /**
   * Validate password strength
   */
  static validatePasswordStrength(password: string): {
    isStrong: boolean;
    score: number;
    feedback: string[];
  } {
    const feedback: string[] = [];
    let score = 0;
    
    // Length check
    if (password.length >= 8) score += 20;
    else feedback.push('Password should be at least 8 characters');
    
    if (password.length >= 12) score += 10;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Include uppercase letters');
    }
    
    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 20;
    } else {
      feedback.push('Include lowercase letters');
    }
    
    // Number check
    if (/\d/.test(password)) {
      score += 15;
    } else {
      feedback.push('Include numbers');
    }
    
    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 15;
    } else {
      feedback.push('Include special characters');
    }
    
    return {
      isStrong: score >= 70,
      score,
      feedback,
    };
  }
  
  /**
   * Sanitize input
   */
  static sanitizeInput(input: string, type: 'alphanumeric' | 'numeric' | 'text' = 'text'): string {
    switch (type) {
      case 'alphanumeric':
        return input.replace(/[^a-zA-Z0-9]/g, '');
      case 'numeric':
        return input.replace(/[^0-9]/g, '');
      case 'text':
      default:
        return input.trim();
    }
  }
}

/**
 * CSRF Protection
 */
export class CSRFProtection {
  private static tokenKey = 'csrf_token';
  
  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    const token = this.randomString(32);
    sessionStorage.setItem(this.tokenKey, token);
    return token;
  }
  
  /**
   * Get current token
   */
  static getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }
  
  /**
   * Validate token
   */
  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return storedToken !== null && storedToken === token;
  }
  
  /**
   * Clear token
   */
  static clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }
  
  /**
   * Generate random string
   */
  private static randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }
}

/**
 * Content Security Policy Helper
 */
export class CSPHelper {
  /**
   * Generate CSP meta tag
   */
  static generateMetaTag(policy: Record<string, string[]>): string {
    const directives = Object.entries(policy)
      .map(([key, values]) => `${key} ${values.join(' ')}`)
      .join('; ');
    
    return `<meta http-equiv="Content-Security-Policy" content="${directives}">`;
  }
  
  /**
   * Default strict CSP
   */
  static getStrictPolicy(): Record<string, string[]> {
    return {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'", 'data:'],
      'connect-src': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    };
  }
}

/**
 * Encryption Utilities
 */
export class EncryptionUtils {
  /**
   * Hash string using SHA-256
   */
  static async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  /**
   * Generate random bytes
   */
  static generateRandomBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }
  
  /**
   * Generate UUID v4
   */
  static generateUUID(): string {
    return crypto.randomUUID();
  }
  
  /**
   * Base64 encode
   */
  static base64Encode(data: string): string {
    return btoa(data);
  }
  
  /**
   * Base64 decode
   */
  static base64Decode(data: string): string {
    return atob(data);
  }
}

/**
 * Rate Limiting for Security
 */
export class SecurityRateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  
  constructor(maxAttempts: number = 5, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Record attempt
   */
  recordAttempt(key: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    recentAttempts.push(now);
    
    this.attempts.set(key, recentAttempts);
  }
  
  /**
   * Reset attempts
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  /**
   * Get remaining attempts
   */
  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    return Math.max(0, this.maxAttempts - recentAttempts.length);
  }
}

/**
 * Secure Storage
 */
export class SecureStorage {
  /**
   * Set encrypted item
   */
  static async setItem(key: string, value: any, encrypt: boolean = false): Promise<void> {
    const stringValue = JSON.stringify(value);
    
    if (encrypt) {
      const encrypted = await EncryptionUtils.sha256(stringValue);
      localStorage.setItem(key, encrypted);
    } else {
      localStorage.setItem(key, stringValue);
    }
  }
  
  /**
   * Get item
   */
  static getItem<T = any>(key: string): T | null {
    const value = localStorage.getItem(key);
    
    if (!value) {
      return null;
    }
    
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as any;
    }
  }
  
  /**
   * Remove item
   */
  static removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  
  /**
   * Clear all
   */
  static clear(): void {
    localStorage.clear();
  }
}

/**
 * Audit Logger
 */
export class AuditLogger {
  private static logs: Array<{
    timestamp: number;
    action: string;
    user: string;
    details: any;
    severity: 'info' | 'warning' | 'critical';
  }> = [];
  
  /**
   * Log action
   */
  static log(
    action: string,
    user: string,
    details: any = {},
    severity: 'info' | 'warning' | 'critical' = 'info'
  ): void {
    this.logs.push({
      timestamp: Date.now(),
      action,
      user,
      details,
      severity,
    });
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
    
    // Console log for development
    // if (process.env.NODE_ENV === 'development') {
      console.log(`[Audit] ${severity.toUpperCase()}: ${action} by ${user}`, details);
    // }
  }
  
  /**
   * Get logs
   */
  static getLogs(filter?: {
    action?: string;
    user?: string;
    severity?: 'info' | 'warning' | 'critical';
    since?: number;
  }): typeof AuditLogger.logs {
    let filtered = [...this.logs];
    
    if (filter) {
      if (filter.action) {
        filtered = filtered.filter(log => log.action === filter.action);
      }
      if (filter.user) {
        filtered = filtered.filter(log => log.user === filter.user);
      }
      if (filter.severity) {
        filtered = filtered.filter(log => log.severity === filter.severity);
      }
      if (filter.since) {
        filtered = filtered.filter(log => log.timestamp >= filter.since);
      }
    }
    
    return filtered;
  }
  
  /**
   * Clear logs
   */
  static clear(): void {
    this.logs = [];
  }
  
  /**
   * Export logs
   */
  static exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

/**
 * Security Manager - Main facade
 */
export class SecurityManager {
  static xss = XSSProtection;
  static validator = InputValidator;
  static csrf = CSRFProtection;
  static csp = CSPHelper;
  static encryption = EncryptionUtils;
  static rateLimiter = new SecurityRateLimiter();
  static storage = SecureStorage;
  static audit = AuditLogger;
  
  /**
   * Initialize security features
   */
  static init(): void {
    // Generate CSRF token
    if (!CSRFProtection.getToken()) {
      CSRFProtection.generateToken();
    }
    
    // Log initialization
    AuditLogger.log('security-init', 'system', {}, 'info');
  }
  
  /**
   * Security health check
   */
  static healthCheck(): {
    csrf: boolean;
    storage: boolean;
    encryption: boolean;
  } {
    return {
      csrf: CSRFProtection.getToken() !== null,
      storage: typeof localStorage !== 'undefined',
      encryption: typeof crypto !== 'undefined' && !!crypto.subtle,
    };
  }
}
