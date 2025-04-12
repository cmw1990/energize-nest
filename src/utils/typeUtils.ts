
/**
 * Utility functions for safely handling type conversions and casting
 */

/**
 * Safely cast a database object to an application type
 * This should be used when you're certain the shape mostly matches but TypeScript can't verify
 */
export function safeCast<T>(dbObject: any): T {
  if (!dbObject) return null as unknown as T;
  return dbObject as unknown as T;
}

/**
 * Safely cast an array of database objects to an array of application types
 */
export function safeArrayCast<T>(dbArray: any[]): T[] {
  if (!Array.isArray(dbArray)) return [] as T[];
  return dbArray.map(item => item as unknown as T);
}

/**
 * Type assertion to resolve "excessively deep" type errors
 * This is particularly useful for solving "Type instantiation is excessively deep and possibly infinite" errors
 */
export function assertType<T>(value: any): T {
  return value as T;
}

/**
 * Helper to handle 'unknown' types in arithmetic operations
 */
export function safeNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
}

/**
 * Apply a type adapter function to transform database results to application types
 */
export function adaptModel<T, U>(data: any, adapter: (item: any) => U): U {
  if (!data) return null as unknown as U;
  return adapter(data);
}

/**
 * Apply a type adapter function to an array of database results
 */
export function adaptArrayModel<T, U>(data: T[], adapter: (item: T) => U): U[] {
  if (!Array.isArray(data)) return [] as U[];
  return data.map(item => adapter(item));
}

/**
 * Safely access property from unknown object with fallback
 */
export function safeGet<T>(obj: any, prop: string, fallback: T): T {
  if (!obj || typeof obj !== 'object') return fallback;
  return (obj[prop] !== undefined && obj[prop] !== null) ? obj[prop] : fallback;
}

/**
 * Type-safe data extraction with default value for nested properties
 */
export function safeGetNested<T>(obj: any, path: string, defaultValue: T): T {
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
 * Type-safe helper for handling database result rows with proper type conversion
 */
export function safeDBResult<T>(result: any): T {
  return result as unknown as T;
}

/**
 * Wrap raw database query results with proper type assertion
 * Use this to avoid "excessively deep and possibly infinite" type errors
 */
export function wrapQueryResult<T>(queryFn: () => Promise<any>): Promise<T> {
  return queryFn().then(result => result as unknown as T);
}
