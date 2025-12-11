/**
 * String Utility Functions
 * Production-grade string manipulation utilities
 * 
 * @module utils/common/stringUtils
 */

/**
 * Capitalize first letter of string
 * 
 * @example
 * capitalize('hello world') // 'Hello world'
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize first letter of each word
 * 
 * @example
 * titleCase('hello world') // 'Hello World'
 */
export function titleCase(str: string): string {
  return str
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Convert string to camelCase
 * 
 * @example
 * camelCase('hello world') // 'helloWorld'
 * camelCase('hello-world') // 'helloWorld'
 */
export function camelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * Convert string to snake_case
 * 
 * @example
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('Hello World') // 'hello_world'
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '')
    .replace(/\s+/g, '_');
}

/**
 * Convert string to kebab-case
 * 
 * @example
 * kebabCase('helloWorld') // 'hello-world'
 * kebabCase('Hello World') // 'hello-world'
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/\s+/g, '-');
}

/**
 * Truncate string to max length
 * 
 * @example
 * truncate('Hello World', 8) // 'Hello...'
 */
export function truncate(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Truncate string at word boundary
 * 
 * @example
 * truncateWords('Hello World Example', 12) // 'Hello World...'
 */
export function truncateWords(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  
  const truncated = str.slice(0, maxLength - suffix.length);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.slice(0, lastSpace) + suffix;
  }
  
  return truncated + suffix;
}

/**
 * Slugify string for URLs
 * 
 * @example
 * slugify('Hello World!') // 'hello-world'
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Remove HTML tags from string
 * 
 * @example
 * stripHtml('<p>Hello <strong>World</strong></p>') // 'Hello World'
 */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML special characters
 * 
 * @example
 * escapeHtml('<script>alert("xss")</script>') // '&lt;script&gt;...'
 */
export function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  
  return str.replace(/[&<>"']/g, char => htmlEscapes[char]);
}

/**
 * Unescape HTML entities
 * 
 * @example
 * unescapeHtml('&lt;div&gt;') // '<div>'
 */
export function unescapeHtml(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
  };
  
  return str.replace(/&(?:amp|lt|gt|quot|#39);/g, entity => htmlUnescapes[entity]);
}

/**
 * Count words in string
 * 
 * @example
 * wordCount('Hello world example') // 3
 */
export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count characters (excluding whitespace)
 * 
 * @example
 * charCount('Hello world') // 10
 */
export function charCount(str: string): number {
  return str.replace(/\s/g, '').length;
}

/**
 * Reverse string
 * 
 * @example
 * reverse('hello') // 'olleh'
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if string is palindrome
 * 
 * @example
 * isPalindrome('racecar') // true
 * isPalindrome('hello') // false
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverse(cleaned);
}

/**
 * Repeat string n times
 * 
 * @example
 * repeat('ha', 3) // 'hahaha'
 */
export function repeat(str: string, times: number): string {
  return str.repeat(times);
}

/**
 * Pad string to length
 * 
 * @example
 * pad('5', 3, '0') // '005'
 */
export function pad(str: string, length: number, char: string = ' '): string {
  return str.padStart(length, char);
}

/**
 * Pad string on right
 * 
 * @example
 * padRight('5', 3, '0') // '500'
 */
export function padRight(str: string, length: number, char: string = ' '): string {
  return str.padEnd(length, char);
}

/**
 * Remove whitespace from both ends
 * 
 * @example
 * trim('  hello  ') // 'hello'
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Remove extra whitespace
 * 
 * @example
 * normalizeWhitespace('hello    world') // 'hello world'
 */
export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Extract numbers from string
 * 
 * @example
 * extractNumbers('abc123def456') // '123456'
 */
export function extractNumbers(str: string): string {
  return str.replace(/\D/g, '');
}

/**
 * Extract letters from string
 * 
 * @example
 * extractLetters('abc123def456') // 'abcdef'
 */
export function extractLetters(str: string): string {
  return str.replace(/[^a-zA-Z]/g, '');
}

/**
 * Check if string contains substring (case insensitive)
 * 
 * @example
 * contains('Hello World', 'world') // true
 */
export function contains(str: string, substr: string): boolean {
  return str.toLowerCase().includes(substr.toLowerCase());
}

/**
 * Check if string starts with prefix (case insensitive)
 * 
 * @example
 * startsWith('Hello World', 'hello') // true
 */
export function startsWith(str: string, prefix: string): boolean {
  return str.toLowerCase().startsWith(prefix.toLowerCase());
}

/**
 * Check if string ends with suffix (case insensitive)
 * 
 * @example
 * endsWith('Hello World', 'WORLD') // true
 */
export function endsWith(str: string, suffix: string): boolean {
  return str.toLowerCase().endsWith(suffix.toLowerCase());
}

/**
 * Replace all occurrences
 * 
 * @example
 * replaceAll('hello world hello', 'hello', 'hi') // 'hi world hi'
 */
export function replaceAll(str: string, search: string, replace: string): string {
  return str.split(search).join(replace);
}

/**
 * Format string template
 * 
 * @example
 * template('Hello {name}!', { name: 'World' }) // 'Hello World!'
 */
export function template(str: string, values: Record<string, any>): string {
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return values[key] !== undefined ? String(values[key]) : match;
  });
}

/**
 * Generate random string
 * 
 * @example
 * randomString(8) // 'aB3dE7gH'
 */
export function randomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate UUID v4
 * 
 * @example
 * uuid() // '550e8400-e29b-41d4-a716-446655440000'
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Hash string (simple hash function)
 * 
 * @example
 * hash('hello') // 99162322
 */
export function hash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Mask string (hide middle characters)
 * 
 * @example
 * mask('1234567890', 4, 2) // '1234****90'
 */
export function mask(
  str: string,
  visibleStart: number = 4,
  visibleEnd: number = 4,
  maskChar: string = '*'
): string {
  if (str.length <= visibleStart + visibleEnd) return str;
  
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const middle = maskChar.repeat(str.length - visibleStart - visibleEnd);
  
  return start + middle + end;
}

/**
 * Abbreviate name
 * 
 * @example
 * abbreviateName('John Smith') // 'JS'
 */
export function abbreviateName(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
}

/**
 * Format phone number
 * 
 * @example
 * formatPhone('1234567890') // '(123) 456-7890'
 */
export function formatPhone(phone: string): string {
  const cleaned = extractNumbers(phone);
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

/**
 * Highlight search term in text
 * 
 * @example
 * highlight('Hello World', 'world') // 'Hello <mark>World</mark>'
 */
export function highlight(text: string, term: string, tag: string = 'mark'): string {
  if (!term) return text;
  
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, `<${tag}>$1</${tag}>`);
}
