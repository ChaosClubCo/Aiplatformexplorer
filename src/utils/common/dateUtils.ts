/**
 * Date Utility Functions
 * Production-grade date manipulation utilities
 * 
 * @module utils/common/dateUtils
 */

/**
 * Format date to string
 * 
 * @example
 * formatDate(new Date('2024-01-15'), 'YYYY-MM-DD') // '2024-01-15'
 */
export function formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * Format date to relative time
 * 
 * @example
 * timeAgo(new Date(Date.now() - 5000)) // '5 seconds ago'
 */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
  }
  
  return 'just now';
}

/**
 * Format date to relative time (future)
 * 
 * @example
 * timeUntil(new Date(Date.now() + 5000)) // 'in 5 seconds'
 */
export function timeUntil(date: Date): string {
  const seconds = Math.floor((date.getTime() - Date.now()) / 1000);
  
  if (seconds < 0) return timeAgo(date);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
    { label: 'second', seconds: 1 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `in ${count} ${interval.label}${count !== 1 ? 's' : ''}`;
    }
  }
  
  return 'now';
}

/**
 * Add days to date
 * 
 * @example
 * addDays(new Date('2024-01-01'), 5) // Date('2024-01-06')
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Add months to date
 * 
 * @example
 * addMonths(new Date('2024-01-15'), 2) // Date('2024-03-15')
 */
export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

/**
 * Add years to date
 * 
 * @example
 * addYears(new Date('2024-01-01'), 1) // Date('2025-01-01')
 */
export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

/**
 * Get difference in days
 * 
 * @example
 * diffInDays(new Date('2024-01-05'), new Date('2024-01-01')) // 4
 */
export function diffInDays(date1: Date, date2: Date): number {
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get difference in hours
 * 
 * @example
 * diffInHours(new Date('2024-01-01 05:00'), new Date('2024-01-01 01:00')) // 4
 */
export function diffInHours(date1: Date, date2: Date): number {
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60 * 60));
}

/**
 * Get difference in minutes
 * 
 * @example
 * diffInMinutes(new Date('2024-01-01 01:05'), new Date('2024-01-01 01:00')) // 5
 */
export function diffInMinutes(date1: Date, date2: Date): number {
  const diff = date1.getTime() - date2.getTime();
  return Math.floor(diff / (1000 * 60));
}

/**
 * Check if date is today
 * 
 * @example
 * isToday(new Date()) // true
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 * 
 * @example
 * isYesterday(new Date(Date.now() - 86400000)) // true
 */
export function isYesterday(date: Date): boolean {
  const yesterday = addDays(new Date(), -1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Check if date is tomorrow
 * 
 * @example
 * isTomorrow(new Date(Date.now() + 86400000)) // true
 */
export function isTomorrow(date: Date): boolean {
  const tomorrow = addDays(new Date(), 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
}

/**
 * Check if date is in the past
 * 
 * @example
 * isPast(new Date('2020-01-01')) // true
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Check if date is in the future
 * 
 * @example
 * isFuture(new Date('2030-01-01')) // true
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/**
 * Check if dates are same day
 * 
 * @example
 * isSameDay(new Date('2024-01-01 10:00'), new Date('2024-01-01 15:00')) // true
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
}

/**
 * Check if date is weekend
 * 
 * @example
 * isWeekend(new Date('2024-01-06')) // true (Saturday)
 */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

/**
 * Check if date is weekday
 * 
 * @example
 * isWeekday(new Date('2024-01-08')) // true (Monday)
 */
export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

/**
 * Get start of day
 * 
 * @example
 * startOfDay(new Date('2024-01-01 15:30:45')) // Date('2024-01-01 00:00:00')
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 * 
 * @example
 * endOfDay(new Date('2024-01-01 15:30:45')) // Date('2024-01-01 23:59:59.999')
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of month
 * 
 * @example
 * startOfMonth(new Date('2024-01-15')) // Date('2024-01-01')
 */
export function startOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of month
 * 
 * @example
 * endOfMonth(new Date('2024-01-15')) // Date('2024-01-31 23:59:59.999')
 */
export function endOfMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1, 0);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get start of year
 * 
 * @example
 * startOfYear(new Date('2024-06-15')) // Date('2024-01-01')
 */
export function startOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(0, 1);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of year
 * 
 * @example
 * endOfYear(new Date('2024-06-15')) // Date('2024-12-31 23:59:59.999')
 */
export function endOfYear(date: Date): Date {
  const result = new Date(date);
  result.setMonth(11, 31);
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * Get days in month
 * 
 * @example
 * getDaysInMonth(new Date('2024-02-01')) // 29 (leap year)
 */
export function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

/**
 * Check if leap year
 * 
 * @example
 * isLeapYear(new Date('2024-01-01')) // true
 */
export function isLeapYear(date: Date): boolean {
  const year = date.getFullYear();
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * Get week number
 * 
 * @example
 * getWeekNumber(new Date('2024-01-15')) // 3
 */
export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Format duration in milliseconds
 * 
 * @example
 * formatDuration(125000) // '2m 5s'
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ${hours % 24}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  }
  return `${seconds}s`;
}

/**
 * Parse ISO date string
 * 
 * @example
 * parseISO('2024-01-15T10:30:00Z')
 */
export function parseISO(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Format date to ISO string
 * 
 * @example
 * toISO(new Date('2024-01-15')) // '2024-01-15T00:00:00.000Z'
 */
export function toISO(date: Date): string {
  return date.toISOString();
}

/**
 * Get timezone offset in hours
 * 
 * @example
 * getTimezoneOffset() // -5 (for EST)
 */
export function getTimezoneOffset(): number {
  return -new Date().getTimezoneOffset() / 60;
}

/**
 * Convert to local timezone
 * 
 * @example
 * toLocal(new Date('2024-01-15T10:00:00Z'))
 */
export function toLocal(date: Date): Date {
  return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}

/**
 * Convert to UTC
 * 
 * @example
 * toUTC(new Date('2024-01-15T10:00:00'))
 */
export function toUTC(date: Date): Date {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
}
