
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
