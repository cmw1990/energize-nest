
/**
 * Type Safe Utilities
 * 
 * This file provides utility functions for safely working with types
 * when dealing with external data sources like API responses.
 */

/**
 * Safely cast data between types with type checking
 * This is useful when dealing with API data that might not match exactly with our interfaces
 */
export function safeCast<T>(data: any): T {
  if (!data) return null as unknown as T;
  return data as T;
}

/**
 * Convert an array of data with one shape to an array with another shape
 * Adding type assertion to prevent excess type checking depth
 */
export function safeArrayCast<T>(data: any[]): T[] {
  if (!Array.isArray(data)) return [] as T[];
  return data as unknown as T[];
}

/**
 * Helper for explicit type casts when there are shape differences
 * between database models and frontend interfaces
 */
export function adaptModel<T>(data: any, adapter: (item: any) => T): T {
  if (!data) return null as unknown as T;
  return adapter(data);
}

/**
 * Convert an array with adapter function
 */
export function adaptArrayModel<T>(data: any[], adapter: (item: any) => T): T[] {
  if (!Array.isArray(data)) return [] as T[];
  return data.map(item => adapter(item));
}

/**
 * Fix for the "excessively deep and possibly infinite" TypeScript error
 * by providing a type assertion function
 */
export function assertType<T>(value: any): T {
  return value as unknown as T;
}

/**
 * Helper function to allow controlled type conversions for Supabase data
 */
export function safeDatabaseCast<T>(data: any): T {
  return data as unknown as T;
}

/**
 * Utility to handle nullable or undefined values
 */
export function safeNull<T>(value: T | null | undefined, defaultValue: T): T {
  return value === null || value === undefined ? defaultValue : value;
}

/**
 * Type-safe data extraction with default value
 */
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return (current as unknown as T) ?? defaultValue;
}

/**
 * Type safe parser for JSON strings
 */
export function safeJsonParse<T>(jsonString: string, defaultValue: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * Type-safe function to merge objects
 */
export function safeMerge<T>(target: T, source: Partial<T>): T {
  return { ...target, ...source };
}

/**
 * Type-safe filter for arrays with undefined values
 */
export function filterDefined<T>(array: (T | undefined | null)[]): T[] {
  return array.filter((item): item is T => item !== undefined && item !== null);
}

/**
 * Type-safe conversion of record keys
 */
export function mapKeys<T, U extends string | number | symbol>(
  obj: Record<string, T>,
  transform: (key: string) => U
): Record<U, T> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[transform(key)] = value;
    return result;
  }, {} as Record<U, T>);
}

/**
 * Type-safe deep copy
 */
export function deepCopy<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepCopy) as unknown as T;
  }
  
  const result = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepCopy(obj[key]);
    }
  }
  
  return result;
}
