/**
 * Formatter Service
 * Production-grade data formatting utilities
 * 
 * @module services/formatterService
 */

/**
 * Format number as currency
 * 
 * @example
 * formatCurrency(1234.56) // '$1,234.56'
 * formatCurrency(1234.56, 'EUR') // '€1,234.56'
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format number with commas
 * 
 * @example
 * formatNumber(1234567) // '1,234,567'
 */
export function formatNumber(
  num: number,
  locale: string = 'en-US',
  decimals?: number
): string {
  try {
    const options: Intl.NumberFormatOptions = {};
    if (decimals !== undefined) {
      options.minimumFractionDigits = decimals;
      options.maximumFractionDigits = decimals;
    }
    return new Intl.NumberFormat(locale, options).format(num);
  } catch (error) {
    console.error('Number formatting error:', error);
    return String(num);
  }
}

/**
 * Format percentage
 * 
 * @example
 * formatPercent(0.1234) // '12.34%'
 * formatPercent(0.1234, 0) // '12%'
 */
export function formatPercent(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('Percent formatting error:', error);
    return `${(value * 100).toFixed(decimals)}%`;
  }
}

/**
 * Format file size
 * 
 * @example
 * formatFileSize(1536) // '1.5 KB'
 * formatFileSize(1048576) // '1 MB'
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format large number (compact notation)
 * 
 * @example
 * formatCompact(1234) // '1.2K'
 * formatCompact(1234567) // '1.2M'
 */
export function formatCompact(num: number, decimals: number = 1): string {
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  
  if (tier === 0) return String(num);
  
  const suffix = suffixes[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = num / scale;
  
  return scaled.toFixed(decimals) + suffix;
}

/**
 * Format phone number
 * 
 * @example
 * formatPhone('1234567890') // '(123) 456-7890'
 * formatPhone('1234567890', 'international') // '+1 (123) 456-7890'
 */
export function formatPhone(
  phone: string,
  format: 'us' | 'international' = 'us'
): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (format === 'us' && cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  
  if (format === 'international' && cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return phone;
}

/**
 * Format credit card number
 * 
 * @example
 * formatCreditCard('1234567890123456') // '1234 5678 9012 3456'
 */
export function formatCreditCard(cardNumber: string): string {
  const cleaned = cardNumber.replace(/\s/g, '');
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(' ') : cardNumber;
}

/**
 * Format date
 * 
 * @example
 * formatDate(new Date(), 'short') // '1/15/24'
 * formatDate(new Date(), 'long') // 'January 15, 2024'
 */
export function formatDate(
  date: Date,
  format: 'short' | 'medium' | 'long' | 'full' = 'medium',
  locale: string = 'en-US'
): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      short: { month: 'numeric', day: 'numeric', year: '2-digit' },
      medium: { month: 'short', day: 'numeric', year: 'numeric' },
      long: { month: 'long', day: 'numeric', year: 'numeric' },
      full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    }[format];
    
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Date formatting error:', error);
    return date.toLocaleDateString();
  }
}

/**
 * Format time
 * 
 * @example
 * formatTime(new Date()) // '3:30 PM'
 * formatTime(new Date(), true) // '15:30'
 */
export function formatTime(
  date: Date,
  use24Hour: boolean = false,
  locale: string = 'en-US'
): string {
  try {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: !use24Hour,
    };
    
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch (error) {
    console.error('Time formatting error:', error);
    return date.toLocaleTimeString();
  }
}

/**
 * Format datetime
 * 
 * @example
 * formatDateTime(new Date()) // 'Jan 15, 2024, 3:30 PM'
 */
export function formatDateTime(
  date: Date,
  locale: string = 'en-US'
): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  } catch (error) {
    console.error('DateTime formatting error:', error);
    return date.toLocaleString();
  }
}

/**
 * Format relative time
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // '1 hour ago'
 */
export function formatRelativeTime(
  date: Date,
  locale: string = 'en-US'
): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  const intervals: Array<[number, Intl.RelativeTimeFormatUnit]> = [
    [31536000, 'year'],
    [2592000, 'month'],
    [604800, 'week'],
    [86400, 'day'],
    [3600, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];
  
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
    
    for (const [secondsInUnit, unit] of intervals) {
      const value = Math.floor(seconds / secondsInUnit);
      if (value >= 1) {
        return rtf.format(-value, unit);
      }
    }
    
    return rtf.format(0, 'second');
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'just now';
  }
}

/**
 * Format list
 * 
 * @example
 * formatList(['apples', 'oranges', 'bananas']) // 'apples, oranges, and bananas'
 */
export function formatList(
  items: string[],
  type: 'conjunction' | 'disjunction' = 'conjunction',
  locale: string = 'en-US'
): string {
  try {
    return new Intl.ListFormat(locale, { style: 'long', type }).format(items);
  } catch (error) {
    console.error('List formatting error:', error);
    return items.join(', ');
  }
}

/**
 * Format ordinal number
 * 
 * @example
 * formatOrdinal(1) // '1st'
 * formatOrdinal(22) // '22nd'
 */
export function formatOrdinal(num: number, locale: string = 'en-US'): string {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const value = num % 100;
  const suffix = suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  
  return `${num}${suffix}`;
}

/**
 * Format duration
 * 
 * @example
 * formatDuration(125) // '2 minutes 5 seconds'
 * formatDuration(3665) // '1 hour 1 minute 5 seconds'
 */
export function formatDuration(seconds: number): string {
  const parts: string[] = [];
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (secs > 0 || parts.length === 0) {
    parts.push(`${secs} second${secs !== 1 ? 's' : ''}`);
  }
  
  return parts.join(' ');
}

/**
 * Format range
 * 
 * @example
 * formatRange(10, 20) // '10-20'
 * formatRange(10, 20, '$') // '$10-$20'
 */
export function formatRange(
  min: number,
  max: number,
  prefix: string = '',
  suffix: string = ''
): string {
  return `${prefix}${min}${suffix}-${prefix}${max}${suffix}`;
}

/**
 * Format score
 * 
 * @example
 * formatScore(0.856) // '86%'
 * formatScore(85.6, 100) // '86 / 100'
 */
export function formatScore(
  score: number,
  maxScore?: number,
  decimals: number = 0
): string {
  if (maxScore !== undefined) {
    return `${score.toFixed(decimals)} / ${maxScore}`;
  }
  
  // Assume it's a decimal percentage
  if (score <= 1) {
    return formatPercent(score, decimals);
  }
  
  return `${score.toFixed(decimals)}%`;
}

/**
 * Format initials
 * 
 * @example
 * formatInitials('John Smith') // 'JS'
 * formatInitials('Mary Jane Watson') // 'MJW'
 */
export function formatInitials(name: string, maxInitials: number = 2): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join('');
}

/**
 * Format address
 * 
 * @example
 * formatAddress({ street: '123 Main St', city: 'Boston', state: 'MA', zip: '02101' })
 * // '123 Main St, Boston, MA 02101'
 */
export function formatAddress(address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string {
  const parts = [
    address.street,
    address.city,
    [address.state, address.zip].filter(Boolean).join(' '),
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
}

/**
 * Formatter Service Class
 */
export class FormatterService {
  private locale: string;
  private currency: string;
  
  constructor(locale: string = 'en-US', currency: string = 'USD') {
    this.locale = locale;
    this.currency = currency;
  }
  
  setLocale(locale: string) {
    this.locale = locale;
  }
  
  setCurrency(currency: string) {
    this.currency = currency;
  }
  
  currency(amount: number): string {
    return formatCurrency(amount, this.currency, this.locale);
  }
  
  number(num: number, decimals?: number): string {
    return formatNumber(num, this.locale, decimals);
  }
  
  percent(value: number, decimals: number = 2): string {
    return formatPercent(value, decimals, this.locale);
  }
  
  date(date: Date, format: 'short' | 'medium' | 'long' | 'full' = 'medium'): string {
    return formatDate(date, format, this.locale);
  }
  
  time(date: Date, use24Hour: boolean = false): string {
    return formatTime(date, use24Hour, this.locale);
  }
  
  dateTime(date: Date): string {
    return formatDateTime(date, this.locale);
  }
  
  relativeTime(date: Date): string {
    return formatRelativeTime(date, this.locale);
  }
  
  list(items: string[], type: 'conjunction' | 'disjunction' = 'conjunction'): string {
    return formatList(items, type, this.locale);
  }
  
  fileSize(bytes: number, decimals: number = 2): string {
    return formatFileSize(bytes, decimals);
  }
  
  compact(num: number, decimals: number = 1): string {
    return formatCompact(num, decimals);
  }
}

// Export singleton instance
export const formatter = new FormatterService();
