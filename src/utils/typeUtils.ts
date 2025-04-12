
/**
 * Utility functions for safely handling type conversions and casting
 */

/**
 * Safely cast a database object to an application type
 */
export function safeCast<T>(dbObject: any): T {
  return dbObject as unknown as T;
}

/**
 * Safely cast an array of database objects to an array of application types
 */
export function safeArrayCast<T>(dbArray: any[]): T[] {
  if (!Array.isArray(dbArray)) return [] as T[];
  return dbArray as unknown as T[];
}

/**
 * Type assertion to resolve "excessively deep" type errors
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
export function adaptModel<T, U>(data: T, adapter: (item: T) => U): U {
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
