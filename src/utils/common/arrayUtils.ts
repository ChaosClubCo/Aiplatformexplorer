/**
 * Array Utility Functions
 * Production-grade array manipulation utilities
 * 
 * @module utils/common/arrayUtils
 */

/**
 * Chunk array into smaller arrays of specified size
 * 
 * @example
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) throw new Error('Chunk size must be greater than 0');
  
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Remove duplicates from array
 * 
 * @example
 * unique([1, 2, 2, 3, 3, 3]) // [1, 2, 3]
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Remove duplicates by key
 * 
 * @example
 * uniqueBy([{id: 1}, {id: 1}, {id: 2}], 'id') // [{id: 1}, {id: 2}]
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Group array items by key
 * 
 * @example
 * groupBy([{type: 'a', val: 1}, {type: 'a', val: 2}, {type: 'b', val: 3}], 'type')
 * // { a: [{type: 'a', val: 1}, {type: 'a', val: 2}], b: [{type: 'b', val: 3}] }
 */
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Sort array by multiple keys
 * 
 * @example
 * sortBy([{a: 2, b: 1}, {a: 1, b: 2}], ['a', 'b'])
 */
export function sortBy<T>(array: T[], keys: (keyof T)[]): T[] {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return -1;
      if (aVal > bVal) return 1;
    }
    return 0;
  });
}

/**
 * Find item by predicate or return default
 * 
 * @example
 * findOr([1, 2, 3], x => x > 5, 0) // 0
 */
export function findOr<T>(
  array: T[],
  predicate: (item: T) => boolean,
  defaultValue: T
): T {
  return array.find(predicate) ?? defaultValue;
}

/**
 * Partition array into two arrays based on predicate
 * 
 * @example
 * partition([1, 2, 3, 4], x => x % 2 === 0) // [[2, 4], [1, 3]]
 */
export function partition<T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  
  array.forEach(item => {
    if (predicate(item)) {
      pass.push(item);
    } else {
      fail.push(item);
    }
  });
  
  return [pass, fail];
}

/**
 * Shuffle array randomly
 * 
 * @example
 * shuffle([1, 2, 3, 4, 5])
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get random item from array
 * 
 * @example
 * sample([1, 2, 3, 4, 5])
 */
export function sample<T>(array: T[]): T | undefined {
  if (array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get n random items from array
 * 
 * @example
 * sampleSize([1, 2, 3, 4, 5], 3)
 */
export function sampleSize<T>(array: T[], n: number): T[] {
  if (n >= array.length) return shuffle(array);
  
  const shuffled = shuffle(array);
  return shuffled.slice(0, n);
}

/**
 * Check if arrays are equal
 * 
 * @example
 * isEqual([1, 2, 3], [1, 2, 3]) // true
 */
export function isEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Get intersection of two arrays
 * 
 * @example
 * intersection([1, 2, 3], [2, 3, 4]) // [2, 3]
 */
export function intersection<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter(item => set2.has(item));
}

/**
 * Get difference between two arrays
 * 
 * @example
 * difference([1, 2, 3], [2, 3, 4]) // [1]
 */
export function difference<T>(arr1: T[], arr2: T[]): T[] {
  const set2 = new Set(arr2);
  return arr1.filter(item => !set2.has(item));
}

/**
 * Flatten nested array
 * 
 * @example
 * flatten([[1, 2], [3, 4], [5]]) // [1, 2, 3, 4, 5]
 */
export function flatten<T>(array: T[][]): T[] {
  return array.flat();
}

/**
 * Flatten deeply nested array
 * 
 * @example
 * flattenDeep([[1, [2]], [3, [4, [5]]]]) // [1, 2, 3, 4, 5]
 */
export function flattenDeep(array: any[]): any[] {
  return array.flat(Infinity);
}

/**
 * Compact array (remove falsy values)
 * 
 * @example
 * compact([0, 1, false, 2, '', 3, null, undefined, NaN]) // [1, 2, 3]
 */
export function compact<T>(array: (T | null | undefined | false | '' | 0)[]): T[] {
  return array.filter(Boolean) as T[];
}

/**
 * Create range array
 * 
 * @example
 * range(1, 5) // [1, 2, 3, 4, 5]
 * range(0, 10, 2) // [0, 2, 4, 6, 8, 10]
 */
export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

/**
 * Sum array of numbers
 * 
 * @example
 * sum([1, 2, 3, 4, 5]) // 15
 */
export function sum(array: number[]): number {
  return array.reduce((total, num) => total + num, 0);
}

/**
 * Average array of numbers
 * 
 * @example
 * average([1, 2, 3, 4, 5]) // 3
 */
export function average(array: number[]): number {
  if (array.length === 0) return 0;
  return sum(array) / array.length;
}

/**
 * Get min value from array
 * 
 * @example
 * min([3, 1, 4, 1, 5]) // 1
 */
export function min(array: number[]): number {
  return Math.min(...array);
}

/**
 * Get max value from array
 * 
 * @example
 * max([3, 1, 4, 1, 5]) // 5
 */
export function max(array: number[]): number {
  return Math.max(...array);
}

/**
 * Get min by property
 * 
 * @example
 * minBy([{age: 20}, {age: 30}], 'age') // {age: 20}
 */
export function minBy<T>(array: T[], key: keyof T): T | undefined {
  if (array.length === 0) return undefined;
  
  return array.reduce((min, item) => 
    item[key] < min[key] ? item : min
  );
}

/**
 * Get max by property
 * 
 * @example
 * maxBy([{age: 20}, {age: 30}], 'age') // {age: 30}
 */
export function maxBy<T>(array: T[], key: keyof T): T | undefined {
  if (array.length === 0) return undefined;
  
  return array.reduce((max, item) => 
    item[key] > max[key] ? item : max
  );
}

/**
 * Count occurrences in array
 * 
 * @example
 * countBy(['a', 'b', 'a', 'c', 'a']) // { a: 3, b: 1, c: 1 }
 */
export function countBy<T extends string | number>(array: T[]): Record<T, number> {
  return array.reduce((counts, item) => {
    counts[item] = (counts[item] || 0) + 1;
    return counts;
  }, {} as Record<T, number>);
}

/**
 * Move item in array
 * 
 * @example
 * move([1, 2, 3, 4], 0, 2) // [2, 3, 1, 4]
 */
export function move<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...array];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  return result;
}

/**
 * Insert item at index
 * 
 * @example
 * insert([1, 2, 4], 2, 3) // [1, 2, 3, 4]
 */
export function insert<T>(array: T[], index: number, item: T): T[] {
  return [...array.slice(0, index), item, ...array.slice(index)];
}

/**
 * Remove item at index
 * 
 * @example
 * removeAt([1, 2, 3, 4], 2) // [1, 2, 4]
 */
export function removeAt<T>(array: T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

/**
 * Toggle item in array (add if not present, remove if present)
 * 
 * @example
 * toggle([1, 2, 3], 2) // [1, 3]
 * toggle([1, 2, 3], 4) // [1, 2, 3, 4]
 */
export function toggle<T>(array: T[], item: T): T[] {
  const index = array.indexOf(item);
  if (index === -1) {
    return [...array, item];
  }
  return removeAt(array, index);
}
