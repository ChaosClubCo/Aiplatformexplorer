/**
 * SECURE STORAGE UTILITY
 * 
 * Provides AES-like encryption for client-side storage to prevent 
 * casual inspection of sensitive tokens (e.g., in LocalStorage).
 * 
 * NOTE: In a real browser environment, "true" security requires 
 * HTTP-only cookies. This is a mitigation layer for XSS vectors 
 * accessing LocalStorage directly.
 */

const STORAGE_PREFIX = 'int_ai_platform_';

class SecureStorage {
  private encryptionKey: string;

  constructor() {
    // In production, this key might be rotated or derived from user inputs
    this.encryptionKey = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secure-key-v1';
  }

  /**
   * Encrypts and saves data to localStorage
   */
  public setItem(key: string, value: any): void {
    try {
      const stringValue = JSON.stringify(value);
      const encrypted = this.encrypt(stringValue);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, encrypted);
    } catch (error) {
      console.error('[SecureStorage] Write failed', error);
    }
  }

  /**
   * Retrieves and decrypts data from localStorage
   */
  public getItem<T>(key: string): T | null {
    try {
      const encrypted = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!encrypted) return null;
      
      const decrypted = this.decrypt(encrypted);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('[SecureStorage] Read failed', error);
      return null;
    }
  }

  /**
   * Removes item from storage
   */
  public removeItem(key: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  }

  /**
   * Clears all app-specific storage
   */
  public clear(): void {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Simple XOR cipher + Base64 for demonstration
  // Replace with Web Crypto API (AES-GCM) for production banking-grade security
  private encrypt(text: string): string {
    const chars = text.split('');
    const keyChars = this.encryptionKey.split('');
    const encrypted = chars.map((c, i) => 
      c.charCodeAt(0) ^ keyChars[i % keyChars.length].charCodeAt(0)
    );
    return btoa(String.fromCharCode(...encrypted));
  }

  private decrypt(encoded: string): string {
    const text = atob(encoded);
    const chars = text.split('');
    const keyChars = this.encryptionKey.split('');
    const decrypted = chars.map((c, i) => 
      String.fromCharCode(c.charCodeAt(0) ^ keyChars[i % keyChars.length].charCodeAt(0))
    );
    return decrypted.join('');
  }
}

export const secureStorage = new SecureStorage();
